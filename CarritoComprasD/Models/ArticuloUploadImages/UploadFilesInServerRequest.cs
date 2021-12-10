using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CarritoComprasD.Models.ArticuloUploadImage
{
    public class UploadFilesInServerRequest
    {

        public List<IFormFile> conjuntoImagenes { get; set; }


    }
}
