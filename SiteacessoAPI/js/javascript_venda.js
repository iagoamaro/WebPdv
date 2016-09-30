$(document).ready(function () {
    carregarNoLoadPagina();
    carregarProdutoSelect();

    $(document).on('click', '[id="Salvar"]', function (e) {
        cadastrarcliente();
        console.log("OK");
    });

    $(document).on('click', '[id=SalvarProd]', function (e) {
        cadastrarproduto();
        console.log("OK");
    });

    $(document).on('blur', 'input', function () {
        ativaupper(this);
    });

    $(document).on('change', '#select_produto', function () {
      

    });

});


function ativaupper(elemento) {
    if (!$(elemento).hasClass('noupper'))
        elemento.value = elemento.value.toUpperCase();
}

function carregarNoLoadPagina() {
    //Carregar lista de clientes
    carregarClientesSelect();
    
}
//Fim carregarNoLoadPagina()-----------------------------------------
function carregarClientesSelect() {
    $(function () {
        //"http://nli.univale.br/apicliente/api/cliente/retornaclientes?tipo=json"
        $.getJSON("http://localhost:3630/api/cliente/listagemcliente", function (j) {
            var options = "<option value=''0''>Selecione um cliente</option>";
            for (var i = 0; i < j.length; i++) {
                options += '<option value="' + j[i].codigo + '">' + j[i].nome + '</option>';
            }
            $("select#select_cliente").html(options);
        });
    });
}

//escutar click botão para iniciar uma venda
$('#btn_iniciar_venda').click(function () {
    if ($("#select_cliente").val() === "") {
        alert("Selecione um cliente antes de iniciar uma venda.");
    } else {
        $('#divCarregando').css({ display: "block" });
        setTimeout('iniciarNovaVenda()', 1000);
        //iniciarNovaVenda();
    }
});




    function selecionarProduto() {
        $.getJSON("http://localhost:3630/api/produto/listagemproduto", function (p) {
            var campo;
            for (var i = 0; i < length; i++) {
                if ($('#select_produto :selected').val() == p.nome) {
                    campo = '<input type="number" class="form-control" id="preco_unitario" value ="' + p.preco_venda + '" disabled="true">';
                   
                }
                $('input#preco_unitario').html(campo);
            }
        
        });
    }
    function carregarProdutoSelect() {
        $(function () {
            //"http://nli.univale.br/apicliente/api/cliente/retornaclientes?tipo=json"
            $.getJSON("http://localhost:3630/api/produto/listagemproduto", function (j) {
                var options = "<option value=''0''>Selecione um cliente</option>";
                for (var i = 0; i < j.length; i++) {
                    options += '<option value="' + j[i].nome + '">' + j[i].nome + '</option>';
                }
                $("select#select_produto").html(options);
            });
        });
    }

    $('#btn_cad_cliente').click(function () {
        abremodalcliente();
    });

    $('#btn_cad_produto').click(function () {
        abremodalproduto();
    });


    function cadastrarcliente() {
        $.ajax({
            type: "POST",
            url: "http://localhost:3630/api/cliente/incluircliente",
            dataType: "json",
            async: false,
            data: {"codigo":0,"nome": $('#txtnomecliente').val(),"cpf": $('#txtcpfcliente').val()},
            success: function (retorno) {
                $('#divCarregandocadcl').css({ display: "none" });
                var respws = retorno.valid.split("|");
                console.log(respws);
                if (respws[0] == "OK") 
                {
                    alert("Cliente cadastrado com sucesso!");
                    $('#modalExemplo').modal('hide');
                }
                else
                {
                    alert("Erro Servidor: " + retorno);
                }
                carregarClientesSelect();
            },
            beforeSend: function () {
                $('#divCarregandocadcl').css({ display: "block" });
            },
            complete: function () {
                $('#divCarregandocadcl').css({ display: "none" });
            }
        });
    }

    function cadastrarproduto() {
        $.ajax({
            type: "POST",
            url: "http://localhost:3630/api/produto/incluirproduto",
            dataType: "json",
            async: false,
            data: {
                "codigo": 0,
                "nome": $('#txtnomeproduto').val(),
                "descricao": "",
                "preco_compra": $('#txtprecocompra').val(),
                "preco_venda": $('#txtprecovenda').val(),
                "ativo": "",
                "data_cadastro": "",
                "qtde_estoque": $('#txtestoque').val()
            },

            success: function (retorno) {
                $('#divCarregandocadcl').css({ display: "none" });
                var respws = retorno.valid.split("|");
                console.log(respws);
                if (respws[0] == "OK") {
                    alert("Produto cadastrado com sucesso!");
                    $('#modalExemplo').modal('hide');
                }
                else {
                    alert("Erro Servidor: " + retorno);
                }
                carregarClientesSelect();
            },
            beforeSend: function () {
                $('#divCarregandocadcl').css({ display: "block" });
            },
            complete: function () {
                $('#divCarregandocadcl').css({ display: "none" });
            }


        });
    }

    function encerrarVenda() {
        //Recuperar dados para finalizar venda
        var id_venda = $("#id_venda_cabecalho").text();
        var id_venda = parseInt(id_venda);
        var qtde_itens_vendidos = $("#contadorSeqItemVenda").val();
        var total_geral_venda = $("#total_geral").text().replace('R$ ', '');
        //Alterar a tabela venda cabeçalho para finalizada    
        $.ajax({
            type: "POST",
            url: "/pdv/updateVendaCabecalho",
            dataType: "html",
            data: { "id_venda_cabecalho": id_venda, "qtde_itens": qtde_itens_vendidos, "valor_total": total_geral_venda, "status_venda": "Finalizada" },
            success: function () {
                alert("Venda finalizada - Total: " + $("#total_geral").text());
                $("table#tabela_cupom").html();
                $("#total_geral").text("");
                $("#btn_iniciar_venda").removeAttr("disabled");
                $("#select_cliente").removeAttr("disabled");
                $("#btn_encerrar_venda").attr("disabled", "disabled");
                $("#status_venda").text("Finalizada");
                $("#div_venda_itens").hide();
                $("#cliente_nome").text("");
                $("#codigo_cliente").text("");
                $("#contadorSeqItemVenda").val(1);
                $("#id_venda_cabecalho").text("");
            }
        });

    }

    function iniciarNovaVenda() {
        $("#btn_iniciar_venda").attr("disabled", "disabled");
        $("#select_cliente").attr("disabled", "disabled");
        $("#btn_encerrar_venda").removeAttr("disabled");
        $("#status_venda").text("Em aberto");
        $("#div_venda_itens").show();
        var cliente_id = $("#select_cliente").val();
        $('#divCarregando').css({ display: "none" });
        //$(function () {
        //    //Busca os dados do cliente selecionado
        //    $.getJSON("/pdv/getCliente/" + cliente_id, function (cliente) {
        //        $("#cliente_nome").text(cliente.nome);
        //        $("#codigo_cliente").text(cliente.id_cliente);

        //        //Adicionar a abertura de uma nova venda no banco
        //        $.ajax({
        //            type: "POST",
        //            url: "/pdv/adicionarVendaCabecalho",
        //            dataType: "html",
        //            data: { "id_cliente": cliente_id, "id_usuario": $("#id_usuario").text(), "status_venda": $("#status_venda").text() },
        //            success: function (retornoIdVendaCab) {
        //                $("#id_venda_cabecalho").text(retornoIdVendaCab);
        //                alert("Aberta uma nova venda de código: " + retornoIdVendaCab + " para o cliente: " + cliente.nome);
        //            }
        //        });
        //    });
        //});
    }

    //Escutar evento perda de foco para mostrar os dados do produto
    $("#codigo_produto").focusout(function () {
        if ($("#codigo_produto").val() !== "" && $("#codigo_produto").val() > 0) {
            buscaProdutoPorId($("#codigo_produto").val());
        } else {
            alert("Valor informar o código do produto válido");
        }
    });

    //Escutar evento perda de foco para calcular o total do item
    $("#qtde_item").focusout(function () {
        if ($("#qtde_item").val() !== "" && $("#qtde_item").val() > 0) {
            var valorTotalitem = parseFloat($("#qtde_item").val()) * parseFloat($("#preco_unitario").val());
            $("#valor_total_item").val(valorTotalitem.toString());
        } else {
            alert("Valor informar a quantidade vendida válida.");
        }
    });

    function buscaProdutoPorId(id_produto) {
        $.getJSON("http://localhost:3630/api/produto/listagemproduto" + id_produto, function (produto) {
            $("#preco_unitario").val(produto.preco_venda);
            $("#nomeProduto").text(produto.nome);
            $("#img_produto").attr("src", produto.imagem_produto);
        });
    }

    //Escuta o evento click para adicionar o item ao cupom
    $("#btnAdicionarItem").click(function () {
        if ($("#qtde_item").val() !== "" && $("#qtde_item").val() > 0 && $("#codigo_produto").val() > 0) {

            var statusItem = "vendido";
            adicionarItemCupom($("#codigo_produto").val(), $("#id_venda_cabecalho").text(), $(contadorSeqItemVenda).val(), $("#nomeProduto").text(), $("#qtde_item").val(), $("#preco_unitario").val(), $("#valor_total_item").val(), statusItem);
        } else {
            alert("Valor informar o código do produto e uma quantidade válida.");
        }
    });


    function adicionarItemCupom(codigo_produto, codigo_venda, seqItemVenda, nome_produto, qtde_item, preco_unitario, valor_total_item, statusItem) {
        var codigo_vend = parseFloat(codigo_venda.replace('"', ''));
        //Adicionar item vendido no banco de dados
        $.ajax({
            type: "POST",
            url: "/pdv/adicionarItemVenda",
            dataType: "html",
            data: { "id_produto": codigo_produto, "id_venda_cabecalho": codigo_vend, "sequencia": seqItemVenda, "nome_produto": nome_produto, "qtde": qtde_item, "valor_unitario": preco_unitario, "sub_total": valor_total_item, "status_item": statusItem },
            success: function (retornoIdItemVenda) {

                //Incrementa e seta + 1 na sequencia de itens
                var seq = parseInt(seqItemVenda) + 1;
                $("#contadorSeqItemVenda").val(seq);

                //Preenchar a tabela com os itens vendidos
                $.getJSON("/pdv/getItensVenda/" + codigo_vend, function (itens) {

                    //Definir cabelha tabela
                    var linhasTabela = '<tr><th>ITEM</th> <th>CÓDIGO</th> <th>DESCRIÇÃO</th> <th>QDTE</th> <th>PREÇO</th> <th>TOTAL</th> <th>STATUS</th><th></th> </tr>';

                    var totalGeralVenda = 0.0; //Armazenar o total geral

                    for (var i = 0; i < itens.length; i++) {
                        linhasTabela += "<tr><th>" + itens[i].sequencia + "</th><th>" + itens[i].id_produto + "</th><th>" + itens[i].nome_produto + "</th><th>" + itens[i].qtde + "</th><th>" + itens[i].valor_unitario + "</th><th>" + itens[i].sub_total + "</th><th>" + itens[i].status_item + "</th><th><button class=''glyphicon glyphicon-remove'' aria-hidden=''true'' onClick=''cancelarItemVenda(" + itens[i].id_itens_venda + "," + itens[i].sequencia + "," + itens[i].id_venda_cabecalho + ")''/></th></tr>";

                        //Calcula o total geral da venda
                        if (itens[i].status_item === "vendido") {
                            totalGeralVenda += parseFloat(itens[i].sub_total);
                        }

                        //Exibir tabela e setar total geral
                        $("table#tabela_cupom").html(linhasTabela);
                        $("#total_geral").text("R$ " + totalGeralVenda.toString());
                    }
                });

                //Limpa os campos 
                $("#codigo_produto").val("");
                $("#qtde_item").val("");
                $("#preco_unitario").val("");
                $("#valor_total_item").val("");
                $("#nomeProduto").text("");
                $("#img_produto").attr("src", "");
            }
        });
    }

    function cancelarItemVenda(id_itens_venda, sequencia, id_venda_cabecalho) {
        $.ajax({
            type: "POST",
            url: "/pdv/updateItemVenda",
            dataType: "html",
            data: { "id_itens_venda": id_itens_venda },
            success: function (retornoIdItemCancelado) {

                //Preenchar a tabela com os itens vendidos
                $.getJSON("/pdv/getItensVenda/" + id_venda_cabecalho, function (itens) {

                    //Definir cabelha tabela
                    linhasTabela = '<tr><th>ITEM</th> <th>CÓDIGO</th> <th>DESCRIÇÃO</th> <th>QDTE</th> <th>PREÇO</th> <th>TOTAL</th> <th>STATUS</th><th></th> </tr>';
                    var totalGeralVenda = 0.0;

                    for (var i = 0; i < itens.length; i++) {
                        linhasTabela += "<tr><th>" + itens[i].sequencia + "</th><th>" + itens[i].id_produto + "</th><th>" + itens[i].nome_produto + "</th><th>" + itens[i].qtde + "</th><th>" + itens[i].valor_unitario + "</th><th>" + itens[i].sub_total + "</th><th>" + itens[i].status_item + "</th><th><button class=''glyphicon glyphicon-remove'' aria-hidden=''true'' onClick=''cancelarItemVenda(" + itens[i].id_itens_venda + "," + itens[i].sequencia + ")''/></th></tr>";
                        //Calcula o total geral da venda
                        if (itens[i].status_item === "vendido") {
                            totalGeralVenda += parseFloat(itens[i].sub_total);
                        }
                    }
                    //Exibir tabela e setar total geral
                    $("table#tabela_cupom").html(linhasTabela);
                    $("#total_geral").text("R$ " + totalGeralVenda.toString());
                });
                alert("O item: " + sequencia + " foi cancelado.");
            }
        });
    }

    function abremodalcliente()
    {
        janelamodal = '<div class="modal-dialog">'+
        '<div class="modal-content">'+
        '<div class="modal-header">'+
        '<button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">Fechar</span><span class="sr-only">Close</span></button>'+
        '<h4 class="modal-title">Acompanhamento Cliente(Editar/Cadastrar)</h4>'+
         '</div>'+
         '<div class="modal-body">' +
         '<form>'+
            '<div class="form-group">'+
               '<label class="control-label" for="txtnomecliente">Nome Cliente</label>' +
               '<input id="txtnomecliente" type="text" placeholder="Nome do cliente" class="form-control input-md" required="required">' +
               '</div>'+
               '<div class="form-group">'+
                 '<label class="control-label" for="txtcpfcliente">CPF Cliente</label>' +
                 '<input id="txtcpfcliente" type="text" placeholder="Cpf do Cliente" class="form-control input-md">'+
               '</div>'+
         '</form>'+
          '</div>'+
          '<div class="modal-footer">'+
          '<button type="button" class="btn btn-primary" id="Salvar">Salvar</button>'+
          '<button type="button" class="btn btn-default" data-dismiss="modal">Fechar</button>'+
          '<div class="centralizar" id="divCarregandocadcl" style="display:none;">'+
          '<img width="32" height="32" src="img/ajax_loader_gray_32.gif">'+
           '</div>'+
           '</div>'
        '</div>'//<!-- /.modal-content -->
        '</div>'//<!-- /.modal-dialog -->
        $("#modalExemplo").html(janelamodal);
        $("#modalExemplo").modal('show');
    }

    function abremodalproduto() {
        janelamodal = '<div class="modal-dialog">' +
        '<div class="modal-content">' +
        '<div class="modal-header">' +
        '<button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">Fechar</span><span class="sr-only">Close</span></button>' +
        '<h4 class="modal-title">Casdastro de Produto</h4>' +
         '</div>' +
         '<div class="modal-body">' +
         '<form>' +
            '<div class="form-group">' +
               '<label class="control-label" for="txtnomeproduto">Nome Produto</label>' +
               '<input id="txtnomeproduto" type="text" placeholder="Nome do produto" class="form-control input-md" required="required">' +
               '</div>' +
               '<div class="form-group">' +
                 '<label class="control-label" for="txtprecocompra">Preço de compra</label>' +
                 '<input id="txtprecocompra" type="text" placeholder="Preço de compra" class="form-control input-md">' +
               '</div>' +
               '<div class="form-group">' +
                 '<label class="control-label" for="txtprecovenda">Preço de venda</label>' +
                 '<input id="txtprecovenda" type="text" placeholder="Preço de venda" class="form-control input-md">' +
               '</div>' +
               '<div class="form-group">' +
                 '<label class="control-label" for="txtestoque">Estoque</label>' +
                 '<input id="txtestoque" type="text" placeholder="Estoque" class="form-control input-md">' +
               '</div>' +
         '</form>' +
          '</div>' +
          '<div class="modal-footer">' +
          '<button type="button" class="btn btn-primary" id="SalvarProd">Salvar</button>' +
          '<button type="button" class="btn btn-default" data-dismiss="modal">Fechar</button>' +
          '<div class="centralizar" id="divCarregandocadcl" style="display:none;">' +
          '<img width="32" height="32" src="img/ajax_loader_gray_32.gif">' +
           '</div>' +
           '</div>'
        '</div>'//<!-- /.modal-content -->
        '</div>'//<!-- /.modal-dialog -->
        $("#modalExemplo").html(janelamodal);
        $("#modalExemplo").modal('show');
    }