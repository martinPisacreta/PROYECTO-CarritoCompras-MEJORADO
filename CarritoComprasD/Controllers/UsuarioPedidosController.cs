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

        //NO ESTA CREADO UsuarioPedidoDetalleController PORQUE MANEJO TODO DESDE UsuarioPedidosController.cs


        private readonly IUsuarioPedidoService _usuarioPedidoService;
        private readonly IMapper _mapper;

        public UsuarioPedidosController(
            IUsuarioPedidoService usuarioPedidoService,
            IMapper mapper)
        {
            _usuarioPedidoService = usuarioPedidoService;
            _mapper = mapper;
        }

        #region ---------------------------------- AGREGAR - ELIMINAR - MODIFICACION -----------------------------------------------------
        [Authorize]
        [HttpPost("agregar-articulo-pedido")]
        public ActionResult<UsuarioPedidoResponse> AgregarArticuloPedido(UsuarioPedidoAgregarArticuloRequest model)
        {
            var response = _usuarioPedidoService.AgregarArticuloPedido(model);
            return Ok(response);
        }

        [Authorize]
        [HttpPost("eliminar-articulo-pedido")]
        public ActionResult<UsuarioPedidoResponse> EliminarArticuloPedido(UsuarioPedidoEliminarArticuloRequest model)
        {
            var response = _usuarioPedidoService.EliminarArticuloPedido(model);
            return Ok(response);
        }


        [Authorize]
        [HttpPost("modificar-articulo-pedido")]
        public ActionResult<UsuarioPedidoResponse> ModificarArticuloPedido(UsuarioPedidoModificarArticuloRequest model)
        {
            var response = _usuarioPedidoService.ModificarArticuloPedido(model);
            return Ok(response);
        }

        #endregion ---------------------------------- ALTA - BAJA - MODIFICACION -----------------------------------------------------

        #region ----------------------------------      FINALIZAR PEDIDO        ------------------------------------------------------

        [Authorize]
        [HttpPost("finalizar-pedido")]
        public ActionResult<UsuarioPedidoFinalizarResponse> FinalizarPedido(UsuarioPedidoFinalizarRequest model)
        {

            var response = _usuarioPedidoService.FinalizarPedido(model);
            return Ok(response);
        }
        #endregion ---------------------------------- FINALIZAR PEDIDO -------------------------------------------------------------------

        #region ---------------------------------- METODOS GET ------------------------------------------------------------------------
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

        #endregion ---------------------------------- METODOS GET ------------------------------------------------------------------------


    }
}
