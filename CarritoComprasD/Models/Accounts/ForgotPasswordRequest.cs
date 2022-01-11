using System.ComponentModel.DataAnnotations;

namespace CarritoComprasD.Models.Account
{
    public class ForgotPasswordRequest
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; }
    }
}