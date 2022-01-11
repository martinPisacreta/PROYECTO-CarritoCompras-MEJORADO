using CarritoComprasD.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CarritoComprasD.Models.UsuarioPedidos
{
    public class UsuarioPedidoFinalizarRequest
    {
       
        public int IdUsuario { get; set; }
        public  ICollection<UsuarioPedidoDetalle> UsuarioPedidoDetalle { get; set; }

        public  int IdEmpresa { get; set; }

        public decimal Total { get; set; }
    }
}
