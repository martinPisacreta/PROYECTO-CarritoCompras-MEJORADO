using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CarritoComprasD.Helpers.AppSettings
{
    public class _AppSettings
    {

        // refresh token time to live (in days), inactive tokens are
        // automatically deleted from the database after this time
        public int Refresh_Token_TTL { get; set; }
        public string Secret { get; set; }
        public string Email_From { get; set; }
        public string Smtp_User { get; set; }
        public string Smtp_Pass { get; set; }
        public string Smtp_Host { get; set; }
        public int Smtp_Port { get; set; }
      
    }
}
