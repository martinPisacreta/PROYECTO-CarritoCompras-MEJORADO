using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CarritoComprasD.Models;
using Microsoft.AspNetCore.Authorization;
using CarritoComprasD.Entities;
using AutoMapper;
using CarritoComprasD.Controllers;
using CarritoComprasD.Services;

namespace Carrito_Compras_Core.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class MarcasController : BaseController
    {
        private readonly IMarcaService _marcaService;
        private readonly IMapper _mapper;

        public MarcasController(
            IMarcaService marcaService,
            IMapper mapper)
        {
            _marcaService = marcaService;
            _mapper = mapper;
        }

        [HttpGet]
        public ActionResult<IEnumerable<Marca>> GetAll()
        {
            var marcas = _marcaService.GetAll();
            return Ok(marcas);
        }

       
        [HttpGet("{id:int}")]
        public ActionResult<Marca> GetById(int id)
        {
          
            var marca = _marcaService.GetById(id);
            return Ok(marca);
        }

    }
}