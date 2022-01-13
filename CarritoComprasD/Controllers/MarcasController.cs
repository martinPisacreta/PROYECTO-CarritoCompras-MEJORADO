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
using CarritoComprasD.Models.ComboBox;

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

        [HttpGet("get-all-with-pathImg-and-active")]
        public ActionResult<IEnumerable<Marca>> GetAllWithPathImgAndActive()
        {
            var marcas = _marcaService.GetAllWithPathImgAndActive();
            return Ok(marcas);
        }

        [HttpGet("get-idTablaMarca-and-txtDescMarca-with-active")]
        public ActionResult<IEnumerable<ComboBoxResponse>> GetIdTablaMarcaAndTxtDescMarcaWithActive()
        {
            var marcas = _marcaService.GetIdTablaMarcaAndTxtDescMarcaWithActive();
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