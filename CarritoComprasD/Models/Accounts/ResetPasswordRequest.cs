using System.ComponentModel.DataAnnotations;

namespace CarritoComprasD.Models.Account
{
    public class ResetPasswordRequest
    {
        [Required]
        public string Token { get; set; }

        [Required]

        public string Password { get; set; }

        [Required]
        [Compare("Password")]
        public string ConfirmPassword { get; set; }
    }
}