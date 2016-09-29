using apicliente.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace apicliente.Controllers
{
    public class clienteController : ApiController
    {
        [HttpGet]
        public List<Cliente> retornaclientes()
        {
            var clientes = new List<Cliente>();
            for (var i = 1; i <= 100; i++)
                clientes.Add(new Cliente { codigo = i, nome = "cliente " + i, cpf = "01234567891" + i });
            return clientes;
        }

        [HttpGet]
        public List<Cliente> listagemcliente(string nome="")
        {
            var efclientes = new EFClienteRepository();
            return efclientes.Listagem(nome);
        }

        [HttpPost]
        public Retornojson incluircliente(Cliente cadcliente)
        {
            var efclientes = new EFClienteRepository();
            var retorno = efclientes.inserircliente(cadcliente);
            if (retorno.Equals("OK"))
                return new Retornojson { valid = retorno + "|" + cadcliente.codigo };
            else
                return new Retornojson { valid = retorno};

        }


    }
}
