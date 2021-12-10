using AutoMapper;
using System.Collections.Generic;
using System.Linq;
using CarritoComprasD.Entities;
using CarritoComprasD.Models.UsuarioPedidoDetalles;

namespace CarritoComprasD.Services
{
    public interface IUsuarioPedidoDetalleService
    {
        IEnumerable<UsuarioPedidoDetalleResponse> GetAll();
        UsuarioPedidoDetalleResponse GetByIdPedidoDetalle(int idPedidoDetalle);
        IEnumerable<UsuarioPedidoDetalleResponse> GetByIdPedido(int idPedido);
        UsuarioPedidoDetalleResponse Create(CreateUsuarioPedidoDetalleRequest model);
        UsuarioPedidoDetalleResponse Update(int id, UpdateUsuarioPedidoDetalleRequest model);
        void Delete(int idPedidoDetalle);
    }

    public class UsuarioPedidoDetalleService : IUsuarioPedidoDetalleService
    {
        private readonly CarritoComprasWebContext _context;
        private readonly IMapper _mapper;

        public UsuarioPedidoDetalleService(
            CarritoComprasWebContext context,
            IMapper mapper
          )
        {
            _context = context;
            _mapper = mapper;
  
        }

   
        public IEnumerable<UsuarioPedidoDetalleResponse> GetAll()
        {
            var pedidos = _context.UsuarioPedidoDetalle;
            return _mapper.Map<IList<UsuarioPedidoDetalleResponse>>(pedidos);
        }

        public UsuarioPedidoDetalleResponse GetByIdPedidoDetalle(int idPedidoDetalle)
        {

            var pedidoDetalles = getByIdPedidoDetalle(idPedidoDetalle);
            return _mapper.Map<UsuarioPedidoDetalleResponse>(pedidoDetalles);

        }

        public IEnumerable<UsuarioPedidoDetalleResponse> GetByIdPedido(int idPedido)
        {
            var pedidoDetalle = getByIdPedido(idPedido);
            return _mapper.Map<IList<UsuarioPedidoDetalleResponse>>(pedidoDetalle);
  
        }

        public UsuarioPedidoDetalleResponse Create(CreateUsuarioPedidoDetalleRequest model)
        {
          
            // map model to new usuarioPedidoDetalle object
            var pedidoDetalle = _mapper.Map<UsuarioPedidoDetalle>(model);


            pedidoDetalle.IdUsuarioPedido = model.IdUsuarioPedido;
            pedidoDetalle.CodigoArticulo = model.CodigoArticulo;
            pedidoDetalle.DescripcionArticulo = model.DescripcionArticulo;
            pedidoDetalle.TxtDescMarca = model.TxtDescMarca;
            pedidoDetalle.TxtDescFamilia = model.TxtDescFamilia;
            pedidoDetalle.PrecioListaPorCoeficientePorMedioIva = model.PrecioListaPorCoeficientePorMedioIva;
            pedidoDetalle.Utilidad = model.Utilidad;
            pedidoDetalle.SnOferta = model.SnOferta;
            pedidoDetalle.PrecioLista = model.PrecioLista;
            pedidoDetalle.Coeficiente = model.Coeficiente;
            pedidoDetalle.Cantidad = model.Cantidad;
            pedidoDetalle.IdArticulo = model.IdArticulo;


            // save usuarioPedidoDetalle
            _context.UsuarioPedidoDetalle.Add(pedidoDetalle);
            _context.SaveChanges();


            return _mapper.Map<UsuarioPedidoDetalleResponse>(pedidoDetalle);
        }

        public UsuarioPedidoDetalleResponse Update(int id, UpdateUsuarioPedidoDetalleRequest model)
        {
            var pedidoDetalle = getByIdPedidoDetalle(id);

            // copy model to usuarioPedidoDetalle and save
            _mapper.Map(model, pedidoDetalle);
            _context.UsuarioPedidoDetalle.Update(pedidoDetalle);
            _context.SaveChanges();

            return _mapper.Map<UsuarioPedidoDetalleResponse>(pedidoDetalle);
        }

        public void Delete(int idPedidoDetalle)
        {
            var pedidoDetalle = getByIdPedidoDetalle(idPedidoDetalle);
            _context.UsuarioPedidoDetalle.Remove(pedidoDetalle);
            _context.SaveChanges();
        }


        private IEnumerable<UsuarioPedidoDetalle>  getByIdPedido(int idPedido)
        {
            var pedidos = _context.UsuarioPedidoDetalle
                                .Where(upd => upd.IdUsuarioPedido == idPedido)
                                .OrderByDescending(upd => upd.IdUsuarioPedidoDetalle);
            if (pedidos == null) throw new KeyNotFoundException("No se encontraron detalles del pedido");
            return pedidos;
        }

        private UsuarioPedidoDetalle getByIdPedidoDetalle(int idPedidoDetalle)
        {

            var usuarioPedidoDetalle = _context.UsuarioPedidoDetalle.Find(idPedidoDetalle);
            if (usuarioPedidoDetalle == null) throw new KeyNotFoundException("No se encontro el detalle del pedido");
            return usuarioPedidoDetalle;
           
        }

    }
}
