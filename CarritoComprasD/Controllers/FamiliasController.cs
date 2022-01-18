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
using CarritoComprasD.Models.CombosBox;

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


        [HttpPost]
        public ActionResult<IEnumerable<ComboBox>> LoadComboBoxFamilia(ComboBox model)
        {
            var familias = _familiaService.LoadComboBoxFamilia(model);
            return Ok(familias);
        }
    }
}
