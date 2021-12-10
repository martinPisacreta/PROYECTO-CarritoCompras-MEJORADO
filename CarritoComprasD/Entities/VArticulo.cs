using System;
using System.Collections.Generic;

// Code scaffolded by EF Core assumes nullable reference types (NRTs) are not used or disabled.
// If you have enabled NRTs for your project, then un-comment the following line:
// #nullable disable

namespace CarritoComprasD.Entities
{
    public partial class VArticulo
    {
        public long Id { get; set; }
        public string CodigoArticulo { get; set; }
        public decimal? PrecioListaPorCoeficientePorMedioIva { get; set; }
        public string DescripcionArticulo { get; set; }
        public string MarcaArticulo { get; set; }
        public string FamiliaArticulo { get; set; }
        public decimal UtilidadArticulo { get; set; }
        public int? SnOferta { get; set; }
    }
}
