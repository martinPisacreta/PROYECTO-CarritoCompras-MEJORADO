using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using AutoMapper;
using CarritoComprasD.Services;
using CarritoComprasD.Models.UsuarioPedidoDetalles;
using CarritoComprasD.Controllers;

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



        [HttpPost]
        public ActionResult<UsuarioPedidoDetalleResponse> Create(CreateUsuarioPedidoDetalleRequest model)
        {
            var usuarioPedido = _usuarioPedidoDetalleService.Create(model);



            return Ok(usuarioPedido);
        }


        [Authorize]
        [HttpPut("{id:int}")]
        public ActionResult<UsuarioPedidoDetalleResponse> Update(int id, UpdateUsuarioPedidoDetalleRequest model)
        {


            var usuarioPedido = _usuarioPedidoDetalleService.Update(id, model);
            return Ok(usuarioPedido);
        }

        [Authorize]
        [HttpDelete("{id:int}")]
        public IActionResult Delete(int id)
        {


            _usuarioPedidoDetalleService.Delete(id);
            return Ok(new { message = "Pedido eliminado exitosamente" });
        }

        [Authorize]
        [HttpGet]
        public ActionResult<IEnumerable<UsuarioPedidoDetalleResponse>> GetAll()
        {
            var pedidos = _usuarioPedidoDetalleService.GetAll();
            return Ok(pedidos);
        }

        [Authorize]
        [HttpGet("{idPedido:int}")]
        public ActionResult<UsuarioPedidoDetalleResponse> GetByIdPedido(int idPedidoDetalle)
        {

            var usuarioPedido = _usuarioPedidoDetalleService.GetByIdPedidoDetalle(idPedidoDetalle);
            return Ok(usuarioPedido);

          
        }

        [Authorize]
        [HttpGet("{idPedidoDetalle:int}")]
        public ActionResult<IEnumerable<UsuarioPedidoDetalleResponse>> GetByIdPedidoDetalle(int idPedido)
        {

            var pedidos = _usuarioPedidoDetalleService.GetByIdPedido(idPedido);
            return Ok(pedidos);
        }



    }
}
