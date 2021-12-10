using System;

namespace CarritoComprasD.Models.UsuarioPedidos
{
    public class UsuarioPedidoResponse
    {
        public int IdUsuarioPedido { get; set; }

        public DateTime FechaPedido { get; set; }
        public int IdUsuario { get; set; }
        public int IdEmpresa { get; set; }
        public decimal Total { get; set; }

        public bool SnFinalizado { get; set; }
    }
}