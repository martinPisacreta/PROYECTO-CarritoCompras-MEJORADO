using System.ComponentModel.DataAnnotations;

namespace CarritoComprasD.Models.Usuario
{
    public class VerifyEmailRequest
    {
        [Required]
        public string Token { get; set; }
    }
}