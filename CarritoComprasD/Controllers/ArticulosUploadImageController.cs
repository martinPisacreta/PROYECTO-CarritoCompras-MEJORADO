using AutoMapper;
using CarritoComprasD.Entities;
using CarritoComprasD.Models.ArticuloUploadImage;
using CarritoComprasD.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;

using System;
using System.Collections.Generic;
using System.Drawing;
using System.Drawing.Imaging;
using System.IO;
using System.Linq;
using System.Net;
using System.Threading.Tasks;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace CarritoComprasD.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ArticulosUploadImageController : BaseController
    {

     

        private readonly IArticulosUploadImageService _articulosUploadImageService;
        private readonly IMapper _mapper;
        private readonly long MAX_PHOTO_SIZE = 102400; //100KB
        private readonly long MIN_PHOTO_SIZE = 0;

        public ArticulosUploadImageController(
            IArticulosUploadImageService articulosUploadImageService,
            IMapper mapper)
        {
            _articulosUploadImageService = articulosUploadImageService;
            _mapper = mapper;
        }


        [Authorize]
        [HttpPost]
        public async  Task<ActionResult<UploadFilesInServerResponse>> UploadFilesInServer(UploadFilesInServerRequest model)
        {
            var response =  await _articulosUploadImageService.UploadFilesInServer(model, MAX_PHOTO_SIZE, MIN_PHOTO_SIZE);
            return Ok(response);
        }


    }
}
