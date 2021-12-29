using AutoMapper;
using System.Collections.Generic;
using System.Linq;
using CarritoComprasD.Entities;
using CarritoComprasD.Models.UsuarioPedidos;

namespace CarritoComprasD.Services
{
    public interface IUsuarioPedidoDetalleService
    {
        IEnumerable<UsuarioPedidoDetalle> GetAll();
        UsuarioPedidoDetalle GetByIdPedidoDetalle(int idPedidoDetalle);
        IEnumerable<UsuarioPedidoDetalle> GetByIdPedido(int idPedido);
        List<UsuarioPedidoDetalle> AgregarArticuloPedido(UsuarioPedidoRequest model);

        UsuarioPedidoDetalle ModificarArticuloPedido(int idUsuarioPedido, UsuarioPedidoDetalle usuarioPedidoDetalle, UsuarioPedidoRequest model);

        UsuarioPedidoDetalle ModificarArticuloPedido(int idUsuarioPedido, UsuarioPedidoDetalle usuarioPedidoDetalle);
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


        public List<UsuarioPedidoDetalle> AgregarArticuloPedido( UsuarioPedidoRequest model)
        {

            //agrego un articulo al pedido
            List<UsuarioPedidoDetalle> lista_usuarioPedidoDetalle = new List<UsuarioPedidoDetalle>() { };
            UsuarioPedidoDetalle usuarioPedidoDetalle = new UsuarioPedidoDetalle();
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
            lista_usuarioPedidoDetalle.Add(usuarioPedidoDetalle);
            return lista_usuarioPedidoDetalle;
        }

        public UsuarioPedidoDetalle ModificarArticuloPedido(int idUsuarioPedido, UsuarioPedidoDetalle usuarioPedidoDetalle, UsuarioPedidoRequest model)
        {

            //modifico articulo del pedido
            usuarioPedidoDetalle.IdUsuarioPedido = idUsuarioPedido;
            usuarioPedidoDetalle.CodigoArticulo = model.Articulo.CodigoArticulo;
            usuarioPedidoDetalle.DescripcionArticulo = model.Articulo.DescripcionArticulo;
            usuarioPedidoDetalle.TxtDescMarca = model.Articulo.MarcaArticulo;
            usuarioPedidoDetalle.TxtDescFamilia = model.Articulo.FamiliaArticulo;
            usuarioPedidoDetalle.PrecioListaPorCoeficientePorMedioIva = model.Articulo.PrecioListaPorCoeficientePorMedioIva.Value;
            usuarioPedidoDetalle.Utilidad = model.Utilidad;
            usuarioPedidoDetalle.SnOferta = model.Articulo.SnOferta.Value;
            usuarioPedidoDetalle.PrecioLista = model.Articulo.PrecioLista.Value;
            usuarioPedidoDetalle.Coeficiente = model.Articulo.Coeficiente.Value;
            usuarioPedidoDetalle.Cantidad = model.Cantidad + usuarioPedidoDetalle.Cantidad;
            usuarioPedidoDetalle.IdArticulo = model.Articulo.Id;
            return usuarioPedidoDetalle;
        }

        public UsuarioPedidoDetalle ModificarArticuloPedido(int idUsuarioPedido, UsuarioPedidoDetalle usuarioPedidoDetalle)
        {

            //modifico articulo del pedido
            //upd.IdUsuarioPedido = ESTO NO LO MODIFICO;
            usuarioPedidoDetalle.CodigoArticulo = usuarioPedidoDetalle.Articulo.CodigoArticulo;
            usuarioPedidoDetalle.DescripcionArticulo = usuarioPedidoDetalle.Articulo.DescripcionArticulo;
            usuarioPedidoDetalle.TxtDescMarca = usuarioPedidoDetalle.Articulo.MarcaArticulo;
            usuarioPedidoDetalle.TxtDescFamilia = usuarioPedidoDetalle.Articulo.FamiliaArticulo;
            usuarioPedidoDetalle.PrecioListaPorCoeficientePorMedioIva = usuarioPedidoDetalle.Articulo.PrecioListaPorCoeficientePorMedioIva.Value;
            //upd.Utilidad = ESTO NO LO MODIFICO;
            usuarioPedidoDetalle.SnOferta = usuarioPedidoDetalle.Articulo.SnOferta.Value;
            usuarioPedidoDetalle.PrecioLista = usuarioPedidoDetalle.Articulo.PrecioLista.Value;
            usuarioPedidoDetalle.Coeficiente = usuarioPedidoDetalle.Articulo.Coeficiente.Value;
            //upd.Cantidad = ESTO NO LO MODIFICO;
            //upd.IdArticulo = ESTO NO LO MODIFICO;
            return usuarioPedidoDetalle;
        }


        public IEnumerable<UsuarioPedidoDetalle> GetAll()
        {
            var pedidos = _context.UsuarioPedidoDetalle;
            return pedidos.ToList();
        }

        public UsuarioPedidoDetalle GetByIdPedidoDetalle(int idPedidoDetalle)
        {

            var pedidoDetalles = getByIdPedidoDetalle(idPedidoDetalle);
            return pedidoDetalles;

        }

        public IEnumerable<UsuarioPedidoDetalle> GetByIdPedido(int idPedido)
        {
            var pedidoDetalle = getByIdPedido(idPedido);
            return pedidoDetalle.ToList();
  
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
