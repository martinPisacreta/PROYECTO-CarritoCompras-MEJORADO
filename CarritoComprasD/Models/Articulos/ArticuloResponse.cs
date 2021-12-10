using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using CarritoComprasD.Entities;
using DevExtreme.AspNet.Mvc;

namespace CarritoComprasD.Models.Articulo
{
    public class ArticuloResponse
    {
        public List<VArticulo> Articulos { get; set; }

        public int Total { get; set; }

 

    }



}