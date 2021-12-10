using System;
using System.Collections.Generic;

// Code scaffolded by EF Core assumes nullable reference types (NRTs) are not used or disabled.
// If you have enabled NRTs for your project, then un-comment the following line:
// #nullable disable

namespace CarritoComprasD.Entities
{
    public partial class Empresa
    {
        public Empresa()
        {
            UsuarioPedido = new HashSet<UsuarioPedido>();
        }

        public int IdEmpresa { get; set; }
        public string RazonSocial { get; set; }
        public string NombreFantasia { get; set; }
        public string Cuit { get; set; }
        public string Telefono { get; set; }
        public string Celular { get; set; }
        public string Email { get; set; }
        public string Direccion { get; set; }
        public int IdCondicionAnteIva { get; set; }
        public DateTime? FechaInicioActividad { get; set; }

        public virtual ICollection<UsuarioPedido> UsuarioPedido { get; set; }
    }
}
