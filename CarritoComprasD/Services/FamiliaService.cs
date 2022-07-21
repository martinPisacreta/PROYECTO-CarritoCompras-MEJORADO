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
using CarritoComprasD.Models.Familia;
using CarritoComprasD.Models.Marca;

namespace CarritoComprasD.Services
{
    public interface IFamiliaService
    {

        IEnumerable<ComboBoxFamilia> LoadComboBoxFamiliaByMarca(ComboBoxMarca model);

        IEnumerable<ComboBoxFamilia> LoadComboBoxFamilia();
    }

    public class FamiliaService : IFamiliaService
    {
        private readonly CarritoComprasWebContext _context;
        private readonly IMapper _mapper;

        public FamiliaService(
            CarritoComprasWebContext context,
            IMapper mapper
        )
        {
            _context = context;
            _mapper = mapper;
        }


        ////DEVUELVO SOLAMENTE LAS FAMILIAS ACTIVAS Y NO REPETIDAS , POR idTablaMarca
        public IEnumerable<ComboBoxFamilia> LoadComboBoxFamiliaByMarca(ComboBoxMarca model)
        {
         
            var familias = _context.Marca
                            .Join(_context.Familia,
                              marca => marca.IdTablaMarca,
                              familia => familia.IdTablaMarca,
                              (marca, familia) => new { Marca = marca, Familia = familia })
                            .Where(marcaAndFamilia => 
                                                       marcaAndFamilia.Marca.SnActivo == -1 &&
                                                       marcaAndFamilia.Familia.SnActivo == -1 &&
                                                       model.List_IdTablaMarca.Contains(marcaAndFamilia.Familia.IdTablaMarca))
                            .Select(marcaAndFamilia => new ComboBoxFamilia
                            {
                                DescripcionFamilia = marcaAndFamilia.Familia.TxtDescFamilia,
                                IdTablaFamilia = marcaAndFamilia.Familia.IdTablaFamilia
                            })
                            .Distinct().ToList();


       
            return familias;
        }

        //DEVUELVO SOLAMENTE LAS FAMILIAS ACTIVAS Y NO REPETIDAS 
        public IEnumerable<ComboBoxFamilia> LoadComboBoxFamilia()
        {
            var familias = _context.Familia
               .Where(f => f.SnActivo == -1)
               .Select(f => new ComboBoxFamilia
               {
                   DescripcionFamilia = f.TxtDescFamilia,
                   IdTablaFamilia = f.IdTablaFamilia
               })
               .Distinct().ToList();

            return familias;
        }





    }
}
