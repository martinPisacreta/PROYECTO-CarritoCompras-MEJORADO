using System.ComponentModel.DataAnnotations;
using CarritoComprasD.Entities;

namespace CarritoComprasD.Models.Usuario
{
    public class UpdateUsuarioRequest
    {
    
        [Required]
        public string Email { get; set; }

        [Required]
        [MinLength(6)]
        public string Password { get; set; }

        [Required]
        [Compare("Password")]
        public string ConfirmPassword { get; set; }

        [Required]
        public string RazonSocial { get; set; }

        [Required]
        public string Cuit { get; set; }


        [Required]
        [EnumDataType(typeof(Role))]
        public string Role { get; set; }

        [Required]
        public string Telefono { get; set; }

        [Required]
        public string Nombre { get; set; }

        [Required]
        public string Apellido { get; set; }

        [Required]
        public string DireccionValor { get; set; }

        [Required]
        public string DireccionDescripcion { get; set; }

        [Required]
        public string Lat { get; set; }

        [Required]
        public string Lng { get; set; }

        [Required]
        public int Utilidad { get; set; }

    }
}