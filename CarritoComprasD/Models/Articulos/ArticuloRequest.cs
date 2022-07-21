using CarritoComprasD.Models.Familia;
using CarritoComprasD.Models.Marca;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace CarritoComprasD.Models.Articulo
{
    public class ArticuloRequest
    {


        [Required]
        public int Skip { get; set; }
        [Required]
        public int Take { get; set; }

       
        public ComboBoxMarca ComboBoxMarca { get; set; }

        public ComboBoxFamilia ComboBoxFamilia { get; set; }

      
        public string CodigoArticulo { get; set; }

       
        public string DescripcionArticulo { get; set; }

           
        [Required]
        public int Utilidad { get; set; }
     

        [Required]
        public bool Oferta { get; set; }

    }

 
}