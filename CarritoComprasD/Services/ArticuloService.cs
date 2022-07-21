using AutoMapper;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Linq;
using CarritoComprasD.Entities;
using CarritoComprasD.Helpers.AppSettings;
using CarritoComprasD.Models.UsuarioPedidos;
using Newtonsoft.Json.Linq;
using Microsoft.EntityFrameworkCore;
using CarritoComprasD.Controllers;
using System.Threading.Tasks;
using Microsoft.Data.SqlClient;
using CarritoComprasD.Models.Articulo;
using Microsoft.AspNetCore.Mvc;
using System.Linq.Expressions;
using LinqKit;

namespace CarritoComprasD.Services
{
    public interface IArticuloService
    {

        Task<ArticuloResponse> GetByFilters(ArticuloRequest model);

        int GetCount();

    }

    public class ArticuloService : IArticuloService
    {
      
        private readonly CarritoComprasWebContext _context;
        private readonly IMapper _mapper;
    
    

        public ArticuloService(
            CarritoComprasWebContext context,
            IMapper mapper
           )
        {
            _context = context;
            _mapper = mapper;
        }

     
        public async Task<ArticuloResponse> GetByFilters(ArticuloRequest model)
        {
            decimal _utilidad = Convert.ToDecimal(model.Utilidad);
            decimal _cien = Convert.ToDecimal(100);
            decimal _uno = Convert.ToDecimal(1);
            int _skip = model.Skip * model.Take;
            ArticuloResponse articuloResponse = new ArticuloResponse();
            int oferta = (model.Oferta == true ? -1 : 0);

            //divido "model.DescripcionArticulo" cuando aparece un espacio y genero una lista en base a eso
            string descripcionArticulo = model.DescripcionArticulo;
            var descripcionArticulo_separado = descripcionArticulo.Split(' ').ToList();

            //divido "model.CodigoArticulo" cuando aparece un espacio y genero una lista en base a eso
            string codigoArticulo = model.CodigoArticulo;
            var codigoArticulo_separado = codigoArticulo.Split(' ').ToList();





            try
            {

                //voy a buscar todos los datos de la vista VArticulo (esta vista ya me trae los articulos ACTIVOS)
                //uso AsNoTracking para -> que Entity Framework no realice ningún procesamiento o almacenamiento adicional de las entidades que devuelve la consulta
                articuloResponse.Articulos = await _context.VArticulo.AsNoTracking().ToListAsync();

                //filtro
                articuloResponse.Articulos = articuloResponse.Articulos
                                                 .Where(a =>
                                                                ((model.ComboBoxMarca != null && model.ComboBoxMarca.List_IdTablaMarca.Contains(a.IdTablaMarca)) || (model.ComboBoxMarca == null))
                                                                && ((model.ComboBoxFamilia != null && a.IdTablaFamilia == model.ComboBoxFamilia.IdTablaFamilia) || (model.ComboBoxFamilia == null))
                                                                && ((codigoArticulo != "" && codigoArticulo_separado.All(p => a.CodigoArticulo.ToUpper().Contains(p.ToUpper()))) || codigoArticulo == "")
                                                                && ((descripcionArticulo != "" &&  descripcionArticulo_separado.All(p => a.DescripcionArticulo.ToUpper().Contains(p.ToUpper()))) || descripcionArticulo == "")
                                                                && ((oferta == -1 && a.SnOferta == oferta) || oferta == 0)
                                                       )
                                                 .Select(a => new VArticulo
                                                 {
                                                      Id = a.Id,
                                                      CodigoArticulo = a.CodigoArticulo,
                                                      PrecioListaPorCoeficientePorMedioIva = a.PrecioListaPorCoeficientePorMedioIva,
                                                      DescripcionArticulo = a.DescripcionArticulo,
                                                      MarcaArticulo = a.MarcaArticulo,
                                                      IdTablaMarca = a.IdTablaMarca,
                                                      FamiliaArticulo = a.FamiliaArticulo,
                                                      IdTablaFamilia = a.IdTablaFamilia,
                                                      UtilidadArticulo = a.PrecioListaPorCoeficientePorMedioIva.Value * ((_utilidad / _cien) + _uno),
                                                      SnOferta = a.SnOferta,
                                                      PathImagenArticulo = a.PathImagenArticulo,
                                                      PrecioLista = a.PrecioLista,
                                                      Coeficiente = a.Coeficiente
                                                        
                                                 })
                                                 .OrderBy(a => a.MarcaArticulo)
                                                 .ThenBy(a => a.CodigoArticulo)
                                                 .ThenBy(a => a.DescripcionArticulo)
                                                 .ThenBy(a => a.FamiliaArticulo)
                                                 .ToList();



                    articuloResponse.Total = articuloResponse.Articulos.Count();
                    articuloResponse.Articulos = articuloResponse.Articulos.Skip(_skip).Take(model.Take).ToList();



                

                return  articuloResponse;




            }
            catch (Exception ex)
            {
                throw ex;
            }

          
        }

        public int GetCount()
        {
          

            try
            {

                int cantidadArticulos = _context.Articulo
                                                   .Where(a => a.FecBaja == null) //solamente los activos
                                                   .Count();

                return cantidadArticulos;

            }
            catch (Exception ex)
            {
                throw ex;
            }


        }

        public static decimal coeficiente_articulo(Familia f)
        {


            decimal a_1 = f.Algoritmo1 == 0.00M ? 1 : f.Algoritmo1;
            decimal a_2 = f.Algoritmo2 == 0.00M ? 1 : f.Algoritmo2;
            decimal a_3 = f.Algoritmo3 == 0.00M ? 1 : f.Algoritmo3;
            decimal a_4 = f.Algoritmo4 == 0.00M ? 1 : f.Algoritmo4;
            decimal a_5 = f.Algoritmo5 == 0.00M ? 1 : f.Algoritmo5;
            decimal a_6 = f.Algoritmo6 == 0.00M ? 1 : f.Algoritmo6;
            decimal a_7 = f.Algoritmo7 == 0.00M ? 1 : f.Algoritmo7;
            decimal a_8 = f.Algoritmo8 == 0.00M ? 1 : f.Algoritmo8;
            decimal a_9 = f.Algoritmo9 == 0.00M ? 1 : f.Algoritmo9;

            decimal _coeficiente_articulo = a_1 * a_2 * a_3 * a_4 * a_5 * a_6 * a_7 * a_8 * a_9;

            return _coeficiente_articulo;

        }

    }
}
