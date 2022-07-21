using AutoMapper;
using BC = BCrypt.Net.BCrypt;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using CarritoComprasD.Entities;
using CarritoComprasD.Models.Marca;
using CarritoComprasD.Models.Familia;

namespace CarritoComprasD.Services
{
    public interface IMarcaService
    {
     
        IEnumerable<ComboBoxMarca> GetAllWithPathImgAndActive();
        IEnumerable<ComboBoxMarca> LoadComboBoxMarca();
        Marca GetById(int id);
    }

    public class MarcaService : IMarcaService
    {
        private readonly CarritoComprasWebContext _context;
        private readonly IMapper _mapper;

        public MarcaService(
            CarritoComprasWebContext context,
            IMapper mapper
        )
        {
            _context = context;
            _mapper = mapper;
        }

        public IEnumerable<ComboBoxMarca> GetAllWithPathImgAndActive()
        {

            var marcas_1 = pathImg_NotNull_NotEmpty_NotRepeat_Active();

            //AGRUPO POR "DescripcionMarca"
            var allMarcasGroup = marcas_1.GroupBy(m => m.DescripcionMarca);

            return convert_allMarcasGroup_To_ComboBoxMarca(allMarcasGroup);
        }

        public IEnumerable<ComboBoxMarca> LoadComboBoxMarca()
        {

            var marca_1 = pathImg_NotNull_NotEmpty_NotRepeat_Active();

            var marca_2 = txtDescMarca_Active_With_PathImg_Null_o_Empty();

            //UNO LAS DOS TABLAS
            var allMarcas = marca_1.Union(marca_2)
                                   .Distinct()
                                   .OrderBy(m => m.DescripcionMarca);

            //AGRUPO POR "DescripcionMarca"
            var allMarcasGroup = allMarcas.GroupBy(m => m.DescripcionMarca);

            return convert_allMarcasGroup_To_ComboBoxMarca(allMarcasGroup);
        }

 
        public Marca GetById(int id)
        {
            var marca = getMarca(id);
            return _mapper.Map<Marca>(marca);
        }

       //------------------------------------------------------- HELPERS -------------------------------------------------------------------------------

        private Marca getMarca(int id)
        {
            var marca = _context.Marca.Find(id);
            if (marca == null) throw new KeyNotFoundException("Marca no encontrada");
            return marca;
        }

        private static IEnumerable<ComboBoxMarca> convert_allMarcasGroup_To_ComboBoxMarca(IEnumerable<IGrouping<dynamic, dynamic>> allMarcasGroup)
        {
            //GENERO ComboBoxMarca
            List<ComboBoxMarca> comboBoxMarcas = new List<ComboBoxMarca>();
            ComboBoxMarca item_comboBoxMarca = null;

            foreach (var marca in allMarcasGroup)
            {
                item_comboBoxMarca = new ComboBoxMarca();
                item_comboBoxMarca.DescripcionMarca = marca.Key;
                foreach (var m in marca)
                {
                    item_comboBoxMarca.List_IdTablaMarca.Add(m.IdTablaMarca);
                }

                comboBoxMarcas.Add(item_comboBoxMarca);
            }
            return comboBoxMarcas;
        }

        private List<dynamic> pathImg_NotNull_NotEmpty_NotRepeat_Active()
        {
            //RETORNO LOS PATH_IMG QUE NO SEAN NULOS , VACIOS , NO REPETIDOS Y ESTEN ACTIVAS ESAS MARCAS
            var marcas = _context.Marca
                .Where(m => m.PathImg != null && m.PathImg != "" && m.SnActivo == -1)
                .Select(m => new
                {
                    DescripcionMarca = m.PathImg,
                    PathImg_o_TxtDescMarca = "PathImg",
                    IdTablaMarca = m.IdTablaMarca

                })
                .Distinct().ToList<dynamic>();

            return marcas;
        }

        private List<dynamic> txtDescMarca_Active_With_PathImg_Null_o_Empty()
        {
            //RETORNO LOS TXTDESMARCA , QUE EL CAMPO PATH_IMG SEA (NULO O VACIO) Y ESTEN ACTIVAS ESAS MARCAS
            var marcas = _context.Marca
              .Where(m => (m.PathImg == null || m.PathImg == "") && m.SnActivo == -1)
              .Select(m => new
              {
                  DescripcionMarca = m.TxtDescMarca,
                  PathImg_o_TxtDescMarca = "TxtDescMarca",
                  IdTablaMarca = m.IdTablaMarca

              })
              .Distinct().ToList<dynamic>();

            return marcas;
        }

    }
}
