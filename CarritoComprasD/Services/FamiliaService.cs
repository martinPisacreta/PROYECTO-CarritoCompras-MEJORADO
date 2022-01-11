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
using CarritoComprasD.Models.ComboBox;

namespace CarritoComprasD.Services
{
    public interface IFamiliaService
    {
     
        IEnumerable<ComboBoxResponse> GetIdTablaFamiliaAndTxtDescFamiliaWithActiveByIdTablaMarca(int idTablaFamilia);
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


        //DEVUELVO SOLAMENTE LAS FAMILIAS ACTIVAS Y NO REPETIDAS , POR idTablaMarca
        public IEnumerable<ComboBoxResponse> GetIdTablaFamiliaAndTxtDescFamiliaWithActiveByIdTablaMarca(int idTablaFamilia)
        {

            var familias = _context.Familia
                .Where(f =>  f.SnActivo == -1 && f.IdTablaMarca == idTablaFamilia)
                .Select(m => new ComboBoxResponse
                {
                    Id = m.IdTablaFamilia,
                    Label = m.TxtDescFamilia
                })
                .Distinct().ToList();

            return familias;
        }

      

      

    }
}
