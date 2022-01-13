using CarritoComprasD.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CarritoComprasD.Models.UsuarioPedidos.UsuarioPedidoDetalles
{
    public class UsuarioPedidoDetalleResponse
    {
        public int Total { get; set; }

        public List<VUsuarioPedidoDetalle> UsuarioPedidoDetalles { get; set; }
    }

    public class VUsuarioPedidoDetalle
    {
        public int Id { get; set; } //IdUsuarioPedidoDetalle
        public string CodigoArticulo { get; set; }
        public string DescripcionArticulo { get; set; }
        public string TxtDescMarca { get; set; }
        public string TxtDescFamilia { get; set; }
        public decimal PrecioListaPorCoeficientePorMedioIva { get; set; }
        public int Cantidad { get; set; }
    }



  
   
}

