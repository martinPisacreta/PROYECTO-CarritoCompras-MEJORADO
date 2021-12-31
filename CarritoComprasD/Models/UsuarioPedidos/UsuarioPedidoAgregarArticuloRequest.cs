using CarritoComprasD.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CarritoComprasD.Models.UsuarioPedidos
{
    public class UsuarioPedidoAgregarArticuloRequest
    {
        public int IdUsuario { get; set; }

        public VArticulo Articulo { get; set; }

        public int Cantidad { get; set; }

        public int IdEmpresa { get; set; }

        public int Utilidad { get; set; }
    }
}
