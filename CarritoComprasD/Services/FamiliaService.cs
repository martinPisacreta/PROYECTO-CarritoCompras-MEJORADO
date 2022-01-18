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
    public interface IFamiliaService
    {
     
        IEnumerable<ComboBox> LoadComboBoxFamilia(ComboBox model);
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
        public IEnumerable<ComboBox> LoadComboBoxFamilia(ComboBox model)
        {
            //voy a buscar el IdTablaMarca de :
                //las marcas activas
                //que correspondan por el campo (PathImg o TxtDescMarca)  con el label
            var marcas  =  _context.Marca
                            .Where(m => 
                                            m.SnActivo == -1 
                                            && (
                                                    (model.Campo == "PathImg" && m.PathImg == model.Label) 
                                                    || (model.Campo == "TxtDescMarca" && m.TxtDescMarca == model.Label)
                                                )
                                  )
                            .Select(m => new Marca
                            {
                                IdTablaMarca = m.IdTablaMarca

                            })
                            .Distinct().ToList();

            List<int> lista_IdTablaMarca = new List<int>();
            foreach (Marca marca in marcas)
            {
                lista_IdTablaMarca.Add(marca.IdTablaMarca);
            }
               


            var familias = _context.Familia
                .Where(f =>  f.SnActivo == -1 && lista_IdTablaMarca.Contains(f.IdTablaMarca))
                .Select(f => new ComboBox
                {     
                    Label = f.TxtDescFamilia,
                    Campo= "TxtDescFamilia"
                })
                .Distinct().ToList();

            return familias;
        }

      

      

    }
}
