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
using CarritoComprasD.Models.UsuarioPedidos.UsuarioPedidoDetalles;

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
        [HttpGet("{idUsuario:int}")]
        [Route("get-by-idUsuario-not-finalized/{idUsuario}")]
        public ActionResult<UsuarioPedido> GetByIdUsuarioNotFinalized(int idUsuario)
        {

            var usuarioPedido = _usuarioPedidoService.GetByIdUsuarioNotFinalized(idUsuario);

            return Ok(usuarioPedido);
        }

        #endregion ---------------------------------- METODOS GET ------------------------------------------------------------------------

        #region ---------------------------------- METODOS POST ------------------------------------------------------------------------

        [Authorize]
        [HttpPost("get-pedidos-by-idUsuario")]
        public ActionResult<UsuarioPedidoResponseGetByIdUsuario> GetPedidosByIdUsuario(UsuarioPedidoGetByIdUsuarioRequest model)
        {

            var usuarioPedidoResponse = _usuarioPedidoService.GetPedidosByIdUsuario(model);
            return Ok(usuarioPedidoResponse);
        }
        #endregion ---------------------------------- METODOS POST ------------------------------------------------------------------------


        #region ---------------------------------- PEDIDO DETALLES ------------------------------------------------------------------------
        [Authorize]
        [HttpPost("get-pedidoDetalles-by-idUsuarioPedido")]
        public ActionResult<UsuarioPedidoDetalleResponse> GetPedidoDetallesByIdUsuarioPedido(UsuarioPedidoDetalleRequest model)
        {

            var usuarioPedidoDetalleResponse = _usuarioPedidoService.GetPedidoDetallesByIdUsuarioPedido(model);
            return Ok(usuarioPedidoDetalleResponse);
        }
        #endregion ---------------------------------- PEDIDO DETALLES ------------------------------------------------------------------------

    }
}
