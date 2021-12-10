using System.ComponentModel.DataAnnotations;

namespace CarritoComprasD.Models.Usuario
{
    public class ValidateResetTokenRequest
    {
        [Required]
        public string Token { get; set; }
    }
}