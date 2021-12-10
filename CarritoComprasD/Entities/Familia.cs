using System;
using System.Collections.Generic;

// Code scaffolded by EF Core assumes nullable reference types (NRTs) are not used or disabled.
// If you have enabled NRTs for your project, then un-comment the following line:
// #nullable disable

namespace CarritoComprasD.Entities
{
    public partial class Familia
    {
        public Familia()
        {
            Articulo = new HashSet<Articulo>();
        }

        public int IdTablaFamilia { get; set; }
        public int IdFamilia { get; set; }
        public int IdTablaMarca { get; set; }
        public string TxtDescFamilia { get; set; }
        public int SnActivo { get; set; }
        public DateTime FecUltModif { get; set; }
        public string Accion { get; set; }
        public string PathImg { get; set; }
        public decimal Algoritmo1 { get; set; }
        public decimal Algoritmo2 { get; set; }
        public decimal Algoritmo3 { get; set; }
        public decimal Algoritmo4 { get; set; }
        public decimal Algoritmo5 { get; set; }
        public decimal Algoritmo6 { get; set; }
        public decimal Algoritmo7 { get; set; }
        public decimal Algoritmo8 { get; set; }
        public decimal Algoritmo9 { get; set; }
        public decimal Algoritmo10 { get; set; }

        public virtual Marca IdTablaMarcaNavigation { get; set; }
        public virtual ICollection<Articulo> Articulo { get; set; }
    }
}
