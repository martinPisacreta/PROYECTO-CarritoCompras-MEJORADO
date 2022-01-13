using CarritoComprasD.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CarritoComprasD.Models.UsuarioPedidos.UsuarioPedidoDetalles
{
    public class UsuarioPedidoDetalleRequest
    {

        public int IdUsuarioPedido { get; set; }

        public int Take { get; set; }

        public int Skip { get; set; }

      
    }
}
