using System.ComponentModel.DataAnnotations;

namespace CarritoComprasD.Models.Usuario
{
    public class ForgotPasswordRequest
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; }
    }
}