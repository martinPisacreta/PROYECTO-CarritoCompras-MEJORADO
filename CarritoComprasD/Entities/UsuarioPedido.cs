using System;
using System.Collections.Generic;

// Code scaffolded by EF Core assumes nullable reference types (NRTs) are not used or disabled.
// If you have enabled NRTs for your project, then un-comment the following line:
// #nullable disable

namespace CarritoComprasD.Entities
{
    public partial class UsuarioPedido
    {
        public UsuarioPedido()
        {
            UsuarioPedidoDetalle = new HashSet<UsuarioPedidoDetalle>();
        }

        public int IdUsuarioPedido { get; set; }
        public DateTime FechaPedido { get; set; }
        public int IdUsuario { get; set; }
        public int IdEmpresa { get; set; }
        public decimal Total { get; set; }
        public bool? SnFinalizado { get; set; }

        public virtual Empresa IdEmpresaNavigation { get; set; }
        public virtual Usuario IdUsuarioNavigation { get; set; }
        public virtual ICollection<UsuarioPedidoDetalle> UsuarioPedidoDetalle { get; set; }
    }
}
