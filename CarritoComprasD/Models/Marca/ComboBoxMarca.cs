using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using CarritoComprasD.Entities;

namespace CarritoComprasD.Models.Marca
{
    public class ComboBoxMarca
    {
        public ComboBoxMarca()
        {
            this.List_IdTablaMarca = new List<int>();
        }

        public string DescripcionMarca { get; set; } //POR EJEMPLO "IMPORTADO ALSINA"
        public List<int> List_IdTablaMarca { get; set; } //SI LA MARCA ES "IMPORTADO ALSINA" , LAS MARCAS ASOCIADAS SON TODAS LOS IdTablaMarca QUE TENGAN "PATH_IMG = IMPORTADO ALSINA"

    }

   



}