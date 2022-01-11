using AutoMapper;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Linq;
using CarritoComprasD.Entities;
using CarritoComprasD.Helpers.AppSettings;
using CarritoComprasD.Models.UsuarioPedidos;
using CarritoComprasD.Helpers;

namespace CarritoComprasD.Services
{

    //NO ESTA CREADO UsuarioPedidoDetalleService PORQUE MANEJO TODO DESDE UsuarioPedidoService.cs

    public interface IUsuarioPedidoService
    {
        UsuarioPedidoResponse AgregarArticuloPedido(UsuarioPedidoAgregarArticuloRequest model);
        UsuarioPedidoResponse EliminarArticuloPedido(UsuarioPedidoEliminarArticuloRequest model);
        UsuarioPedidoResponse ModificarArticuloPedido(UsuarioPedidoModificarArticuloRequest model);
        UsuarioPedidoFinalizarResponse FinalizarPedido(UsuarioPedidoFinalizarRequest model);
        UsuarioPedido GetByIdPedido(int id);
        IEnumerable<UsuarioPedido> GetByIdUsuario(int idUsuario);
        UsuarioPedido GetByIdUsuarioNotFinalized(int idUsuario);
       
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

        #region ---------------------------------- AGREGAR ARTICULO - ELIMINAR ARTICULO - MODIFICACION ARTICULO -----------------------------------------------------
        public UsuarioPedidoResponse AgregarArticuloPedido(UsuarioPedidoAgregarArticuloRequest model)
        {
            UsuarioPedido usuarioPedido = null;
            UsuarioPedidoResponse usuarioPedidoResponse = new UsuarioPedidoResponse();
            using (var transaction = _context.Database.BeginTransaction())
            {
                try
                {
                    //voy a buscar el pedido del IdUsuario que no este finalizado
                    usuarioPedido = _context.UsuarioPedido.Where(up => up.IdUsuario == model.IdUsuario && up.SnFinalizado == false).FirstOrDefault();

                    //no existe pedido
                    if (usuarioPedido == null)  
                    {
                        //seteo el pedido
                        usuarioPedido = new UsuarioPedido();
                        usuarioPedido.FechaPedido = DateTime.Now;
                        usuarioPedido.IdUsuario = model.IdUsuario;
                        usuarioPedido.IdEmpresa = model.IdEmpresa;
                        usuarioPedido.Total = Convert.ToDecimal(model.Articulo.PrecioListaPorCoeficientePorMedioIva * model.Cantidad);
                        usuarioPedido.SnFinalizado = false;
                        usuarioPedido.SnEnvioMail = false;

                        //genero el pedido en base de datos
                        _context.UsuarioPedido.Add(usuarioPedido);
                        _context.SaveChanges();

                        //voy a buscar los detalles del pedido activos
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

                        //preparo para generar el detalle del pedido en base de datos
                        usuarioPedido.UsuarioPedidoDetalle.Add(usuarioPedidoDetalle);


                        //genero el detalle del pedido en base de datos
                        _context.UsuarioPedidoDetalle.Add(usuarioPedidoDetalle);
                        _context.SaveChanges();


                    }
                    //existe pedido
                    else
                    {
                        UsuarioPedidoDetalle usuarioPedidoDetalleBD = null;

                        //voy a buscar los detalles del pedido activos
                        usuarioPedido.UsuarioPedidoDetalle = _context.UsuarioPedidoDetalle.Where(upd => upd.IdUsuarioPedido == usuarioPedido.IdUsuarioPedido && upd.SnActivo == -1).ToList();

                        //recorro los detalles del pedido activos
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
                            UsuarioPedidoDetalle _usuarioPedidoDetalle = Setear_UsuarioPedidoDetalle_ACTIVOS_Con_Datos_De_VArticulo(usuarioPedidoDetalle);

                            //voy a buscar el articulo asociado al detalle del pedido
                            usuarioPedidoDetalle.Articulo = _usuarioPedidoDetalle.Articulo;

                            //update del detalle del pedido en base de datos
                            _context.UsuarioPedidoDetalle.Update(_usuarioPedidoDetalle);
                            _context.SaveChanges();

                        }
                        //termina foreach


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


                        //modifico el Total del pedido , para los detalles del pedido activos
                        usuarioPedido = SeteoTotalPedido_Con_UsuarioPedidoDetalle_ACTIVOS(usuarioPedido);
                        _context.UsuarioPedido.Update(usuarioPedido);
                        _context.SaveChanges();

                    }



                    transaction.Commit();


                }
                catch (Exception ex)
                {
                    transaction.Rollback();
                    throw new AppException(ex.Message);
                }
            }

            //RETORNO
            usuarioPedidoResponse.UsuarioPedido = usuarioPedido;
            usuarioPedidoResponse.IdUsuario = model.IdUsuario;
            return usuarioPedidoResponse;

        }


        public UsuarioPedidoResponse EliminarArticuloPedido(UsuarioPedidoEliminarArticuloRequest model)
        {
            UsuarioPedido usuarioPedido = null;
            UsuarioPedidoResponse usuarioPedidoResponse = new UsuarioPedidoResponse();
            using (var transaction = _context.Database.BeginTransaction())
            {
                try
                {
                    //voy a buscar el pedido del IdUsuario que no este finalizado
                    usuarioPedido = _context.UsuarioPedido.Where(up => up.IdUsuario == model.IdUsuario && up.SnFinalizado == false).FirstOrDefault();
                    
                    //voy a buscar los detalles del pedido activos
                    usuarioPedido.UsuarioPedidoDetalle = _context.UsuarioPedidoDetalle.Where(upd => upd.IdUsuarioPedido == usuarioPedido.IdUsuarioPedido && upd.SnActivo == -1).ToList();

                    //recorro los detalles del pedido activos
                    foreach (UsuarioPedidoDetalle usuarioPedidoDetalle in usuarioPedido.UsuarioPedidoDetalle)
                    {
                        //SI EL ARTICULO QUE QUIERO ELIMINAR AL PEDIDO EXISTE EN EL PEDIDO....
                        if (usuarioPedidoDetalle.IdArticulo == model.IdArticulo)
                        {
                            //inactivo el articulo
                            usuarioPedidoDetalle.SnActivo = 0;

                            //update del detalle del pedido en base de datos
                            _context.UsuarioPedidoDetalle.Update(usuarioPedidoDetalle);
                            _context.SaveChanges();
                            continue;
                        }

                        //MODIFICO ARTICULOS DEL PEDIDO CON LOS DATOS ACTUALIZADOS DE LA VISTA VARTICULO
                        //ESTO LO HAGO POR EJEMPLO SI HAY ARTICULOS CARGADOS DESDE EL LUNES Y HOY ES VIERNES...
                        //...ESOS ARTICULOS PUDIERON SUFRIR MODIFICACION DE PRECIOS
                        UsuarioPedidoDetalle _usuarioPedidoDetalle = Setear_UsuarioPedidoDetalle_ACTIVOS_Con_Datos_De_VArticulo(usuarioPedidoDetalle);

                        //voy a buscar el articulo asociado al detalle del pedido
                        usuarioPedidoDetalle.Articulo = _usuarioPedidoDetalle.Articulo;

                        //update del detalle del pedido en base de datos
                        _context.UsuarioPedidoDetalle.Update(_usuarioPedidoDetalle);
                        _context.SaveChanges();

                    }
                    //termina foreach



                    //modifico el Total del pedido , para los detalles del pedido activos
                    usuarioPedido = SeteoTotalPedido_Con_UsuarioPedidoDetalle_ACTIVOS(usuarioPedido);
                    _context.UsuarioPedido.Update(usuarioPedido);
                    _context.SaveChanges();



                    transaction.Commit();


                }
                catch (Exception ex)
                {
                    transaction.Rollback();
                    throw new AppException(ex.Message);
                }
            }

            

            //voy a buscar los detalles del pedido activos , ya que arriba elimine uno...
            usuarioPedido.UsuarioPedidoDetalle = _context.UsuarioPedidoDetalle.Where(upd => upd.IdUsuarioPedido == usuarioPedido.IdUsuarioPedido && upd.SnActivo == -1).ToList();

            //RETORNO
            usuarioPedidoResponse.UsuarioPedido = usuarioPedido;
            usuarioPedidoResponse.IdUsuario = model.IdUsuario;
            return usuarioPedidoResponse;
        }


        public UsuarioPedidoResponse ModificarArticuloPedido(UsuarioPedidoModificarArticuloRequest model)
        {
            UsuarioPedido usuarioPedido = null;
            UsuarioPedidoResponse usuarioPedidoResponse = new UsuarioPedidoResponse();
            using (var transaction = _context.Database.BeginTransaction())
            {
                try
                {
                    //voy a buscar el pedido del IdUsuario que no este finalizado
                    usuarioPedido = _context.UsuarioPedido.Where(up => up.IdUsuario == model.IdUsuario && up.SnFinalizado == false).FirstOrDefault();
                   
                    //voy a buscar los detalles del pedido activos
                    usuarioPedido.UsuarioPedidoDetalle = _context.UsuarioPedidoDetalle.Where(upd => upd.IdUsuarioPedido == usuarioPedido.IdUsuarioPedido && upd.SnActivo == -1).ToList();

                    //recorro los detalles del pedido activos
                    foreach (UsuarioPedidoDetalle usuarioPedidoDetalle in usuarioPedido.UsuarioPedidoDetalle)
                    {
                        //SI EL ARTICULO QUE QUIERO MODIFICAR EN EL PEDIDO EXISTE EN EL PEDIDO....
                        if (usuarioPedidoDetalle.IdArticulo == model.IdArticulo)
                        {
                            //modifico cantidad en articulo
                            usuarioPedidoDetalle.Cantidad = model.Cantidad;


                            //update del detalle del pedido en base de datos
                            _context.UsuarioPedidoDetalle.Update(usuarioPedidoDetalle);
                            _context.SaveChanges();
                        }

                        //MODIFICO ARTICULOS DEL PEDIDO CON LOS DATOS ACTUALIZADOS DE LA VISTA VARTICULO
                        //ESTO LO HAGO POR EJEMPLO SI HAY ARTICULOS CARGADOS DESDE EL LUNES Y HOY ES VIERNES...
                        //...ESOS ARTICULOS PUDIERON SUFRIR MODIFICACION DE PRECIOS
                        UsuarioPedidoDetalle _usuarioPedidoDetalle = Setear_UsuarioPedidoDetalle_ACTIVOS_Con_Datos_De_VArticulo(usuarioPedidoDetalle);

                        //voy a buscar el articulo asociado al detalle del pedido
                        usuarioPedidoDetalle.Articulo = _usuarioPedidoDetalle.Articulo;
                        
                        //update del detalle del pedido en base de datos
                        _context.UsuarioPedidoDetalle.Update(_usuarioPedidoDetalle);
                        _context.SaveChanges();

                    }

                    //modifico el Total del pedido , para los detalles del pedido activos
                    usuarioPedido = SeteoTotalPedido_Con_UsuarioPedidoDetalle_ACTIVOS(usuarioPedido);
                    _context.UsuarioPedido.Update(usuarioPedido);
                    _context.SaveChanges();



                    transaction.Commit();


                }
                catch (Exception ex)
                {
                    transaction.Rollback();
                    throw new AppException(ex.Message);
                }
            }

            //RETORNO
            usuarioPedidoResponse.UsuarioPedido = usuarioPedido;
            usuarioPedidoResponse.IdUsuario = model.IdUsuario;
            return usuarioPedidoResponse;
        }

        #endregion ---------------------------------- AGREGAR ARTICULO - ELIMINAR ARTICULO - MODIFICACION ARTICULO -----------------------------------------------------


        #region ---------------------------------- FINALIZAR PEDIDO -------------------------------------------------------------------

        public UsuarioPedidoFinalizarResponse FinalizarPedido(UsuarioPedidoFinalizarRequest model)
        {
            Usuario usuario = null;
            Empresa empresa = null;
            UsuarioPedido usuarioPedido = null;
            ICollection<UsuarioPedidoDetalle> usuarioPedidoDetalle = null;
            UsuarioPedidoFinalizarResponse usuarioPedidoFinalizarResponse = new UsuarioPedidoFinalizarResponse();
            string respuesta = "";
            using (var transaction = _context.Database.BeginTransaction())
            {
                try
                {
                    usuario = _context.Usuario.Where(u => u.IdUsuario == model.IdUsuario).FirstOrDefault();
                    empresa = _context.Empresa.Where(e => e.IdEmpresa == model.IdEmpresa).FirstOrDefault();

                    //voy a buscar el pedido del IdUsuario que no este finalizado
                    usuarioPedido = _context.UsuarioPedido.Where(up => up.IdUsuario == model.IdUsuario && up.SnFinalizado == false).FirstOrDefault();
                  

                    //voy a buscar el detalle del pedido en base al IdUsuarioPedido
                    usuarioPedidoDetalle = _context.UsuarioPedidoDetalle.Where(upd => upd.IdUsuarioPedido == usuarioPedido.IdUsuarioPedido).ToList();

                   
                    //finalizo el pedido
                    usuarioPedido.SnFinalizado = true;

                    //envio mail
                    respuesta = sendPedidoEmail(usuario , usuarioPedido , usuarioPedidoDetalle);
                    if (respuesta != "")
                    {
                        usuarioPedido.SnEnvioMail = false;
                        usuarioPedido.RespuestaEnvioMail = "Se finalizo el pedido , pero no se pudo enviar el mail por la siguiente razon: " + respuesta;
                    }
                    else
                    {
                        usuarioPedido.SnEnvioMail = true;
                        usuarioPedido.RespuestaEnvioMail = "Pedido finalizado correctamente";
                    }

                    _context.UsuarioPedido.Update(usuarioPedido);
                    _context.SaveChanges();
                    transaction.Commit(); 
                }
                catch (Exception ex)
                {
                    transaction.Rollback();
                    throw new AppException(ex.Message);
                }

                //RETORNO
                usuarioPedidoFinalizarResponse.UsuarioPedido = usuarioPedido;
                usuarioPedidoFinalizarResponse.IdUsuario = usuario.IdUsuario;
                return usuarioPedidoFinalizarResponse;
                
            }
        }
        #endregion ---------------------------------- FINALIZAR PEDIDO -------------------------------------------------------------------

        #region ---------------------------------- METODOS GET ------------------------------------------------------------------------

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
            UsuarioPedido usuarioPedido = null;
            using (var transaction = _context.Database.BeginTransaction())
            {
                try
                {
                    //voy a buscar el pedido del IdUsuario que no este finalizado
                    usuarioPedido = _context.UsuarioPedido
                              .Where(up => up.IdUsuario == idUsuario && up.SnFinalizado == false)
                              .OrderByDescending(up => up.IdUsuarioPedido)
                              .FirstOrDefault();



                    if (usuarioPedido == null) return null;

                    //voy a buscar los detalles del pedido activos
                    usuarioPedido.UsuarioPedidoDetalle = _context.UsuarioPedidoDetalle.Where(upd => upd.IdUsuarioPedido == usuarioPedido.IdUsuarioPedido && upd.SnActivo == -1).ToList();

                    //recorro los detalles del pedido activos
                    foreach (UsuarioPedidoDetalle usuarioPedidoDetalle in usuarioPedido.UsuarioPedidoDetalle)
                    {

                        //MODIFICO ARTICULOS DEL PEDIDO CON LOS DATOS ACTUALIZADOS DE LA VISTA VARTICULO
                        //ESTO LO HAGO POR EJEMPLO SI HAY ARTICULOS CARGADOS DESDE EL LUNES Y HOY ES VIERNES...
                        //...ESOS ARTICULOS PUDIERON SUFRIR MODIFICACION DE PRECIOS
                        UsuarioPedidoDetalle _usuarioPedidoDetalle = Setear_UsuarioPedidoDetalle_ACTIVOS_Con_Datos_De_VArticulo(usuarioPedidoDetalle);

                        //voy a buscar el articulo asociado al detalle del pedido
                        usuarioPedidoDetalle.Articulo = _usuarioPedidoDetalle.Articulo;

                        //update del detalle del pedido en base de datos
                        _context.UsuarioPedidoDetalle.Update(_usuarioPedidoDetalle);
                        _context.SaveChanges();

                    }
                    //termina foreach

                    //modifico el Total del pedido , para los detalles del pedido activos
                    usuarioPedido = SeteoTotalPedido_Con_UsuarioPedidoDetalle_ACTIVOS(usuarioPedido);
                    _context.UsuarioPedido.Update(usuarioPedido);
                    _context.SaveChanges();



                    transaction.Commit();


                }
                catch (Exception ex)
                {
                    transaction.Rollback();
                    throw new AppException(ex.Message);
                }
            }

          


            return usuarioPedido;
        }

        #endregion ---------------------------------- METODOS GET ------------------------------------------------------------------------


        #region ---------------------------------- HELPERS ------------------------------------------------------------------------

        //SETEO ARTICULOS ACTIVOS DEL PEDIDO CON LOS DATOS ACTUALIZADOS DE LA VISTA VARTICULO
        //ESTO LO HAGO POR EJEMPLO SI HAY ARTICULOS CARGADOS DESDE EL LUNES Y HOY ES VIERNES...
        //...ESOS ARTICULOS PUDIERON SUFRIR MODIFICACION DE PRECIOS
        public UsuarioPedidoDetalle Setear_UsuarioPedidoDetalle_ACTIVOS_Con_Datos_De_VArticulo(UsuarioPedidoDetalle usuarioPedidoDetalle)
        {
            //MODIFICO ARTICULOS ACTIVOS DEL PEDIDO CON LOS DATOS ACTUALIZADOS DE LA VISTA VARTICULO
            //ESTO LO HAGO POR EJEMPLO SI HAY ARTICULOS CARGADOS DESDE EL LUNES Y HOY ES VIERNES...
            //...ESOS ARTICULOS PUDIERON SUFRIR MODIFICACION DE PRECIOS
            VArticulo articulo = _context.VArticulo.Where(a => a.Id == usuarioPedidoDetalle.IdArticulo && usuarioPedidoDetalle.SnActivo == -1).FirstOrDefault();
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


            }

            return usuarioPedidoDetalle;
        }

        //modifico el Total del pedido , para los detalles del pedido activos
        public UsuarioPedido SeteoTotalPedido_Con_UsuarioPedidoDetalle_ACTIVOS(UsuarioPedido usuarioPedido)
        {
            decimal total = 0;
            foreach (UsuarioPedidoDetalle usuarioPedidoDetalle in usuarioPedido.UsuarioPedidoDetalle)
            {
                if (usuarioPedidoDetalle.SnActivo == -1)
                {
                    total = total + (Math.Round(usuarioPedidoDetalle.PrecioListaPorCoeficientePorMedioIva,2) * usuarioPedidoDetalle.Cantidad);
                }
            }
            usuarioPedido.Total = total;
            return usuarioPedido;
        }

        private string sendPedidoEmail(Usuario usuario , UsuarioPedido usuarioPedido , ICollection<UsuarioPedidoDetalle> usuarioPedidoDetalle)
        {
            string respuesta = "";
            try
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
                                               "<span>" + usuario.RazonSocial + "</span> " +
                                           "</div> " +

                                           "<div> " +
                                               "<strong> Telefono :</strong> " +
                                               "<span>" + usuario.Telefono + "</span> " +
                                           "</div> " +

                                           "<div> " +
                                               "<strong> Cuit :</strong> " +
                                               "<span>" + usuario.Cuit + "</span> " +
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
                foreach (UsuarioPedidoDetalle upd in usuarioPedidoDetalle)
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
                                "<span>" + usuarioPedido.Total.ToString("N2") + "</span> " +
                            "</div> " +

                                        "</div> " +
                                    "</div> " +
                                "</div> " +
                            "</body> " +
                        "</html>";

                _emailService.Send(
                    to: _appSettings_emailDestinoPedido.Cuenta,
                    subject: "Ingreso de pedido : " + usuario.RazonSocial,
                    html: $@"{message}"
                );

              
                return respuesta;
            }
            catch(Exception ex)
            {
                respuesta = ex.Message.ToString();
                return respuesta;
            }
        }

        #endregion ---------------------------------- HELPERS ------------------------------------------------------------------------
    }
}
