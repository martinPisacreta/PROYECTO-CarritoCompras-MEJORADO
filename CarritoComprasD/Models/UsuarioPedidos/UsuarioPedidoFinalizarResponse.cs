using CarritoComprasD.Entities;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CarritoComprasD.Models.UsuarioPedidos
{
    public class UsuarioPedidoFinalizarResponse
    {
        public int IdUsuario { get; set; }

        public UsuarioPedido UsuarioPedido { get; set; }

    }
}
