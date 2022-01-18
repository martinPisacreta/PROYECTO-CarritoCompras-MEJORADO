using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using CarritoComprasD.Entities;

namespace CarritoComprasD.Models.CombosBox
{
    public class ComboBox
    {

        public string Label { get; set; } //hace referencia al texto del campo "Campo" , por ejemplo podria ser "DIPRA"
        public string Campo { get; set; } //campo al que hace referencia "Label" , por ejemplo "pathImg"


    }



}