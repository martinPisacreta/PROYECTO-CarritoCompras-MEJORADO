using CarritoComprasD.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CarritoComprasD.Models.UsuarioPedidos
{
    public class UsuarioPedidoResponseGetByIdUsuario
    {
        public int Total { get; set; }

        public List<VUsuarioPedido> UsuarioPedidos { get; set; }
    }

    public class VUsuarioPedido
    {
        public int Id { get; set; } //IdUsuarioPedido

        public string FechaPedido { get; set; }

        public decimal Total { get; set; }

        public string SnFinalizado { get; set; }
    }



    
}

