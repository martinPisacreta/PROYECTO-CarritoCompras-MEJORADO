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

namespace CarritoComprasD.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class FamiliasController : Controller
    {
        private readonly IFamiliaService _familiaService;
        private readonly IMapper _mapper;

        public FamiliasController(
            IFamiliaService familiaService,
            IMapper mapper)
        {
            _familiaService = familiaService;
            _mapper = mapper;
        }


        [HttpGet("{idTablaFamilia:int}")]
        public ActionResult<IEnumerable<ComboBoxResponse>> GetIdTablaFamiliaAndTxtDescFamiliaWithActiveByIdTablaMarca(int idTablaFamilia)
        {
            var familias = _familiaService.GetIdTablaFamiliaAndTxtDescFamiliaWithActiveByIdTablaMarca(idTablaFamilia);
            return Ok(familias);
        }
    }
}
