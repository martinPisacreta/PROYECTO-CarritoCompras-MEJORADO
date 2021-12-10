using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Net.Mail;
using Microsoft.Extensions.Configuration;
using CarritoComprasD.Entities;
using CarritoComprasD.Models.UsuarioPedidos;
using CarritoComprasD.Services;
using AutoMapper;

namespace Carrito_Compras_Core.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class UsuarioPedidosController : ControllerBase
    {
      

        private readonly IUsuarioPedidoService _usuarioPedidoService;
        private readonly IMapper _mapper;

        public UsuarioPedidosController(
            IUsuarioPedidoService usuarioPedidoService,
            IMapper mapper)
        {
            _usuarioPedidoService = usuarioPedidoService;
            _mapper = mapper;
        }


    
        [HttpPost]
        public ActionResult<UsuarioPedidoResponse> Create(CreateUsuarioPedidoRequest model)
        {
            var usuarioPedido = _usuarioPedidoService.Create(model);
          


            return Ok(usuarioPedido);
        }


        [Authorize]
        [HttpPut("{id:int}")]
        public ActionResult<UsuarioPedidoResponse> Update(int id, UpdateUsuarioPedidoRequest model)
        {
           

            var usuarioPedido = _usuarioPedidoService.Update(id, model);
            return Ok(usuarioPedido);
        }

        [Authorize]
        [HttpDelete("{id:int}")]
        public IActionResult Delete(int id)
        {
      

            _usuarioPedidoService.Delete(id);
            return Ok(new { message = "Pedido eliminado exitosamente" });
        }

        [Authorize]
        [HttpGet]
        public ActionResult<IEnumerable<UsuarioPedidoResponse>> GetAll()
        {
            var pedidos = _usuarioPedidoService.GetAll();
            return Ok(pedidos);
        }

        [Authorize]
        [HttpGet("{idPedido:int}")]
        public ActionResult<UsuarioPedidoResponse> GetByIdPedido(int idPedido)
        {
          
            var pedidos = _usuarioPedidoService.GetByIdPedido(idPedido);
            return Ok(pedidos);
        }

        [Authorize]
        [HttpGet("{idUsuario:int}")]
        public ActionResult<IEnumerable<UsuarioPedidoResponse>> GetByIdUsuario(int idUsuario)
        {

            var usuarioPedido = _usuarioPedidoService.GetByIdUsuario(idUsuario);
            return Ok(usuarioPedido);
        }


        [Authorize]
        [HttpGet("{idUsuario:int}")]
        [Route("get-by-idUsuario-not-finalized/{idUsuario}")]
        public ActionResult<UsuarioPedidoResponse> GetByIdUsuarioNotFinalized(int idUsuario)
        {

            var usuarioPedido = _usuarioPedidoService.GetByIdUsuarioNotFinalized(idUsuario);

            return Ok(usuarioPedido);
        }


    }
}
