using AutoMapper;
using CarritoComprasD.Entities;
using CarritoComprasD.Models.Articulo;
using CarritoComprasD.Models.Usuario;

namespace CarritoComprasD.Helpers
{
    public class AutoMapperProfile : Profile
    {
        // mappings between model and entity objects
        public AutoMapperProfile()
        {
            CreateMap<Usuario, UsuarioResponse>();

            CreateMap<Usuario, AuthenticateResponse>();

            CreateMap<RegisterRequest, Usuario>();

            CreateMap<CreateUsuarioRequest, Usuario>();

            CreateMap<UpdateUsuarioRequest, Usuario>()
                .ForAllMembers(x => x.Condition(
                    (src, dest, prop) =>
                    {
                        // ignore null & empty string properties
                        if (prop == null) return false;
                        if (prop.GetType() == typeof(string) && string.IsNullOrEmpty((string)prop)) return false;

                        // ignore null role
                        if (x.DestinationMember.Name == "Role" && src.Role == null) return false;

                        return true;
                    }
                ));


          

          

           

        }
    }
}