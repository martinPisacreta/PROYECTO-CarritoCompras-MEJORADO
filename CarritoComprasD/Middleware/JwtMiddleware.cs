using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using CarritoComprasD.Entities;
using CarritoComprasD.Helpers;
using CarritoComprasD.Helpers.AppSettings;
using Microsoft.EntityFrameworkCore;

namespace CarritoComprasD.Middleware
{
    public class JwtMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly _AppSettings _appSettings_appSettings;

        public JwtMiddleware(RequestDelegate next, IOptions<_AppSettings> appSettings_jwt)
        {
            _next = next;
            _appSettings_appSettings = appSettings_jwt.Value;
        }

        public async Task Invoke(HttpContext context, CarritoComprasWebContext dataContext)
        {
            var token = context.Request.Headers["Authorization"].FirstOrDefault()?.Split(" ").Last();

            if (token != null)
                await attachUsuarioToContext(context, dataContext, token);

            await _next(context);
        }

        private async Task attachUsuarioToContext(HttpContext context, CarritoComprasWebContext dataContext, string _token)
        {
            try
            {
                var tokenHandler = new JwtSecurityTokenHandler();
                var key = Encoding.ASCII.GetBytes(_appSettings_appSettings.Secret);
                tokenHandler.ValidateToken(_token, new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(key),
                    ValidateIssuer = false,
                    ValidateAudience = false,
                    // set clockskew to zero so tokens expire exactly at token expiration time (instead of 5 minutes later)
                    ClockSkew = TimeSpan.Zero
                }, out SecurityToken validatedToken);

                var token = (JwtSecurityToken)validatedToken;
                var usuarioId = int.Parse(token.Claims.First(x => x.Type == "id").Value);

                // attach usuario to context on successful jwt validation
                Usuario usuario = await dataContext.Usuario
                                                   .Include(m => m.RefreshToken) //agrego a la respuesta esta tabla RefreshToken
                                                   .Where(u => u.IdUsuario == usuarioId)
                                                   .FirstOrDefaultAsync();
                context.Items["Usuario"] = usuario;
          
            }
            catch 
            {
                // do nothing if jwt validation fails
                // usuario is not attached to context so request won't have access to secure routes
            }
        }
    }
}