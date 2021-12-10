using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CarritoComprasD.Entities
{
    public partial class Usuario
    {
        public bool IsVerified => Verified.HasValue || PasswordReset.HasValue;
        public bool OwnsToken(string token)
        {
            return this.RefreshToken.ToList()?.Find(x => x.Token == token) != null;
        }


    }
}
