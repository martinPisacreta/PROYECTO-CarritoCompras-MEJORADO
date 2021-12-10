using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using DevExtreme.AspNet.Mvc;

namespace CarritoComprasD.Models.Articulo
{
    public class ArticuloRequest
    {


        [Required]
        public int skip { get; set; }
        [Required]
        public int take { get; set; }

        [Required]
        public int utilidad { get; set; }
     

        public string filter { get; set; }

        [Required]
        public bool oferta { get; set; }

    }

  
}