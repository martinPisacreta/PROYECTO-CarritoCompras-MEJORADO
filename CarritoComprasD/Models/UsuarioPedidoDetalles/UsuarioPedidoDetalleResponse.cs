using System;

namespace CarritoComprasD.Models.UsuarioPedidoDetalles
{
    public class UsuarioPedidoDetalleResponse
    {


      
        public int IdUsuarioPedido { get; set; }
      
        public string CodigoArticulo { get; set; }
      
        public string DescripcionArticulo { get; set; }
      
        public string TxtDescMarca { get; set; }
      
        public string TxtDescFamilia { get; set; }
      
        public decimal PrecioListaPorCoeficientePorMedioIva { get; set; }
      
        public int Utilidad { get; set; }
      
        public int SnOferta { get; set; }
      
        public decimal PrecioLista { get; set; }
      
        public decimal Coeficiente { get; set; }
      
        public int Cantidad { get; set; }
      
        public long? IdArticulo { get; set; }

    }
}