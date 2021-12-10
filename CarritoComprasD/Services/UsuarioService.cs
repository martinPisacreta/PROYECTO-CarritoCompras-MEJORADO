using AutoMapper;
using BC = BCrypt.Net.BCrypt;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using CarritoComprasD.Entities;
using CarritoComprasD.Models.Usuario;
using CarritoComprasD.Helpers;
using CarritoComprasD.Helpers.AppSettings;

namespace CarritoComprasD.Services
{
    public interface IUsuarioService
    {
        AuthenticateResponse Authenticate(AuthenticateRequest model, string ipAddress);
        AuthenticateResponse RefreshToken(string token, string ipAddress);
        void RevokeToken(string token, string ipAddress);
        void Register(RegisterRequest model, string origin);
        void VerifyEmail(string token);
        void ForgotPassword(ForgotPasswordRequest model, string origin);
        void ValidateResetToken(ValidateResetTokenRequest model);
        void ResetPassword(ResetPasswordRequest model);
        IEnumerable<UsuarioResponse> GetAll();
        UsuarioResponse GetById(int id);
        UsuarioResponse Create(CreateUsuarioRequest model);
        UsuarioResponse Update(int id, UpdateUsuarioRequest model);
        void Delete(int id);
    }

    public class UsuarioService : IUsuarioService
    {
        private readonly CarritoComprasWebContext _context;
        private readonly IMapper _mapper;
        private readonly _Jwt _appSettings_jwt;
        private readonly _Email_Destino_Pedido _appSettings_emailDestinoPedido;
        private readonly IEmailService _emailService;

        public UsuarioService(
            CarritoComprasWebContext context,
            IMapper mapper,
            IOptions<_Jwt> appSettings_jwt,
            IOptions<_Email_Destino_Pedido> appSettings_emailDestinoPedido,
            IEmailService emailService)
        {
            _context = context;
            _mapper = mapper;
            _appSettings_jwt = appSettings_jwt.Value;
            _appSettings_emailDestinoPedido = appSettings_emailDestinoPedido.Value;
            _emailService = emailService;
        }

        public AuthenticateResponse Authenticate(AuthenticateRequest model, string ipAddress)
        {
            var usuario = _context.Usuario.SingleOrDefault(x => x.Email == model.Email);

            if (usuario == null || !usuario.IsVerified || !BC.Verify(model.Password, usuario.Password))
                throw new AppException("Email o contraseña incorrectos");

            // authentication successful so generate jwt and refresh tokens
            var token = generateToken(usuario);
            var refreshToken = generateRefreshToken(ipAddress);
            usuario.RefreshToken.Add(refreshToken);

            // remove old refresh tokens from usuario
            removeOldRefreshTokens(usuario);

            // save changes to db
            _context.Update(usuario);
            _context.SaveChanges();

            var response = _mapper.Map<AuthenticateResponse>(usuario);
            response.Token = token;
            response.RefreshToken = refreshToken.Token;
            return response;
        }

        public AuthenticateResponse RefreshToken(string _token, string ipAddress)
        {
            var (refreshToken, usuario) = getRefreshToken(_token);

            // replace old refresh token with a new one and save
            var newRefreshToken = generateRefreshToken(ipAddress);
            refreshToken.Revoked = DateTime.UtcNow;
            refreshToken.RevokedByIp = ipAddress;
            refreshToken.ReplacedByToken = newRefreshToken.Token;
            usuario.RefreshToken.Add(newRefreshToken);

            removeOldRefreshTokens(usuario);

            _context.Update(usuario);
            _context.SaveChanges();

            // generate new jwt
            var token = generateToken(usuario);

            var response = _mapper.Map<AuthenticateResponse>(usuario);
            response.Token = token;
            response.RefreshToken = newRefreshToken.Token;
            return response;
        }

        public void RevokeToken(string token, string ipAddress)
        {
            var (refreshToken, usuario) = getRefreshToken(token);

            // revoke token and save
            refreshToken.Revoked = DateTime.UtcNow;
            refreshToken.RevokedByIp = ipAddress;
            _context.Update(usuario);
            _context.SaveChanges();
        }

        public void Register(RegisterRequest model, string origin)
        {
            // validate
            if (_context.Usuario.Any(x => x.Email == model.Email))
            {
                // send already registered error in email to prevent usuario enumeration
                //sendAlreadyRegisteredEmail(model.Email, origin);
                throw new AppException("Email ya registrado");
            }

            // map model to new usuario object
            var usuario = _mapper.Map<Usuario>(model);

            // first registered usuario is an admin




            var isFirstUsuario = _context.Usuario.Count() == 0;

            usuario.Email = model.Email;
            usuario.Password = BC.HashPassword(model.Password);
            usuario.RazonSocial = model.RazonSocial;
            usuario.Cuit = model.Cuit;
            usuario.AceptaTerminos = true;
            usuario.Rol = isFirstUsuario ? "Admin" : "User";
            usuario.TokenVerificacion = randomTokenString();
            usuario.TokenReseteo = null;
            usuario.TokenReseteoFechaExpiracion = null;
            usuario.FechaCreacionUsuario = DateTime.UtcNow;
            usuario.FechaUltimaModificacionUsuario = DateTime.Now;
            usuario.Telefono = model.Telefono;
            usuario.Nombre = model.Nombre;
            usuario.Apellido = model.Apellido;
            usuario.DireccionValor = model.DireccionValor;
            usuario.DireccionDescripcion = model.DireccionDescripcion;
            usuario.Lat = model.Lat;
            usuario.Lng = model.Lng;
            usuario.Utilidad = 20;


     

            // save usuario
            _context.Usuario.Add(usuario);
            _context.SaveChanges();

            // send email
            sendVerificationEmail(usuario, origin,_appSettings_emailDestinoPedido.Cuenta);
        }

        public void VerifyEmail(string token)
        {
            try
            {
                var usuario = _context.Usuario.SingleOrDefault(x => x.TokenVerificacion == token);

                if (usuario == null) throw new AppException("Verificacion fallida");

                usuario.Verified = DateTime.UtcNow;
                usuario.TokenVerificacion = null;

                _context.Usuario.Update(usuario);
                _context.SaveChanges();
            }
            catch(Exception ex)
            {
                throw ex;
            }
        }

        public void ForgotPassword(ForgotPasswordRequest model, string origin)
        {
            var usuario = _context.Usuario.SingleOrDefault(x => x.Email == model.Email);

            // always return ok response to prevent email enumeration
            if (usuario == null) return;

            // create reset token that expires after 1 day
            usuario.TokenReseteo = randomTokenString();
            usuario.TokenReseteoFechaExpiracion = DateTime.UtcNow.AddDays(1);

            _context.Usuario.Update(usuario);
            _context.SaveChanges();

            // send email
            sendPasswordResetEmail(usuario, origin);
        }

        public void ValidateResetToken(ValidateResetTokenRequest model)
        {
            var usuario = _context.Usuario.SingleOrDefault(x =>
                x.TokenReseteo == model.Token &&
                x.TokenReseteoFechaExpiracion > DateTime.UtcNow);

            if (usuario == null)
                throw new AppException("Token invalido");
        }

        public void ResetPassword(ResetPasswordRequest model)
        {
            var usuario = _context.Usuario.SingleOrDefault(x =>
                x.TokenReseteo == model.Token &&
                x.TokenReseteoFechaExpiracion > DateTime.UtcNow);

            if (usuario == null)
                throw new AppException("Token invalido");

            // update password and remove reset token
            usuario.Password = BC.HashPassword(model.Password);
            usuario.PasswordReset = DateTime.UtcNow;
            usuario.TokenReseteo = null;
            usuario.TokenReseteoFechaExpiracion = null;

            _context.Usuario.Update(usuario);
            _context.SaveChanges();
        }

        public IEnumerable<UsuarioResponse> GetAll()
        {
            var usuarios = _context.Usuario;
            return _mapper.Map<IList<UsuarioResponse>>(usuarios);
        }

        public UsuarioResponse GetById(int id)
        {
            var usuario = getUsuario(id);
            return _mapper.Map<UsuarioResponse>(usuario);
        }

        public UsuarioResponse Create(CreateUsuarioRequest model)
        {
            // validate
            if (_context.Usuario.Any(x => x.Email == model.Email))
                throw new AppException($"Email '{model.Email}' esta registrado");

            // map model to new usuario object
            var usuario = _mapper.Map<Usuario>(model);
            usuario.FechaCreacionUsuario = DateTime.UtcNow;
            usuario.Verified = DateTime.UtcNow;

            // hash password
            usuario.Password = BC.HashPassword(model.Password);

            // save usuario
            _context.Usuario.Add(usuario);
            _context.SaveChanges();

            return _mapper.Map<UsuarioResponse>(usuario);
        }

        public UsuarioResponse Update(int id, UpdateUsuarioRequest model)
        {
            var usuario = getUsuario(id);

            // validate
            if (usuario.Email != model.Email && _context.Usuario.Any(x => x.Email == model.Email))
                throw new AppException($"email '{model.Email}' ya esta eligido");

            // hash password if it was entered
            if (!string.IsNullOrEmpty(model.Password))
                usuario.Password = BC.HashPassword(model.Password);

            // copy model to usuario and save
            _mapper.Map(model, usuario);
            usuario.FechaUltimaModificacionUsuario = DateTime.UtcNow;
            _context.Usuario.Update(usuario);
            _context.SaveChanges();

            return _mapper.Map<UsuarioResponse>(usuario);
        }

        public void Delete(int id)
        {
            var usuario = getUsuario(id);
            _context.Usuario.Remove(usuario);
            _context.SaveChanges();
        }

        // helper methods

        private Usuario getUsuario(int id)
        {
            var usuario = _context.Usuario.Find(id);
            if (usuario == null) throw new KeyNotFoundException("Usuario no encontrado");
            return usuario;
        }

        private (RefreshToken, Usuario) getRefreshToken(string token)
        {
            var usuario = _context.Usuario.SingleOrDefault(u => u.RefreshToken.Any(t => t.Token == token));
            if (usuario == null) throw new AppException("Token invalido");
            var refresh_token = _context.RefreshToken.Where(rt => rt.IdUsuario == usuario.IdUsuario).ToList();
        
            var refreshToken = refresh_token.Single(x => x.Token == token);
            if (!refreshToken.IsActive) throw new AppException("Token invalido");
            return (refreshToken, usuario);
        }

        private string generateToken(Usuario usuario)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_appSettings_jwt.Key);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[] { new Claim("id", usuario.IdUsuario.ToString()) }),
                Expires = DateTime.UtcNow.AddMinutes(15),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };
            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }

        private RefreshToken generateRefreshToken(string ipAddress)
        {
            return new RefreshToken
            {
                Token = randomTokenString(),
                Expires = DateTime.UtcNow.AddDays(7),
                Created = DateTime.UtcNow,
                CreatedByIp = ipAddress
            };
        }

        private void removeOldRefreshTokens(Usuario usuario)
        {
            usuario.RefreshToken.ToList().RemoveAll(x => 
                !x.IsActive && 
                x.Created.AddDays(_appSettings_jwt.RefreshTokenTTL) <= DateTime.UtcNow);
        }

        private string randomTokenString()
        {
            using var rngCryptoServiceProvider = new RNGCryptoServiceProvider();
            var randomBytes = new byte[40];
            rngCryptoServiceProvider.GetBytes(randomBytes);
            // convert random bytes to hex string
            return BitConverter.ToString(randomBytes).Replace("-", "");
        }

        private void sendVerificationEmail(Usuario usuario, string origin,string _to)
        {
            string message;
            if (!string.IsNullOrEmpty(origin))
            {
                var verifyUrl = $"{origin}/usuario/verify-email?token=" + usuario.TokenVerificacion;
                message = "<h4>Activar usuario</h4>" +
                                     "<p> ¡Un usuario nuevo quiere registrarse a la web! </p>" +
                                     "<p> Utilice el siguiente token para activar su usuario: </p>" +
                                     "<p><a class='btn btn-primary' href=" + verifyUrl + "> Verificar </a></p>";
            }
            else
            {
                message = "<h4>Activar usuario</h4>" +
                                      "<p> Contactese con el administrador para validar activar su usuario </p>";
            }

            _emailService.Send(
                to: _to,
                subject: "Activar usuario : " + usuario.RazonSocial,
                html: $@"{message}"
            );
        }

        private void sendAlreadyRegisteredEmail(string email, string origin)
        {
            string message;
            if (!string.IsNullOrEmpty(origin))
                message = $@"<p>Si no conoce su contraseña, visite la pagina <a href=""{origin}/usuario/forgot-password"">Has olvidado tu contraseña</a></p>";
            else
                message = "<p>Si no conoce su contraseña, puede restablecerla a través de <code>/usuario/forgot-password</code></p>";

            _emailService.Send(
                to: email,
                subject: "Email ya registrado",
                html: $@"<h4>Tu email <strong>{email}</strong> esta registrado.</p>
                         {message}"
            );
        }

        private void sendPasswordResetEmail(Usuario usuario, string origin)
        {
            string message;
            if (!string.IsNullOrEmpty(origin))
            {
                var resetUrl = $"{origin}/usuario/reset-password?token=" + usuario.TokenReseteo;
                message = "<h4>Restablecer contraseña email </h4>" +
                                  "<p>Haga clic en el siguiente enlace para restablecer su contraseña, el enlace será válido por 1 día:</p>" +
                                  "<p><a class='btn btn-primary' href=" + resetUrl + "> Restablecer </a></p>";
            }
            else
            {
              
                message = "<h4>Restablecer contraseña email </h4>" +
                                  "<p> Contactese con el administrador para Restablecer contraseña email </p>";
            }

            _emailService.Send(
                to: usuario.Email,
                subject: "Restablecer contraseña",
                html: $@"{message}"
            );
        }
    }
}
