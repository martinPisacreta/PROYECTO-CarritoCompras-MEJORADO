using System.ComponentModel.DataAnnotations;

namespace CarritoComprasD.Models.Account
{
    public class ValidateResetTokenRequest
    {
        [Required]
        public string Token { get; set; }
    }
}