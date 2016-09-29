using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Web;

namespace apicliente.Models
{
    public class EFClienteRepository
    {
        public List<Cliente> Listagem(string vnome)
        {
            DataTable tabela = new DataTable();
            string conexao = ConfigurationManager.AppSettings["ConexaoBD"];
            //"server=SRVDATABASE;database=loja;user=sqladmin;pwd=12345";
            if (vnome.Trim().Length == 0)
            {
                SqlDataAdapter da = new SqlDataAdapter("select * from cliente", conexao);
                da.Fill(tabela);
            }
            else
            {
                SqlDataAdapter da = new SqlDataAdapter("select * from cliente where NOME like @nome", conexao);
                da.SelectCommand.Parameters.Add("@nome", SqlDbType.Text).Value = vnome + "%";
                da.Fill(tabela);
            }

            return tabela.AsEnumerable().Select(r => new Cliente { codigo = (int)r["id_cliente"], nome = r["nome"].ToString(), cpf = r["cpf"].ToString() }).ToList();

        }

        public string inserircliente(Cliente cadcliente)
        {
            SqlConnection cn = new SqlConnection();
            int Codigo = 0;
            try
            {
                cn.ConnectionString = ConfigurationManager.AppSettings["ConexaoBD"];
                //"server=SRVDATABASE;database=loja;user=sqladmin;pwd=12345";
                SqlCommand cmd = new SqlCommand();
                cmd.Connection = cn;
                cmd.CommandText = "insert into Cliente(nome,cpf) values (@nome,@cpf); select @@IDENTITY;";

                cmd.Parameters.AddWithValue("@nome", cadcliente.nome);

                cmd.Parameters.AddWithValue("@cpf", cadcliente.cpf);

                cn.Open();

                Codigo = Convert.ToInt32(cmd.ExecuteScalar());

            }

            catch (SqlException ex)
            {
                return "Servidor SQL Erro:" + ex.Number;
            }

            catch (Exception ex)
            {
                return ex.Message;

            }

            finally
            {

                cn.Close();

            }
            cadcliente.codigo = Codigo;
            return "OK";
        }
    }
}