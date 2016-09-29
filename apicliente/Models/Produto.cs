using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace apicliente.Models
{
    public class Produto
    {
        public int codigo { get; set; }
        public string nome { get; set; }
        public string descricao { get; set; }
        public float preco_compra { get; set; }
        public float preco_venda { get; set; }
        public bool ativo { get; set; }
        public DateTime data_cadastro { get; set; }
        public float qtde_estoque { get; set; }
    }
}