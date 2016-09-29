using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Linq;

namespace apicliente.Models
{
    public class EFCProdutoRepository
    {

        public List<Produto> listagem(string vnome)
        {
            DataTable tabela = new DataTable();
            string conexao = ConfigurationManager.AppSettings["ConexaoBD"];
            if (vnome.Trim().Length == 0)
            {
                SqlDataAdapter da = new SqlDataAdapter("select * from produto", conexao);
                da.Fill(tabela);
            }
            else
            {
                SqlDataAdapter da = new SqlDataAdapter("select * from produto where NOME like @nome", conexao);
                da.SelectCommand.Parameters.Add("@nome", SqlDbType.Text).Value = vnome + "%";
                da.Fill(tabela);
            }

            return tabela.AsEnumerable().Select(r => new Produto { codigo = (int)r["id_produto"], nome = r["nome"].ToString(), preco_venda = float.Parse(r["preco_venda"].ToString()) }).ToList();

       
        }

        public string inserirproduto(Produto cadproduto)
        {
            SqlConnection cn = new SqlConnection();
            int Codigo = 0;
            try
            {
                cn.ConnectionString = ConfigurationManager.AppSettings["ConexaoBD"];
                //"server=SRVDATABASE;database=loja;user=sqladmin;pwd=12345";
                SqlCommand cmd = new SqlCommand();
                cmd.Connection = cn;
                cmd.CommandText = "insert into produto(nome,preco_venda,preco_compra,qtde_estoque) values (@nome,@preco_venda,@preco_compra,@qtde_estoque); select @@IDENTITY;";

                cmd.Parameters.AddWithValue("@nome", cadproduto.nome);

                cmd.Parameters.AddWithValue("@preco_venda", cadproduto.preco_venda);

                cmd.Parameters.AddWithValue("@preco_compra", cadproduto.preco_compra);

                cmd.Parameters.AddWithValue("@qtde_estoque", cadproduto.qtde_estoque);


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
            cadproduto.codigo = Codigo;
            return "OK";
        }
    }
}