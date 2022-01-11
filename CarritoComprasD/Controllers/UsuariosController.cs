using AutoMapper;
using CarritoComprasD.Controllers;
using CarritoComprasD.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using CarritoComprasD.Entities;
using CarritoComprasD.Models.Account;

namespace WebApi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class UsuariosController : BaseController
    {
        private readonly IUsuarioService _usuarioService;
        private readonly IMapper _mapper;

        public UsuariosController(
            IUsuarioService usuarioService,
            IMapper mapper)
        {
            _usuarioService = usuarioService;
            _mapper = mapper;
        }

        [HttpPost("authenticate")]
        public ActionResult<AuthenticateResponse> Authenticate(AuthenticateRequest model)
        {
            var response = _usuarioService.Authenticate(model, ipAddress());
            //setTokenCookie(response.RefreshToken);
            return Ok(response);
        }

        [HttpPost("refresh-token")]
        public ActionResult<AuthenticateResponse> RefreshToken(RefreshTokenRequest model)
        {

            var response = _usuarioService.RefreshToken(model.IdUsuario,ipAddress());
            //setTokenCookie(response.RefreshToken);
            return Ok(response);
        }

       

        [HttpPost("register")]
        public IActionResult Register(RegisterRequest model)
        {
            _usuarioService.Register(model, Request.Headers["origin"]);
            return Ok(new { message = "Registro exitoso, contactese con el administrador para saber que pasos seguir" });
        }

        [HttpPost("verify-email")]
        public IActionResult VerifyEmail(VerifyEmailRequest model)
        {
            _usuarioService.VerifyEmail(model.Token);
            return Ok(new { message = "Verificación exitosa, ahora puede iniciar sesión" });
        }

        [HttpPost("forgot-password")]
        public IActionResult ForgotPassword(ForgotPasswordRequest model)
        {
            _usuarioService.ForgotPassword(model, Request.Headers["origin"]);
            return Ok(new { message = "Consulte su correo electrónico para obtener instrucciones para restablecer la contraseña" });
        }

        [HttpPost("validate-reset-token")]
        public IActionResult ValidateResetToken(ValidateResetTokenRequest model)
        {
            _usuarioService.ValidateResetToken(model);
            return Ok(new { message = "Token es valido" });
        }

        [HttpPost("reset-password")]
        public IActionResult ResetPassword(ResetPasswordRequest model)
        {
            _usuarioService.ResetPassword(model);
            return Ok(new { message = "Restablecimiento de contraseña exitoso, ahora puede iniciar sesión" });
        }

        [Authorize(Role.Admin)]
        [HttpGet]
        public ActionResult<IEnumerable<UsuarioResponse>> GetAll()
        {
            var usuarios = _usuarioService.GetAll();
            return Ok(usuarios);
        }

        [Authorize]
        [HttpGet("{id:int}")]
        public ActionResult<UsuarioResponse> GetById(int id)
        {
  

            var usuario = _usuarioService.GetById(id);
            return Ok(usuario);
        }

        [Authorize(Role.Admin)]
        [HttpPost]
        public ActionResult<UsuarioResponse> Create(CreateUsuarioRequest model)
        {
            var usuario = _usuarioService.Create(model);
            return Ok(usuario);
        }

        [Authorize]
        [HttpPut("{id:int}")]
        public ActionResult<UsuarioResponse> Update(int id, UpdateUsuarioRequest model)
        {
           

            // only admins can update role
            if (Usuario.Rol != "Admin")
                model.Role = null;

            var usuario = _usuarioService.Update(id, model);
            return Ok(usuario);
        }

        [Authorize]
        [HttpDelete("{id:int}")]
        public IActionResult Delete(int id)
        {
            //// users can delete their own usuario and admins can delete any usuario
            //if (id != Usuario.IdUsuario && Usuario.Rol != "Admin")
            //    return Unauthorized(new { message = "Sin Autorizacion" });

            _usuarioService.Delete(id);
            return Ok(new { message = "Usuario eliminado exitosamente" });
        }

        // helper methods

        private void setTokenCookie(string token)
        {
            var cookieOptions = new CookieOptions
            {
                HttpOnly = true,
                Expires = DateTime.UtcNow.AddDays(7)
            };
            Response.Cookies.Append("refreshToken", token, cookieOptions);
        }

        private string ipAddress()
        {
            if (Request.Headers.ContainsKey("X-Forwarded-For"))
                return Request.Headers["X-Forwarded-For"];
            else
                return HttpContext.Connection.RemoteIpAddress.MapToIPv4().ToString();
        }
    }
}