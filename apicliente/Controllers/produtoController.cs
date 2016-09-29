using apicliente.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace apicliente.Controllers
{
    public class produtoController : ApiController
    {
        [HttpGet]
        public List<Produto> retornarProduto()
        {
            var produto = new List<Produto>();




            return produto;
        }

        [HttpGet]
        public List<Produto> listagemproduto(string nome = "")
        {
            var efcproduto = new EFCProdutoRepository();
            return efcproduto.listagem(nome);
        }

        [HttpPost]
        public Retornojson incluirproduto(Produto cadproduto)
        {
            var produto = new EFCProdutoRepository();
            var retorno = produto.inserirproduto(cadproduto);
            if (retorno.Equals("OK"))
                return new Retornojson { valid = retorno + "|" + cadproduto.codigo };
            else
                return new Retornojson { valid = retorno };

        }

    }
}
