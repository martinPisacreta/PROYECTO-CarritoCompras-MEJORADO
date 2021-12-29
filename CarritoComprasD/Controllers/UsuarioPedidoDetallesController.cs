using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using AutoMapper;
using CarritoComprasD.Services;
using CarritoComprasD.Models.UsuarioPedidos;
using CarritoComprasD.Controllers;
using CarritoComprasD.Entities;

namespace Carrito_Compras_Core.Controllers
{

    [ApiController]
    [Route("[controller]")]
    public class UsuarioPedidoDetalleDetallesController : BaseController
    {


        private readonly IUsuarioPedidoDetalleService _usuarioPedidoDetalleService;
        private readonly IMapper _mapper;

        public UsuarioPedidoDetalleDetallesController(
            IUsuarioPedidoDetalleService usuarioPedidoDetalleService,
            IMapper mapper)
        {
            _usuarioPedidoDetalleService = usuarioPedidoDetalleService;
            _mapper = mapper;
        }



       

        [Authorize]
        [HttpGet]
        public ActionResult<IEnumerable<UsuarioPedidoDetalle>> GetAll()
        {
            var pedidos = _usuarioPedidoDetalleService.GetAll();
            return Ok(pedidos);
        }

        [Authorize]
        [HttpGet("{idPedido:int}")]
        public ActionResult<UsuarioPedidoDetalle> GetByIdPedido(int idPedidoDetalle)
        {

            var usuarioPedido = _usuarioPedidoDetalleService.GetByIdPedidoDetalle(idPedidoDetalle);
            return Ok(usuarioPedido);

          
        }

        [Authorize]
        [HttpGet("{idPedidoDetalle:int}")]
        public ActionResult<IEnumerable<UsuarioPedidoDetalle>> GetByIdPedidoDetalle(int idPedido)
        {

            var pedidos = _usuarioPedidoDetalleService.GetByIdPedido(idPedido);
            return Ok(pedidos);
        }



    }
}
