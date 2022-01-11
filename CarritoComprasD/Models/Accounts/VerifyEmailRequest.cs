using System.ComponentModel.DataAnnotations;

namespace CarritoComprasD.Models.Account
{
    public class VerifyEmailRequest
    {
        [Required]
        public string Token { get; set; }
    }
}