using System;

namespace CarritoComprasD.Models.Account
{
    public class UsuarioResponse
    {


        public int IdUsuario { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public string RazonSocial { get; set; }
        public string Cuit { get; set; }
        public string Role { get; set; }
        public bool IsVerified { get; set; }
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
  
    }
}