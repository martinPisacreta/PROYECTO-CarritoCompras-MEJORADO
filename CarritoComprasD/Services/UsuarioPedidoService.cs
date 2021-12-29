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
        IEnumerable<UsuarioPedido> GetAll();
        UsuarioPedido GetByIdPedido(int id);
        IEnumerable<UsuarioPedido> GetByIdUsuario(int idUsuario);
        UsuarioPedido GetByIdUsuarioNotFinalized(int idUsuario);
        UsuarioPedidoResponse AgregarArticuloPedido(UsuarioPedidoRequest model);
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
            IOptions<_Email_Destino_Pedido> appSettings_emailDestinoPedido,
            IEmailService emailService
            )
        {
            _context = context;
            _mapper = mapper;
            _emailService = emailService;
            _appSettings_emailDestinoPedido = appSettings_emailDestinoPedido.Value;


        }



        public UsuarioPedidoResponse AgregarArticuloPedido(UsuarioPedidoRequest model)
        {
            UsuarioPedido usuarioPedido = null;
            UsuarioPedidoResponse usuarioPedidoResponse = new UsuarioPedidoResponse();
            using (var transaction = _context.Database.BeginTransaction())
            {
                try
                {
                    usuarioPedido = _context.UsuarioPedido.Where(up => up.IdUsuario == model.IdUsuario && up.SnFinalizado == false).FirstOrDefault();
                 
                   
                    if (usuarioPedido == null)  //no existe pedido
                    {
                        //seteo el pedido
                        usuarioPedido = new UsuarioPedido();
                        usuarioPedido.FechaPedido = DateTime.Now;
                        usuarioPedido.IdUsuario = model.IdUsuario;
                        usuarioPedido.IdEmpresa = model.IdEmpresa;
                        usuarioPedido.Total = Convert.ToDecimal(model.Articulo.PrecioListaPorCoeficientePorMedioIva * model.Cantidad);
                        usuarioPedido.SnFinalizado = false;

                        //genero el pedido en base de datos
                        _context.UsuarioPedido.Add(usuarioPedido);
                        _context.SaveChanges();

                        //seteo detalle del pedido
                        UsuarioPedidoDetalle usuarioPedidoDetalle = new UsuarioPedidoDetalle();

                        //usuarioPedidoDetalle.IdUsuarioPedidoDetalle ->  ES AUTOINCREMENTABLE
                        usuarioPedidoDetalle.IdUsuarioPedido = model.IdUsuario;
                        usuarioPedidoDetalle.CodigoArticulo = model.Articulo.CodigoArticulo;
                        usuarioPedidoDetalle.DescripcionArticulo = model.Articulo.DescripcionArticulo;
                        usuarioPedidoDetalle.TxtDescMarca = model.Articulo.MarcaArticulo;
                        usuarioPedidoDetalle.TxtDescFamilia = model.Articulo.FamiliaArticulo;
                        usuarioPedidoDetalle.PrecioListaPorCoeficientePorMedioIva = model.Articulo.PrecioListaPorCoeficientePorMedioIva.Value;
                        usuarioPedidoDetalle.Utilidad = model.Utilidad;
                        usuarioPedidoDetalle.SnOferta = model.Articulo.SnOferta.Value;
                        usuarioPedidoDetalle.PrecioLista = model.Articulo.PrecioLista.Value;
                        usuarioPedidoDetalle.Coeficiente = model.Articulo.Coeficiente.Value;
                        usuarioPedidoDetalle.Cantidad = model.Cantidad;
                        usuarioPedidoDetalle.IdArticulo = model.Articulo.Id;
                        usuarioPedidoDetalle.Articulo = _context.VArticulo.Where(a => a.Id == usuarioPedidoDetalle.IdArticulo).FirstOrDefault();
                        usuarioPedidoDetalle.SnActivo = usuarioPedidoDetalle.Articulo != null ? -1 : 0;

                        usuarioPedido.UsuarioPedidoDetalle.Add(usuarioPedidoDetalle);
                      

                        //genero el detalle del pedido en base de datos
                        _context.UsuarioPedidoDetalle.Add(usuarioPedidoDetalle);
                        _context.SaveChanges();


                    }
                    else //existe pedido
                    {
                        UsuarioPedidoDetalle usuarioPedidoDetalleBD = null;

                        //seteo detalle del pedido
                        usuarioPedido.UsuarioPedidoDetalle = _context.UsuarioPedidoDetalle.Where(upd => upd.IdUsuarioPedido == usuarioPedido.IdUsuarioPedido).ToList();

                        foreach (UsuarioPedidoDetalle usuarioPedidoDetalle in usuarioPedido.UsuarioPedidoDetalle)
                        {
                            //VERIFICO SI EL ARTICULO QUE QUIERO INSERTAR AL PEDIDO EXISTE EN EL PEDIDO
                            if (usuarioPedidoDetalle.IdArticulo == model.Articulo.Id)
                            {
                                usuarioPedidoDetalleBD = usuarioPedidoDetalle;
                            }


                            //MODIFICO ARTICULOS DEL PEDIDO CON LOS DATOS ACTUALIZADOS DE LA VISTA VARTICULO
                            //ESTO LO HAGO POR EJEMPLO SI HAY ARTICULOS CARGADOS DESDE EL LUNES Y HOY ES VIERNES...
                            //...ESOS ARTICULOS PUDIERON SUFRIR MODIFICACION DE PRECIOS
                            VArticulo articulo = _context.VArticulo.Where(a => a.Id == usuarioPedidoDetalle.IdArticulo).FirstOrDefault();
                            if (articulo != null)
                            {
                                //usuarioPedidoDetalle.IdUsuarioPedidoDetalle -> NO HACE FALTA MODIFICARLO
                                //usuarioPedidoDetalle.IdUsuarioPedido -> NO HACE FALTA MODIFICARLO
                                usuarioPedidoDetalle.CodigoArticulo = articulo.CodigoArticulo;
                                usuarioPedidoDetalle.DescripcionArticulo = articulo.DescripcionArticulo;
                                usuarioPedidoDetalle.TxtDescMarca = articulo.MarcaArticulo;
                                usuarioPedidoDetalle.TxtDescFamilia = articulo.FamiliaArticulo;
                                usuarioPedidoDetalle.PrecioListaPorCoeficientePorMedioIva = articulo.PrecioListaPorCoeficientePorMedioIva.Value;
                                //usuarioPedidoDetalle.Utilidad -> NO HACE FALTA MODIFICARLO
                                usuarioPedidoDetalle.SnOferta = articulo.SnOferta.Value;
                                usuarioPedidoDetalle.PrecioLista = articulo.PrecioLista.Value;
                                usuarioPedidoDetalle.Coeficiente = articulo.Coeficiente.Value;
                                //usuarioPedidoDetalle.Cantidad -> NO HACE FALTA MODIFICARLO
                                usuarioPedidoDetalle.IdArticulo = articulo.Id;
                                usuarioPedidoDetalle.Articulo = articulo;
                                usuarioPedidoDetalle.SnActivo = -1;

                                //update del detalle del pedido en base de datos
                                _context.UsuarioPedidoDetalle.Update(usuarioPedidoDetalle);
                                _context.SaveChanges();
                            }
                            else
                            {
                                //usuarioPedidoDetalle.IdUsuarioPedidoDetalle -> NO HACE FALTA MODIFICARLO
                                //usuarioPedidoDetalle.IdUsuarioPedido -> NO HACE FALTA MODIFICARLO
                                //usuarioPedidoDetalle.CodigoArticulo -> NO HACE FALTA MODIFICARLO
                                //usuarioPedidoDetalle.DescripcionArticulo -> NO HACE FALTA MODIFICARLO
                                //usuarioPedidoDetalle.TxtDescMarca -> NO HACE FALTA MODIFICARLO
                                //usuarioPedidoDetalle.TxtDescFamilia -> NO HACE FALTA MODIFICARLO
                                //usuarioPedidoDetalle.PrecioListaPorCoeficientePorMedioIva -> NO HACE FALTA MODIFICARLO
                                //usuarioPedidoDetalle.Utilidad -> NO HACE FALTA MODIFICARLO
                                //usuarioPedidoDetalle.SnOferta -> NO HACE FALTA MODIFICARLO
                                //usuarioPedidoDetalle.PrecioLista -> NO HACE FALTA MODIFICARLO
                                //usuarioPedidoDetalle.Coeficiente -> NO HACE FALTA MODIFICARLO
                                //usuarioPedidoDetalle.Cantidad -> NO HACE FALTA MODIFICARLO
                                //usuarioPedidoDetalle.IdArticulo -> NO HACE FALTA MODIFICARLO
                                //usuarioPedidoDetalle.Articulo -> NO HACE FALTA MODIFICARLO
                                usuarioPedidoDetalle.SnActivo = 0;

                                //update del detalle del pedido en base de datos
                                _context.UsuarioPedidoDetalle.Update(usuarioPedidoDetalle);
                                _context.SaveChanges();
                            }



                        }


                        if (usuarioPedidoDetalleBD != null) //EXISTE ARTICULO EN EL PEDIDO , POR ENDE MODIFICO EL ARTICULO DEL PEDIDO
                        {
                            //usuarioPedidoDetalleBD.IdUsuarioPedidoDetalle->NO HACE FALTA MODIFICARLO
                            usuarioPedidoDetalleBD.IdUsuarioPedido = usuarioPedido.IdUsuarioPedido;
                            usuarioPedidoDetalleBD.CodigoArticulo = model.Articulo.CodigoArticulo;
                            usuarioPedidoDetalleBD.DescripcionArticulo = model.Articulo.DescripcionArticulo;
                            usuarioPedidoDetalleBD.TxtDescMarca = model.Articulo.MarcaArticulo;
                            usuarioPedidoDetalleBD.TxtDescFamilia = model.Articulo.FamiliaArticulo;
                            usuarioPedidoDetalleBD.PrecioListaPorCoeficientePorMedioIva = model.Articulo.PrecioListaPorCoeficientePorMedioIva.Value;
                            usuarioPedidoDetalleBD.Utilidad = model.Utilidad;
                            usuarioPedidoDetalleBD.SnOferta = model.Articulo.SnOferta.Value;
                            usuarioPedidoDetalleBD.PrecioLista = model.Articulo.PrecioLista.Value;
                            usuarioPedidoDetalleBD.Coeficiente = model.Articulo.Coeficiente.Value;
                            usuarioPedidoDetalleBD.Cantidad = model.Cantidad + usuarioPedidoDetalleBD.Cantidad;
                            usuarioPedidoDetalleBD.IdArticulo = model.Articulo.Id;
                            //usuarioPedidoDetalleBD.Articulo -> NO HACE FALTA MODIFICARLO
                            //usuarioPedidoDetalleBD.SnActivo ->NO HACE FALTA MODIFICARLO PORQUE LO HAGO ARRIBA


                            //update del detalle del pedido en base de datos
                            _context.UsuarioPedidoDetalle.Update(usuarioPedidoDetalleBD);
                            _context.SaveChanges();
                        }
                        else //NO EXISTE EL ARTICULO EN EL PEDIDO , POR ENDE AGREGO EL ARTICULO AL PEDIDO
                        {

                            UsuarioPedidoDetalle usuarioPedidoDetalle = new UsuarioPedidoDetalle();
                            //usuarioPedidoDetalle.IdUsuarioPedidoDetalle-> ES AUTOINCREMENTABLE
                            usuarioPedidoDetalle.IdUsuarioPedido = model.IdUsuario;
                            usuarioPedidoDetalle.CodigoArticulo = model.Articulo.CodigoArticulo;
                            usuarioPedidoDetalle.DescripcionArticulo = model.Articulo.DescripcionArticulo;
                            usuarioPedidoDetalle.TxtDescMarca = model.Articulo.MarcaArticulo;
                            usuarioPedidoDetalle.TxtDescFamilia = model.Articulo.FamiliaArticulo;
                            usuarioPedidoDetalle.PrecioListaPorCoeficientePorMedioIva = model.Articulo.PrecioListaPorCoeficientePorMedioIva.Value;
                            usuarioPedidoDetalle.Utilidad = model.Utilidad;
                            usuarioPedidoDetalle.SnOferta = model.Articulo.SnOferta.Value;
                            usuarioPedidoDetalle.PrecioLista = model.Articulo.PrecioLista.Value;
                            usuarioPedidoDetalle.Coeficiente = model.Articulo.Coeficiente.Value;
                            usuarioPedidoDetalle.Cantidad = model.Cantidad;
                            usuarioPedidoDetalle.IdArticulo = model.Articulo.Id;
                            usuarioPedidoDetalle.Articulo = _context.VArticulo.Where(a => a.Id == usuarioPedidoDetalle.IdArticulo).FirstOrDefault();
                            usuarioPedidoDetalle.SnActivo = usuarioPedidoDetalle.Articulo != null ? -1 : 0;
                            usuarioPedido.UsuarioPedidoDetalle.Add(usuarioPedidoDetalle);


                            //genero el detalle del pedido en base de datos
                            _context.UsuarioPedidoDetalle.Add(usuarioPedidoDetalle);
                            _context.SaveChanges();
                        }


                        //modifico el Total del pedido , para los usuarioPedidoDetalle ACTIVOS
                        decimal total = 0;
                        foreach (UsuarioPedidoDetalle usuarioPedidoDetalle in usuarioPedido.UsuarioPedidoDetalle)
                        {
                            if(usuarioPedidoDetalle.SnActivo == -1)
                            {
                                total = total + (usuarioPedidoDetalle.PrecioListaPorCoeficientePorMedioIva * usuarioPedidoDetalle.Cantidad);
                            }
                        }
                        usuarioPedido.Total = total;
                        _context.UsuarioPedido.Update(usuarioPedido);
                        _context.SaveChanges();

                    }


                   
                    transaction.Commit();

                    
                }
                catch (Exception ex)
                {
                    transaction.Rollback();
                }
            }

            //RETORNO
            usuarioPedidoResponse.UsuarioPedido = usuarioPedido;
            usuarioPedidoResponse.IdUsuario = model.IdUsuario;
            return usuarioPedidoResponse;

        }

     

        public IEnumerable<UsuarioPedido> GetAll()
        {
            var pedidos = _context.UsuarioPedido;
            return pedidos.ToList();
        }

        public UsuarioPedido GetByIdPedido(int idPedido)
        {
            var pedido = getByIdPedido(idPedido);
            return pedido;
        }

        public IEnumerable<UsuarioPedido> GetByIdUsuario(int idUsuario)
        {
            var pedidos = getByIdUsuario(idUsuario);
            return pedidos.ToList();
        }

        public UsuarioPedido GetByIdUsuarioNotFinalized(int idUsuario)
        {
            var pedido = getByIdUsuarioNotFinalized(idUsuario);
            return pedido;
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
