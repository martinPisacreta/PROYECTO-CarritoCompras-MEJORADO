using CarritoComprasD.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CarritoComprasD.Models.UsuarioPedidos
{
    public class UsuarioPedidoModificarArticuloRequest
    {

        public int IdUsuario { get; set; }

        public long IdArticulo { get; set; }

        public int Cantidad { get; set; }

      
    }
}
