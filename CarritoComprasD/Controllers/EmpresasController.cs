using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CarritoComprasD.Models;
using Microsoft.AspNetCore.Authorization;
using CarritoComprasD.Entities;
using CarritoComprasD.Services;
using AutoMapper;
using CarritoComprasD.Controllers;

namespace Carrito_Compras_Core.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class EmpresasController : BaseController
    {
        private readonly IEmpresaService _empresaService;
        private readonly IMapper _mapper;

        public EmpresasController(
            IEmpresaService empresaService,
            IMapper mapper)
        {
            _empresaService = empresaService;
            _mapper = mapper;
        }



        [HttpGet("{id:int}")]
        public ActionResult<Empresa> GetById(int id)
        {
          
            var empresa = _empresaService.GetById(id);
            return Ok(empresa);
        }
    }
}
