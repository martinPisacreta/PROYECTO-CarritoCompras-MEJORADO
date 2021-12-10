using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using AutoMapper;
using CarritoComprasD.Models.Articulo;
using CarritoComprasD.Services;
using DevExtreme.AspNet.Data.ResponseModel;
using System.Threading.Tasks;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace CarritoComprasD.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ArticulosController : BaseController
    {

        private readonly IArticuloService _articuloService;
        private readonly IMapper _mapper;
  

        public ArticulosController(
            IArticuloService articuloService,
            IMapper mapper)
        {
            _articuloService = articuloService;
            _mapper = mapper;
        }

        [HttpPost]
        public async Task<IActionResult> GetByFilters(ArticuloRequest model)
        {
            var articuloResponse =  await _articuloService.GetByFilters(model);
            return Ok(articuloResponse);
        }

        [HttpGet]
        public ActionResult<int> GetCount()
        {
            var cantidadArticulos = _articuloService.GetCount();
            return Ok(cantidadArticulos);
        }



    }
}
