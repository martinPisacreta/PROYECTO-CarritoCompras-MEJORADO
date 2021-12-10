using System;
using System.Collections.Generic;

// Code scaffolded by EF Core assumes nullable reference types (NRTs) are not used or disabled.
// If you have enabled NRTs for your project, then un-comment the following line:
// #nullable disable

namespace CarritoComprasD.Entities
{
    public partial class Usuario
    {
        public Usuario()
        {
            RefreshToken = new HashSet<RefreshToken>();
            UsuarioPedido = new HashSet<UsuarioPedido>();
        }

        public int IdUsuario { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public string RazonSocial { get; set; }
        public string Cuit { get; set; }
        public bool? AceptaTerminos { get; set; }
        public string Rol { get; set; }
        public string TokenVerificacion { get; set; }
        public string TokenReseteo { get; set; }
        public DateTime? TokenReseteoFechaExpiracion { get; set; }
        public DateTime? FechaCreacionUsuario { get; set; }
        public DateTime? FechaUltimaModificacionUsuario { get; set; }
        public string Telefono { get; set; }
        public string Nombre { get; set; }
        public string Apellido { get; set; }
        public string DireccionValor { get; set; }
        public string DireccionDescripcion { get; set; }
        public string Lat { get; set; }
        public string Lng { get; set; }
        public int Utilidad { get; set; }
        public DateTime? Verified { get; set; }
        public DateTime? PasswordReset { get; set; }

        public virtual ICollection<RefreshToken> RefreshToken { get; set; }
        public virtual ICollection<UsuarioPedido> UsuarioPedido { get; set; }
    }
}
