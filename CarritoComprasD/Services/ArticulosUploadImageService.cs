using AutoMapper;
using CarritoComprasD.Entities;
using CarritoComprasD.Helpers.AppSettings;
using CarritoComprasD.Models.ArticuloUploadImage;
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

    public interface IArticulosUploadImageService
    {

        Task<UploadFilesInServerResponse> UploadFilesInServer(UploadFilesInServerRequest model, long MAX_PHOTO_SIZE, long MIN_PHOTO_SIZE);

    }

    public class ArticulosUploadImageService : IArticulosUploadImageService
    {

        private readonly CarritoComprasWebContext _context;
        private readonly IMapper _mapper;
        private readonly _Upload_Image _appSettings_uploadImage;


        public ArticulosUploadImageService(
            CarritoComprasWebContext context,
            IMapper mapper,
            IOptions<_Upload_Image> appSettings_uploadImage
           )
        {
            _context = context;
            _mapper = mapper;
            _appSettings_uploadImage = appSettings_uploadImage.Value;
        }


        public async  Task<UploadFilesInServerResponse> UploadFilesInServer(UploadFilesInServerRequest model, long MAX_PHOTO_SIZE, long MIN_PHOTO_SIZE)
        {
            try
            {
                List<string> imagenesBienSubidas = new List<string>() { };
                List<string> imagenesAtencion = new List<string>() { };
                List<string> imagenesErrores = new List<string>() { };
                //Articulo_Con_Menos_Atributos articulo_que_modico_path_img_en_pc_local_maxi = null;
                string pathImg = "";
                string extensionImagen = "";
                string nombreImagenSinExtension = "";
                string nombreImagenConExtensionPng = "";

                foreach (var imagenOriginalTipoIFormFile in model.ConjuntoImagenes)
                {

                    if (imagenOriginalTipoIFormFile.Length > 0)
                    {
                        using (var dbContextTransaction = _context.Database.BeginTransaction())
                        {
                            try
                            {
                                extensionImagen = Path.GetExtension(imagenOriginalTipoIFormFile.FileName).Trim();
                                nombreImagenSinExtension = Path.GetFileNameWithoutExtension(imagenOriginalTipoIFormFile.FileName).Trim();
                                nombreImagenConExtensionPng = (nombreImagenSinExtension + _appSettings_uploadImage.Ftp_ExtensionArchivos.Trim());

                                var articulo_db = _context.Articulo.Where(a => a.IdArticulo.ToString() == nombreImagenSinExtension).FirstOrDefault();

                                if (articulo_db == null) //SI NO SE ENCONTRO NINGUN ARTICULO ... 
                                {
                                    imagenesAtencion.Add("Atención : el nombre de la imagen no se relaciona con ningun articulo de la base de datos ----> Imagen: " + imagenOriginalTipoIFormFile.FileName);
                                    continue;
                                }

                                if (articulo_db.PathImg == "" || articulo_db.PathImg == null) //SI PATH_IMG NO TIENE ALGO ESCRITO ...
                                {

                                }
                                else //SI TIENE ALGO ESCRITO
                                {
                                    imagenesAtencion.Add("Atención : la imagen que desea cargar , ya posee una imagen en la base de datos ----> Imagen: " + imagenOriginalTipoIFormFile.FileName);
                                    continue;
                                }


                                using (var imagen_original_en_memoria = new MemoryStream())
                                {
                                    //"imagen_tipo_IFormFile" genera una secuencia cuyo almacenamiento es la memoria.
                                    await imagenOriginalTipoIFormFile.CopyToAsync(imagen_original_en_memoria);

                                    //se crea IMAGEN a partir de imagen en memoria (ORIGINAL)
                                    using (Image imagen_original_tipo_Image = Image.FromStream(imagen_original_en_memoria))
                                    {
                                        //seteo IMAGEN_NUEVA , con la IMAGEN_ORIGINAL
                                        Image imagen_nueva_tipo_Image = imagen_original_tipo_Image;

                                        //si la IMAGEN_NUEVA tiene un ancho o un largo mayor a 250px...
                                        if (imagen_original_tipo_Image.Size.Height > 250 || imagen_original_tipo_Image.Size.Width > 250)
                                        {
                                            //redimensiono a escala de 250x250
                                            imagen_nueva_tipo_Image = ScaleImage(imagen_original_tipo_Image, 250, 250);

                                        }

                                        //seteo IMAGEN_NUEVA_MEMORIA , con la imagen IMAGEN_ORIGINAL_MEMORIA
                                        MemoryStream imagen_nueva_en_memoria = imagen_original_en_memoria;

                                        //si la extension de la imagen es <>  ".png" 
                                        if (extensionImagen != _appSettings_uploadImage.Ftp_ExtensionArchivos)
                                        {
                                            //convierto IMAGEN_NUEVA_MEMORIA -> a PNG
                                            imagen_nueva_tipo_Image.Save(imagen_nueva_en_memoria, ImageFormat.Png);
                                        }


                                        //ANALIZO EL PESO IMAGEN
                                        if (imagen_nueva_en_memoria.Length >= MAX_PHOTO_SIZE)
                                        {
                                            imagenesAtencion.Add("Atención : la imagen es mayor o igual a " + MAX_PHOTO_SIZE / 1024 + "KB ----> Imagen: " + imagenOriginalTipoIFormFile.FileName);
                                            continue;
                                        }
                                        else if (imagen_nueva_en_memoria.Length <= MIN_PHOTO_SIZE)
                                        {
                                            imagenesAtencion.Add("Atención : la imagen debe ser mayor a " + MIN_PHOTO_SIZE + "KB ----> Imagen: " + imagenOriginalTipoIFormFile.FileName);
                                            continue;
                                        }

                                        //YA PASO LAS VALIDACIONES ... Y VIENE ESTA PARTE
                                        pathImg = _appSettings_uploadImage.Path_ImgBD + nombreImagenConExtensionPng;
                                        if(pathImg.Length > 400)
                                        {
                                            throw new Exception("Error : pathImg con mas de 400 caracteres  ----> Imagen: " + imagenOriginalTipoIFormFile.FileName);
                                        }
                                        //PREPARO UPDATE "ARTICULO" DEL SERVIDOR WEB
                                        articulo_db.PathImg = pathImg;
                                        _context.Update(articulo_db);

                                        //SUBO LA IMAGEN AL SERVIDOR
                                        bool bandera_create_imagen = CreateImageFtp(imagen_nueva_en_memoria, nombreImagenConExtensionPng, _appSettings_uploadImage.Ftp_User, _appSettings_uploadImage.Ftp_Pass, _appSettings_uploadImage.Ftp_ServerIP, _appSettings_uploadImage.Ftp_UbicacionImagenesArticulos);
                                        if (bandera_create_imagen == false)
                                        {
                                            throw new Exception("Error : fallo CreateImageFtp  ----> Imagen: " + imagenOriginalTipoIFormFile.FileName);
                                        }

                                        /* NO VOY A PASAR LOS DATOS A LA PC DE MAXI POR EL MOMENTO
                                        //PREPARO "ARTICULO" QUE VOY A MANDAR A LA PC LOCAL PARA QUE SE ACTUALICEN LOS DATOS AHI TAMBIEN
                                        articulo_que_modico_path_img_en_pc_local_maxi = new Articulo_Con_Menos_Atributos();
                                        articulo_que_modico_path_img_en_pc_local_maxi.id_articulo = articulo_db.IdArticulo.ToString();
                                        articulo_que_modico_path_img_en_pc_local_maxi.path_img = path_img;
                                            
                                        //GRABA LOS DATOS DEL "ARTICULO" EN LA BD LOCAL DE MAXI
                                        var json = JsonConvert.SerializeObject(articulo_que_modico_path_img_en_pc_local_maxi);
                                        var data = new StringContent(json, Encoding.UTF8, "application/json");
                                        var url = _configuration["WebApiQueCorreEnPcMaxi"];
                                        using var client = new HttpClient();
                                        var response = await client.PostAsync(url, data);
                                        string result = response.Content.ReadAsStringAsync().Result;
                                        if(result != "1") // "1" EN LA WEB API , SIGNIFICA QUE TODO ESTUVO BIEN
                                        {
                                            throw new Exception(result);
                                        }
                                        */

                                        //AGREGO LA IMAGEN EN LISTA DE imagenes_bien_subidas
                                        imagenesBienSubidas.Add(imagenOriginalTipoIFormFile.FileName);

                                        //GRABO LOS DATOS DE "ARTICULO" EN EL SERVIDOR WEB
                                        await _context.SaveChangesAsync();
                                        dbContextTransaction.Commit();


                                    }
                                }
                            }
                            catch (Exception ex)
                            {
                                //CARGO EL ERROR
                                imagenesErrores.Add("Error : " + ex.Message + " ----> Imagen: " + imagenOriginalTipoIFormFile.FileName);

                                //RETROCEDO LOS CAMBIOS EN EL SERVIDOR WEB
                                dbContextTransaction.Rollback();

                                //BORRO LA IMAGEN EN EL SERVIDOR SI ES QUE EXISTE
                                bool bandera_existe_imagen_en_servidor = CheckIfFileExistsOnServer(nombreImagenConExtensionPng, _appSettings_uploadImage.Ftp_User, _appSettings_uploadImage.Ftp_Pass, _appSettings_uploadImage.Ftp_ServerIP, _appSettings_uploadImage.Ftp_UbicacionImagenesArticulos);
                                if (bandera_existe_imagen_en_servidor == true)
                                {
                                    bool bandera_delete_imagen = DeleteImageFtp(nombreImagenConExtensionPng, _appSettings_uploadImage.Ftp_User, _appSettings_uploadImage.Ftp_Pass, _appSettings_uploadImage.Ftp_ServerIP, _appSettings_uploadImage.Ftp_UbicacionImagenesArticulos);
                                    if (bandera_delete_imagen == false)
                                    {
                                        throw new Exception("Error : fallo DeleteImageFtp  ----> Imagen: " + imagenOriginalTipoIFormFile.FileName);
                                    }
                                }

                                //HAGO UN NEXT AL FOREACH
                                continue;
                            }
                        }
                    }
                    else //articulo.Length es menor o igual a 0
                    {
                        imagenesAtencion.Add("Atención : la imagen debe ser mayor a " + MIN_PHOTO_SIZE + "KB ----> Imagen: " + imagenOriginalTipoIFormFile.FileName);
                        continue;
                    }
                }


                var _response = new
                {
                    imagenes_a_subir_cantidad = model.ConjuntoImagenes.Count,
                    imagenes_bien_subidas_cantidad = imagenesBienSubidas.Count,
                    imagenesBienSubidas,
                    imagenes_atencion_cantidad = imagenesAtencion.Count,
                    imagenesAtencion,
                    imagenes_errores_cantidad = imagenesErrores.Count,
                    imagenesErrores
                };


                var response = _mapper.Map<UploadFilesInServerResponse>(_response);
                return response;
            }
            catch (Exception ex)
            {
                throw ex;
            }

        }

        private bool CheckIfFileExistsOnServer(string nombre_imagen_con_extension_png, string user, string pass, string ftpServerIP, string ftpUbicacionImagenesArticulos)
        {
            FtpWebRequest request = (FtpWebRequest)FtpWebRequest.Create(new Uri("ftp://" + ftpServerIP + ftpUbicacionImagenesArticulos + nombre_imagen_con_extension_png));
            request.Credentials = new NetworkCredential(user, pass);
            request.Method = WebRequestMethods.Ftp.GetFileSize;

            try
            {
                FtpWebResponse response = (FtpWebResponse)request.GetResponse();
                return true;
            }
            catch (WebException ex)
            {
                FtpWebResponse response = (FtpWebResponse)ex.Response;
                if (response.StatusCode == FtpStatusCode.ActionNotTakenFileUnavailable)
                    return false;
            }
            return false;
        }
        public bool DeleteImageFtp(string nombre_imagen_con_extension_png, string user, string pass, string ftpServerIP, string ftpUbicacionImagenesArticulos)
        {
            FtpWebRequest request = (FtpWebRequest)FtpWebRequest.Create(new Uri("ftp://" + ftpServerIP + ftpUbicacionImagenesArticulos + nombre_imagen_con_extension_png));
            request.Method = WebRequestMethods.Ftp.DeleteFile;
            request.Credentials = new NetworkCredential(user, pass);
            try
            {
                FtpWebResponse response = (FtpWebResponse)request.GetResponse();
                return true;
            }
            catch (WebException ex)
            {
                FtpWebResponse response = (FtpWebResponse)ex.Response;
                if (response.StatusCode == FtpStatusCode.ActionNotTakenFileUnavailable)
                    return false;
            }
            return false;
        }

        public bool CreateImageFtp(MemoryStream imagen_nueva_en_memoria, string nombre_imagen_con_extension_png, string user, string pass, string ftpServerIP, string ftpUbicacionImagenesArticulos)
        {

            FtpWebRequest request = (FtpWebRequest)FtpWebRequest.Create(new Uri("ftp://" + ftpServerIP + ftpUbicacionImagenesArticulos + nombre_imagen_con_extension_png));
            request.Credentials = new NetworkCredential(user, pass);
            request.Method = WebRequestMethods.Ftp.UploadFile;

            try
            {
                using (Stream ftpStream = request.GetRequestStream())
                {

                    imagen_nueva_en_memoria.WriteTo(ftpStream);
                    return true;
                }
            }
            catch (WebException ex)
            {
                FtpWebResponse response = (FtpWebResponse)ex.Response;
                if (response.StatusCode == FtpStatusCode.ActionNotTakenFileUnavailable)
                    return false;
            }
            return false;
        }

        public Image ScaleImage(Image image, int maxWidth, int maxHeight)
        {
            var ratioX = (double)maxWidth / image.Width;
            var ratioY = (double)maxHeight / image.Height;
            var ratio = Math.Min(ratioX, ratioY);

            var newWidth = (int)(image.Width * ratio);
            var newHeight = (int)(image.Height * ratio);

            //pongo la imagen horizontal 
            if (Array.IndexOf(image.PropertyIdList, 274) > -1)
            {
                var orientation = (int)image.GetPropertyItem(274).Value[0];
                switch (orientation)
                {
                    case 1:
                        // No rotation required.
                        break;
                    case 2:
                        image.RotateFlip(RotateFlipType.RotateNoneFlipX);
                        break;
                    case 3:
                        image.RotateFlip(RotateFlipType.Rotate180FlipNone);
                        break;
                    case 4:
                        image.RotateFlip(RotateFlipType.Rotate180FlipX);
                        break;
                    case 5:
                        image.RotateFlip(RotateFlipType.Rotate90FlipX);
                        break;
                    case 6:
                        image.RotateFlip(RotateFlipType.Rotate90FlipNone);
                        break;
                    case 7:
                        image.RotateFlip(RotateFlipType.Rotate270FlipX);
                        break;
                    case 8:
                        image.RotateFlip(RotateFlipType.Rotate270FlipNone);
                        break;
                }
                // This EXIF data is now invalid and should be removed.
                image.RemovePropertyItem(274);
            }

            var newImage = new Bitmap(newWidth, newHeight);

            using (var graphics = Graphics.FromImage(newImage))
                graphics.DrawImage(image, 0, 0, newWidth, newHeight);




            return newImage;
        }
    }
}

