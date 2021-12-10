using AutoMapper;
using CarritoComprasD.Entities;
using CarritoComprasD.Helpers.AppSettings;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Drawing;
using System.Drawing.Imaging;
using System.IO;
using System.Linq;
using System.Net;
using System.Threading.Tasks;

namespace CarritoComprasD.Services
{

    public interface IEmpresaService
    {

        Empresa GetById(int id);

    }

    public class EmpresaService : IEmpresaService
    {

        private readonly CarritoComprasWebContext _context;
        private readonly IMapper _mapper;


        public EmpresaService(
            CarritoComprasWebContext context,
            IMapper mapper
           )
        {
            _context = context;
            _mapper = mapper;
        }


        public Empresa GetById(int idEmpresa)
        {
            var empresa = getEmpresa(idEmpresa);
            return _mapper.Map<Empresa>(empresa);

        }

        private Empresa getEmpresa(int idEmpresa)
        {
            var empresa = _context.Empresa.Find(idEmpresa);
            if (empresa == null) throw new KeyNotFoundException("Empresa no encontrada");
            return empresa;
        }

    }
}

