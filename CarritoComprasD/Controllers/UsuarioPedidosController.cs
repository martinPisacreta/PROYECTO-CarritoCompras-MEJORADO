using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Net.Mail;
using Microsoft.Extensions.Configuration;
using CarritoComprasD.Entities;
using CarritoComprasD.Services;
using AutoMapper;
using CarritoComprasD.Models.UsuarioPedidos;

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


        [Authorize]
        [HttpPost("agregar-articulo-pedido")]
        public ActionResult<UsuarioPedidoResponse> AgregarArticuloPedido(UsuarioPedidoRequest model)
        {
            var response = _usuarioPedidoService.AgregarArticuloPedido(model);
            return Ok(response);
        }




        [Authorize]
        [HttpGet]
        public ActionResult<IEnumerable<UsuarioPedido>> GetAll()
        {
            var pedidos = _usuarioPedidoService.GetAll();
            return Ok(pedidos);
        }

        [Authorize]
        [HttpGet("{idPedido:int}")]
        public ActionResult<UsuarioPedido> GetByIdPedido(int idPedido)
        {
          
            var pedidos = _usuarioPedidoService.GetByIdPedido(idPedido);
            return Ok(pedidos);
        }

        [Authorize]
        [HttpGet("{idUsuario:int}")]
        public ActionResult<IEnumerable<UsuarioPedido>> GetByIdUsuario(int idUsuario)
        {

            var usuarioPedido = _usuarioPedidoService.GetByIdUsuario(idUsuario);
            return Ok(usuarioPedido);
        }


        [Authorize]
        [HttpGet("{idUsuario:int}")]
        [Route("get-by-idUsuario-not-finalized/{idUsuario}")]
        public ActionResult<UsuarioPedido> GetByIdUsuarioNotFinalized(int idUsuario)
        {

            var usuarioPedido = _usuarioPedidoService.GetByIdUsuarioNotFinalized(idUsuario);

            return Ok(usuarioPedido);
        }


    }
}
