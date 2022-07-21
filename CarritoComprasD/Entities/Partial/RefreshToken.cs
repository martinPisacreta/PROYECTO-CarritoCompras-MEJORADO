using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CarritoComprasD.Entities
{
    public partial class RefreshToken
    {
        public bool IsExpired => DateTime.UtcNow >= this.Expires;
        public bool IsActive => Revoked == null && !this.IsExpired;

    }
}
