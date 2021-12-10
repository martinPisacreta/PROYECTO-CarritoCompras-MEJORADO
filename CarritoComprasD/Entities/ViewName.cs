using System;
using System.Collections.Generic;

// Code scaffolded by EF Core assumes nullable reference types (NRTs) are not used or disabled.
// If you have enabled NRTs for your project, then un-comment the following line:
// #nullable disable

namespace CarritoComprasD.Entities
{
    public partial class ViewName
    {
        public long IdArticulo { get; set; }
        public string CodigoArticuloMarca { get; set; }
        public string CodigoArticulo { get; set; }
        public string DescripcionArticulo { get; set; }
        public decimal? PrecioLista { get; set; }
        public int? IdTablaFamilia { get; set; }
        public int? SnOferta { get; set; }
        public string PathImg { get; set; }
        public DateTime? FechaUltModif { get; set; }
        public DateTime? FecBaja { get; set; }
        public string Accion { get; set; }
        public int? Stock { get; set; }
        public long? IdOrden { get; set; }
    }
}
