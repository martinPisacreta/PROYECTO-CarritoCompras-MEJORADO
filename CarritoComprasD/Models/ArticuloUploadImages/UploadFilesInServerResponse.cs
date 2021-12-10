using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CarritoComprasD.Models.ArticuloUploadImage
{
    public class UploadFilesInServerResponse
    {


        public int ImagenesASubirCantidad { get; set; }
        public int ImagenesBienSubidasCantidad { get; set; }
        public List<string>  ImagenesBienSubidas { get; set; }
        public int ImagenesAtencionCantidad { get; set; }
        public List<string>  ImagenesAtencion { get; set; }
        public int ImagenesErroresCantidad { get; set; }
        public List<string>  ImagenesErrores { get; set; }


    }
}
