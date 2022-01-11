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
    public interface IMarcaService
    {
     
        IEnumerable<Marca> GetAllWithPathImgAndActive();
        IEnumerable<ComboBoxResponse> GetIdTablaMarcaAndTxtDescMarcaWithActive();
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

        //DEVUELVO SOLAMENTE LAS MARCAS CON LOS PATH_IMG , NO REPETIDOS Y ACTIVOS
        public IEnumerable<Marca> GetAllWithPathImgAndActive()
        {

            var marcas = _context.Marca
                .Where(m => m.PathImg != null && m.PathImg != "" && m.SnActivo == -1)
                .Distinct().ToList();

            return _mapper.Map<IList<Marca>>(marcas);
        }

        //DEVUELVO SOLAMENTE LAS MARCAS ACTIVAS Y NO REPETIDAS
        public IEnumerable<ComboBoxResponse> GetIdTablaMarcaAndTxtDescMarcaWithActive()
        {

            var marcas = _context.Marca
                .Where(m =>  m.SnActivo == -1)
                .Select(m => new ComboBoxResponse
                {
                    Id = m.IdTablaMarca,
                    Label = m.TxtDescMarca
                })
                .Distinct().ToList();

            return marcas;
        }

        public Marca GetById(int id)
        {
            var marca = getMarca(id);
            return _mapper.Map<Marca>(marca);
        }

       

        private Marca getMarca(int id)
        {
            var marca = _context.Marca.Find(id);
            if (marca == null) throw new KeyNotFoundException("Marca no encontrada");
            return marca;
        }

    }
}
