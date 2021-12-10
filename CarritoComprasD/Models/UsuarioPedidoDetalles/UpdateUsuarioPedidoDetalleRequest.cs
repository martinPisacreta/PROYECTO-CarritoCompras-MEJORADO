using System;
using System.ComponentModel.DataAnnotations;
using CarritoComprasD.Entities;

namespace CarritoComprasD.Models.UsuarioPedidoDetalles
{
    public class UpdateUsuarioPedidoDetalleRequest
    {

        [Required]
        public int IdUsuarioPedido { get; set; }
        [Required]
        public string CodigoArticulo { get; set; }
        [Required]
        public string DescripcionArticulo { get; set; }
        [Required]
        public string TxtDescMarca { get; set; }
        [Required]
        public string TxtDescFamilia { get; set; }
        [Required]
        public decimal PrecioListaPorCoeficientePorMedioIva { get; set; }
        [Required]
        public int Utilidad { get; set; }
        [Required]
        public int SnOferta { get; set; }
        [Required]
        public decimal PrecioLista { get; set; }
        [Required]
        public decimal Coeficiente { get; set; }
        [Required]
        public int Cantidad { get; set; }
        [Required]
        public long? IdArticulo { get; set; }

    }
}