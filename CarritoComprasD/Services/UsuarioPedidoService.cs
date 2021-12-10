using AutoMapper;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Linq;
using CarritoComprasD.Entities;
using CarritoComprasD.Helpers.AppSettings;
using CarritoComprasD.Models.UsuarioPedidos;

namespace CarritoComprasD.Services
{
    public interface IUsuarioPedidoService
    {
        IEnumerable<UsuarioPedidoResponse> GetAll();
        UsuarioPedidoResponse GetByIdPedido(int id);
        IEnumerable<UsuarioPedidoResponse> GetByIdUsuario(int idUsuario);
        UsuarioPedidoResponse GetByIdUsuarioNotFinalized(int idUsuario);

        
        UsuarioPedidoResponse Create(CreateUsuarioPedidoRequest model);
        UsuarioPedidoResponse Update(int id, UpdateUsuarioPedidoRequest model);
        void Delete(int id);
    }

    public class UsuarioPedidoService : IUsuarioPedidoService
    {
        private readonly _Email_Destino_Pedido _appSettings_emailDestinoPedido;
        private readonly CarritoComprasWebContext _context;
        private readonly IMapper _mapper;
        private readonly IEmailService _emailService;

        public UsuarioPedidoService(
            CarritoComprasWebContext context,
            IMapper mapper,
            IOptions<_Email_Destino_Pedido> _appSettings_emailDestinoPedido,
            IEmailService emailService)
        {
            _context = context;
            _mapper = mapper;
            _emailService = emailService;
        }

   
        public IEnumerable<UsuarioPedidoResponse> GetAll()
        {
            var pedidos = _context.UsuarioPedido;
            return _mapper.Map<IList<UsuarioPedidoResponse>>(pedidos);
        }

        public UsuarioPedidoResponse GetByIdPedido(int idPedido)
        {
            var pedido = getByIdPedido(idPedido);
            return _mapper.Map<UsuarioPedidoResponse>(pedido);
        }

        public IEnumerable<UsuarioPedidoResponse> GetByIdUsuario(int idUsuario)
        {
            var pedidos = getByIdUsuario(idUsuario);
            return _mapper.Map<IList<UsuarioPedidoResponse>>(pedidos);
        }

        public UsuarioPedidoResponse GetByIdUsuarioNotFinalized(int idUsuario)
        {
            var pedidos = getByIdUsuarioNotFinalized(idUsuario);
            return _mapper.Map<UsuarioPedidoResponse>(pedidos);
        }

        public UsuarioPedidoResponse Create(CreateUsuarioPedidoRequest model)
        {
          
            // map model to new usuarioPedido object
            var pedido = _mapper.Map<UsuarioPedido>(model);
            pedido.FechaPedido = DateTime.UtcNow;
            pedido.IdUsuario =model.IdUsuario;
            pedido.IdEmpresa = model.IdEmpresa;
            pedido.Total = model.Total;
            pedido.SnFinalizado = false;

            // save usuarioPedido
            _context.UsuarioPedido.Add(pedido);
            _context.SaveChanges();


            sendPedidoEmail(pedido);

            return _mapper.Map<UsuarioPedidoResponse>(pedido);
        }

        public UsuarioPedidoResponse Update(int id, UpdateUsuarioPedidoRequest model)
        {
            var pedido = getByIdPedido(id);

            // copy model to usuarioPedido and save
            _mapper.Map(model, pedido);
            pedido.FechaPedido = DateTime.UtcNow;
            _context.UsuarioPedido.Update(pedido);
            _context.SaveChanges();

            return _mapper.Map<UsuarioPedidoResponse>(pedido);
        }

        public void Delete(int idPedido)
        {
            var pedido = getByIdPedido(idPedido);
            _context.UsuarioPedido.Remove(pedido);
            _context.SaveChanges();
        }


        private UsuarioPedido getByIdPedido(int idPedido)
        {
            var usuarioPedido = _context.UsuarioPedido.Find(idPedido);
            if (usuarioPedido == null) throw new KeyNotFoundException("Pedido no encontrado");
            return usuarioPedido;
        }

        private IEnumerable<UsuarioPedido> getByIdUsuario(int idUsuario)
        {

            var pedidos = _context.UsuarioPedido
                                .Where(up => up.IdUsuario == idUsuario)
                                .OrderByDescending(up => up.IdUsuarioPedido);
            if (pedidos == null) throw new KeyNotFoundException("Pedidos no encontrados");
            return pedidos;
        }

        private UsuarioPedido getByIdUsuarioNotFinalized(int idUsuario)
        {

            var pedidos = _context.UsuarioPedido
                                .Where(up => up.IdUsuario == idUsuario && up.SnFinalizado == false)
                                .OrderByDescending(up => up.IdUsuarioPedido)
                                .FirstOrDefault();
            if (pedidos == null) throw new KeyNotFoundException("No hay pedidos por finalizar");
            return pedidos;
        }


        private void sendPedidoEmail(UsuarioPedido pedido)
        {
            string message;
            message =
                   "<html> " +
                           "<head> " +
                                   "<style> " +
                                       "table, th, td " +
                                       "{ " +
                                               "border: 1px solid black; " +
                                               "border - collapse: collapse; " +
                                       "} " +
                                   "</style> " +
                           "</head> " +
                           "<body> " +
                               "<div style = 'margin: 25px 25px 25px 25px;'> " +
                                   "<div> " +
                                       "<div> " +
                                           "<strong> Usuario : </strong> " +
                                           "<span>" + pedido.IdUsuarioNavigation.RazonSocial + "</span> " +
                                       "</div> " +

                                       "<div> " +
                                           "<strong> Telefono :</strong> " +
                                           "<span>" + pedido.IdUsuarioNavigation.Telefono + "</span> " +
                                       "</div> " +

                                       "<div> " +
                                           "<strong> Cuit :</strong> " +
                                           "<span>" + pedido.IdUsuarioNavigation.Cuit + "</span> " +
                                       "</div> " +

                                       "&nbsp; " +

                                       "<div> " +
                                           "<table style = 'width:100%; border-collapse: collapse;'> " +
                                               "<tr> " +
                                                   "<th> Cantidad </th> " +
                                                   "<th> Marca </th> " +
                                                   "<th> C&oacute;digo</th> " +
                                                   "<th> Precio Compra Usuario</th> " +
                                               //"<th> Descripci&oacute;n</th> " +
                                               "</tr>";
            foreach (UsuarioPedidoDetalle upd in pedido.UsuarioPedidoDetalle)
            {
                message +=
                    "<tr> " +
                        "<td align='center'>" + upd.Cantidad + "</td> " +
                        "<td align='center'>" + upd.TxtDescMarca + "</td> " +
                        "<td align='center'>" + upd.CodigoArticulo + "</td> " +
                        "<td align='center'>" + upd.PrecioListaPorCoeficientePorMedioIva.ToString("N2") + "</td> " +
                    //"<td>" + upd.DescripcionArticulo + "</td> " +
                    "</tr> ";
            }
            message +=


                        "</table> " +

                         "<br/> <div> " +
                            "<strong> Total :</strong> " +
                            "<span>" + pedido.Total.ToString("N2") + "</span> " +
                        "</div> " +

                                    "</div> " +
                                "</div> " +
                            "</div> " +
                        "</body> " +
                    "</html>";

            _emailService.Send(
                to: _appSettings_emailDestinoPedido.Cuenta,
                subject: "Ingreso de pedido : " + pedido.IdUsuarioNavigation.RazonSocial,
                html: $@"{message}"
            );
        }
    }
}
