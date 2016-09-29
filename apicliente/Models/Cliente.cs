using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace apicliente.Models
{
    public class Cliente
    {
        public int codigo { get; set; }
        public string nome { get; set; }
        public string cpf { get; set; }
    }
}