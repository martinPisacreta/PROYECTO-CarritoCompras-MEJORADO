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

namespace CarritoComprasD.Services
{
    public interface IMarcaService
    {
     
        IEnumerable<Marca> GetAll();
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

      
        public IEnumerable<Marca> GetAll()
        {
            var marcas = _context.Marca;
            return _mapper.Map<IList<Marca>>(marcas);
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
