using System;
using System.Collections.Generic;

// Code scaffolded by EF Core assumes nullable reference types (NRTs) are not used or disabled.
// If you have enabled NRTs for your project, then un-comment the following line:
// #nullable disable

namespace CarritoComprasD.Entities
{
    public partial class Marca
    {
        public Marca()
        {
            Familia = new HashSet<Familia>();
        }

        public int IdTablaMarca { get; set; }
        public int IdMarca { get; set; }
        public int IdProveedor { get; set; }
        public string TxtDescMarca { get; set; }
        public int SnActivo { get; set; }
        public DateTime FecUltModif { get; set; }
        public string Accion { get; set; }
        public string PathImg { get; set; }

        public virtual ICollection<Familia> Familia { get; set; }
    }
}
