using System;
using System.ComponentModel.DataAnnotations;
using CarritoComprasD.Entities;

namespace CarritoComprasD.Models.UsuarioPedidos
{
    public class CreateUsuarioPedidoRequest
    {

        [Required]
        public DateTime FechaPedido { get; set; }

        [Required]
        public int IdUsuario { get; set; }

        [Required]
        public int IdEmpresa { get; set; }

        [Required]
        public decimal Total { get; set; }

        [Required]
        public bool SnFinalizado { get; set; }
    }
}