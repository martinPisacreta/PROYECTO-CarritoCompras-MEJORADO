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
using CarritoComprasD.Models.CombosBox;

namespace CarritoComprasD.Services
{
    public interface IMarcaService
    {
     
        IEnumerable<ComboBox> GetAllWithPathImgAndActive();
        IEnumerable<ComboBox> LoadComboBoxMarca();
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
        public IEnumerable<ComboBox> GetAllWithPathImgAndActive()
        {

            var marcas = _context.Marca
                .Where(m => m.PathImg != null && m.PathImg != "" && m.SnActivo == -1)
                .Select(m => new ComboBox
                {
                    Label = m.PathImg,
                    Campo = "PathImg"
                })
                .Distinct().ToList();

            return marcas;
        }

        public IEnumerable<ComboBox> LoadComboBoxMarca()
        {
            //RETORNO LOS PATH_IMG QUE NO SEAN NULOS , VACIOS , NO REPETIDOS Y ESTEN ACTIVAS ESAS MARCAS
            var marca_1 = _context.Marca
                .Where(m => m.PathImg != null && m.PathImg != "" && m.SnActivo == -1)
                .Select(m => new ComboBox
                {
                    Label = m.PathImg,
                    Campo = "PathImg"
                   
                })
                .Distinct().ToList();

            //RETORNO LOS TXTDESMARCA , QUE EL CAMPO PATH_IMG SEA (NULO O VACIO) Y ESTEN ACTIVAS ESAS MARCAS
            var marca_2 = _context.Marca
              .Where(m => (m.PathImg == null || m.PathImg == "") && m.SnActivo == -1)
              .Select(m => new ComboBox
              {
                  Label = m.TxtDescMarca,
                  Campo = "TxtDescMarca"

              })
              .Distinct().ToList();

            //UNO LAS DOS
            var allPathImg = marca_1.Union(marca_2);
            return allPathImg;
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
