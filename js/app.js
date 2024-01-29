$(document).ready(function () {
    cardapio.eventos.init();
})

var cardapio = {};

var todosItensArray = [];

var itemExibidosNoMenu=[];

var indiceAtualIamagem = 0;

Object.keys(MENU).forEach(categoria => {
    // Iterar sobre os itens da categoria atual
    MENU[categoria].forEach(item => {
        // Adicionar o item com sua categoria ao novo array
        todosItensArray.push({
            categoria: categoria,
            id: item.id,
            img: item.img,
            name: item.name,
            dsc: item.dsc,
            price: item.price
        });
    });
});

var categoriasAtivas = [];
var MEU_CARRINHO = [];
var MEU_ENDERECO = null;
var categoriasOrganizadas = [['categoria3', 'categoria6', 'categoria8', 'categoria9', 'categoria2', 'categoria5', 'categoria10'],
                            ['categoria18', 'categoria4', 'categoria7', 'categoria14', 'categoria16', 'categoria17', 'categoria15', 'categoria1', 'categoria19'],
                            ['categoria11', 'categoria12', 'categoria13']];
var rotasValidas = ['descartaveis','decoracao','utensilios'];
var VALOR_CARRINHO = 0;
var VALOR_ENTREGA = 0;

var CELULAR_EMPRESA = '5592985615995';

cardapio.eventos = {

    init: () => {
        console.log("Função init está sendo chamada.");
        cardapio.metodos.obterItensCardapio();
        cardapio.metodos.carregarBotaoLigar();
        cardapio.metodos.carregarBotaoReserva();
        
        $("#inputPesquisa").on("keyup", function(event) {
        if (event.key === "Enter") {
            var termoPesquisa = $(this).val();
            cardapio.metodos.obterItensPorPesquisa(termoPesquisa);}
        });
    }
}


cardapio.metodos = {

    // obtem a lista de itens   do cardápio
    obterItensCardapio: (categorias = ['categoria1', 'categoria2', 'categoria3'], vermais = false) => {

        if (!Array.isArray(categorias)) {
            categorias = [categorias];
        }
        
        categoriasAtivas = categorias;

        // Inicializa um array para armazenar todos os itens das categorias selecionadas
        itemExibidosNoMenu = [];
    
        // Itera sobre cada categoria
        categorias.forEach(categoria => {
            // Obtém os itens da categoria atual
            var itensCategoria = MENU[categoria];
    
            // Adiciona os itens ao array geral
            itemExibidosNoMenu = itemExibidosNoMenu.concat(itensCategoria.map(item => ({ ...item, categoria: categoria })));

        });

        console.log("Tamanho total da lista -> ", itemExibidosNoMenu.length);
    
        // Se não for "Ver Mais", limpa o conteúdo
        if (!vermais) {
            $("#itensCardapio").html('');
            $("#btnVerMais").removeClass('hidden');
        }
    
        // Obtém o índice do último item exibido
        var lastIndex = $("#itensCardapio").children().length;
        console.log('Ultimo index exibido -> 2° vez ',lastIndex);
    
        // Itera sobre os itens a partir do índice do último item exibido
        for (var i = lastIndex; i < itemExibidosNoMenu.length && i < lastIndex + 50; i++) {
            let temp = cardapio.templates.item.replace(/\${img}/g, itemExibidosNoMenu[i].img)
                .replace(/\${nome}/g, itemExibidosNoMenu[i].name)
                .replace(/\${preco}/g, itemExibidosNoMenu[i].price.toFixed(2).replace('.', ','))
                .replace(/\${id}/g, itemExibidosNoMenu[i].id)
                .replace(/\${categoria}/g, itemExibidosNoMenu[i].categoria);
    
            // Adiciona os itens ao #itensCardapio
            $("#itensCardapio").append(temp);
        }

        lastIndex = $("#itensCardapio").children().length;
        console.log('Ultimo index exibido -> ',lastIndex);
    
        // Remove a classe 'active' de todos os elementos
        $(".container-menu a").removeClass('active');
    
        // Seta o menu para ativo para cada categoria fornecida
        categorias.forEach(categoria => {
            $("#menu-" + categoria).addClass('active');
        });
    
        // Se for "Ver Mais", oculta o botão após adicionar os itens
        if (lastIndex == itemExibidosNoMenu.length) {
            console.log("Ocultou o botão ver mais ->", lastIndex);
            $("#btnVerMais").addClass('hidden');
        }
    },
    
       
    // clique no botão de ver mais
    verMais: () => {
        // Obtém todas as categorias ativas
        //var categoriasAtivas = $(".container-menu a.active").map(function() {
        //    return this.id.split('menu-')[1];
        //}).get();
    
        console.log("Clicou em Ver Mais para as categorias:", categoriasAtivas);
    
        // Chama a função para obter mais itens
        cardapio.metodos.obterItensCardapio(categoriasAtivas, true);
    
        // Oculta o botão Ver Mais
        //$("#btnVerMais").addClass('hidden');
    },

    handleRouteChange: () => {
        // Obtém a parte da rota após o '&' (hash) na URL
        var route = window.location.hash.slice(2);
        var categorias;
        for (var i = 0; i < rotasValidas.length; i++) {
            if (route==rotasValidas[i]) {
                categorias = categoriasOrganizadas[i];
            }
        }

        if (categorias !== null) {
        

        
        cardapio.metodos.obterItensCardapio(categorias, false);
        
        var cardapioAnchor = document.getElementById('cardapio');

        if (cardapioAnchor) {
            cardapioAnchor.scrollIntoView({ behavior: 'smooth' });
        }
        }
    },

    // Função para obter itens com base na pesquisa
    obterItensPorPesquisa: (pesquisa = '') => {
    // Certifica-se de que a pesquisa seja uma string
    pesquisa = pesquisa.toString().toLowerCase();

    itemExibidosNoMenu = []
    // Filtra os itens com base na pesquisa
    itemExibidosNoMenu = todosItensArray.filter(item =>
        item.name.toLowerCase().includes(pesquisa) || item.categoria.toLowerCase().includes(pesquisa)
    );

    // Limpa o conteúdo antes de adicionar os itens
    $("#itensCardapio").html('');

    // Itera sobre os itens correspondentes à pesquisa
    itemExibidosNoMenu.slice(0, 20).forEach(item => {
        let temp = cardapio.templates.item.replace(/\${img}/g, item.img)
            .replace(/\${nome}/g, item.name)
            .replace(/\${preco}/g, item.price.toFixed(2).replace('.', ','))
            .replace(/\${id}/g, item.id)
            .replace(/\${categoria}/g, item.categoria);

        // Adiciona os itens ao #itensCardapio
        $("#itensCardapio").append(temp);
    });
    },
    
    // Função que será chamada ao pesquisar
    pesquisar: () => {
        var pesquisa = $("#inputPesquisa").val();
        cardapio.metodos.obterItensPorPesquisa(pesquisa);
    },

    mostrarFotodoProdutoAmpliada: (img, nome, id) =>{

        
        indiceAtualIamagem = itemExibidosNoMenu.findIndex(item => item.id === id);

        $(".dropdown-content").hide();
        $("#popup_image_zoom").html('');
        $("#popup_image_zoom").removeClass('hidden');

        let temp = cardapio.templates.itemPopup.replace(/\${img}/g, img)
        .replace(/\${titulo}/g, nome);
        $("#popup_image_zoom").append(temp);
        ajustarTamanhoImagem();
        
        cardapio.metodos.atualizarVisibilidadeBotoes();
    },

    exibirImagemAtual: () => {

        let item = itemExibidosNoMenu[indiceAtualIamagem];

        $("#popupImage").attr("src", item.img);
        $("#popupImageName").text(item.name);
    
    },

    navegarParaAnterior: () => {
        if (indiceAtualIamagem > 0) {
            indiceAtualIamagem--;
            cardapio.metodos.exibirImagemAtual();
            cardapio.metodos.atualizarVisibilidadeBotoes();
            
        }
    },

    navegarParaProxima: () => {
        if (indiceAtualIamagem < itemExibidosNoMenu.length - 1) {
            indiceAtualIamagem++;
            cardapio.metodos.exibirImagemAtual();
            cardapio.metodos.atualizarVisibilidadeBotoes();
            
        }
    },

    atualizarVisibilidadeBotoes: () => {

        $("#prevButton").addClass('hidden');
        $("#nextButton").addClass('hidden');
    
        // Verifica se há uma imagem anterior e exibe o botão "Anterior" se necessário
        if (indiceAtualIamagem > 0) {
            
            $("#prevButton").removeClass('hidden');
        }

        // Verifica se há uma próxima imagem e exibe o botão "Próximo" se necessário
        if (indiceAtualIamagem < itemExibidosNoMenu.length - 1) {
            
            $("#nextButton").removeClass('hidden');
        }
    },

    fecharPopupImagemAmpliada: () => {
        $("#popup_image_zoom").addClass('hidden');
    },


    // diminuir a quantidade do item no cardapio
    diminuirQuantidade: (id) => {

        let qntdAtual = parseInt($("#qntd-" + id).text());

        if (qntdAtual > 0) {
            $("#qntd-" + id).text(qntdAtual - 1)
        }

    },

    // aumentar a quantidade do item no cardapio
    aumentarQuantidade: (id) => {

        let qntdAtual = parseInt($("#qntd-" + id).text());
        $("#qntd-" + id).text(qntdAtual + 1)

    },

    // adicionar ao carrinho o item do cardápio
    adicionarAoCarrinho: (id,categoria) => {

        let qntdAtual = parseInt($("#qntd-" + id).text());

        if (qntdAtual > 0) {

            // obter a categoria ativa
            //var categoria = $(".container-menu a.active").attr('id').split('menu-')[1];
            // obtem a lista de itens
            
            let filtro = MENU[categoria];

            // obtem o item
            let item = $.grep(filtro, (e, i) => { return e.id == id });

            if (item.length > 0) {

                // validar se já existe esse item no carrinho
                let existe = $.grep(MEU_CARRINHO, (elem, index) => { return elem.id == id });

                // caso já exista o item no carrinho, só altera a quantidade
                if (existe.length > 0) {
                    let objIndex = MEU_CARRINHO.findIndex((obj => obj.id == id));
                    MEU_CARRINHO[objIndex].qntd = MEU_CARRINHO[objIndex].qntd + qntdAtual;
                }
                // caso ainda não exista o item no carrinho, adiciona ele 
                else {
                    item[0].qntd = qntdAtual;
                    MEU_CARRINHO.push(item[0])
                }      
                
                cardapio.metodos.mensagem('Item adicionado ao carrinho', 'green')
                $("#qntd-" + id).text(0);

                cardapio.metodos.atualizarBadgeTotal();

            }

        }

    },

    // atualiza o badge de totais dos botões "Meu carrinho"
    atualizarBadgeTotal: () => {

        var total = 0;

        $.each(MEU_CARRINHO, (i, e) => {
            total += e.qntd
        })

        if (total > 0) {
            $(".botao-carrinho").removeClass('hidden');
            $(".container-total-carrinho").removeClass('hidden');
        }
        else {
            $(".botao-carrinho").addClass('hidden')
            $(".container-total-carrinho").addClass('hidden');
        }

        $(".badge-total-carrinho").html(total);

    },

    // abrir a modal de carrinho
    abrirCarrinho: (abrir) => {

        if (abrir) {
            $("#modalCarrinho").removeClass('hidden');
            cardapio.metodos.carregarCarrinho();
        }
        else {
            $("#modalCarrinho").addClass('hidden');
        }

    },

    // altera os texto e exibe os botões das etapas
    carregarEtapa: (etapa) => {

        if (etapa == 1) {
            $("#lblTituloEtapa").text('Seu carrinho:');
            $("#itensCarrinho").removeClass('hidden');
            $("#localEntrega").addClass('hidden');
            $("#resumoCarrinho").addClass('hidden');

            $(".etapa").removeClass('active');
            $(".etapa1").addClass('active');

            $("#btnEtapaPedido").removeClass('hidden');
            $("#btnEtapaEndereco").addClass('hidden');
            $("#btnEtapaResumo").addClass('hidden');
            $("#btnVoltar").addClass('hidden');
        }
        
        if (etapa == 2) {
            $("#lblTituloEtapa").text('Endereço de entrega:');
            $("#itensCarrinho").addClass('hidden');
            $("#localEntrega").removeClass('hidden');
            $("#resumoCarrinho").addClass('hidden');
            $("#btnContinuarComprando").addClass('hidden');

            $(".etapa").removeClass('active');
            $(".etapa1").addClass('active');
            $(".etapa2").addClass('active');
            

            $("#btnEtapaPedido").addClass('hidden');
            $("#btnEtapaEndereco").removeClass('hidden');
            $("#btnEtapaResumo").addClass('hidden');
            $("#btnVoltar").removeClass('hidden');
        }

        if (etapa == 3) {
            $("#lblTituloEtapa").text('Resumo do pedido:');
            $("#itensCarrinho").addClass('hidden');
            $("#localEntrega").addClass('hidden');
            $("#resumoCarrinho").removeClass('hidden');

            $(".etapa").removeClass('active');
            $(".etapa1").addClass('active');
            $(".etapa2").addClass('active');
            $(".etapa3").addClass('active');

            $("#btnEtapaPedido").addClass('hidden');
            $("#btnEtapaEndereco").addClass('hidden');
            $("#btnEtapaResumo").removeClass('hidden');
            $("#btnVoltar").removeClass('hidden');
        }
        

    },

    // botão de voltar etapa
    voltarEtapa: () => {

        let etapa = $(".etapa.active").length;
        cardapio.metodos.carregarEtapa(etapa - 1);

    },

    // carrega a lista de itens do carrinho
    carregarCarrinho: () => {

        cardapio.metodos.carregarEtapa(1);

        if (MEU_CARRINHO.length > 0) {

            $("#itensCarrinho").html('');

            $.each(MEU_CARRINHO, (i, e) => {

                let temp = cardapio.templates.itemCarrinho.replace(/\${img}/g, e.img)
                .replace(/\${nome}/g, e.name)
                .replace(/\${preco}/g, e.price.toFixed(2).replace('.', ','))
                .replace(/\${id}/g, e.id)
                .replace(/\${qntd}/g, e.qntd)

                $("#itensCarrinho").append(temp);

                // último item
                if ((i + 1) == MEU_CARRINHO.length) {
                    cardapio.metodos.carregarValores();
                }

            })

        }
        else {
            $("#itensCarrinho").html('<p class="carrinho-vazio"><i class="fa fa-shopping-bag"></i> Seu carrinho está vazio.</p>');
            cardapio.metodos.carregarValores();
        }

    },

    // diminuir quantidade do item no carrinho
    diminuirQuantidadeCarrinho: (id) => {

        let qntdAtual = parseInt($("#qntd-carrinho-" + id).text());

        if (qntdAtual > 1) {
            $("#qntd-carrinho-" + id).text(qntdAtual - 1);
            cardapio.metodos.atualizarCarrinho(id, qntdAtual - 1);
        }
        else {
            cardapio.metodos.removerItemCarrinho(id)
        }

    },

    // aumentar quantidade do item no carrinho
    aumentarQuantidadeCarrinho: (id) => {

        let qntdAtual = parseInt($("#qntd-carrinho-" + id).text());
        $("#qntd-carrinho-" + id).text(qntdAtual + 1);
        cardapio.metodos.atualizarCarrinho(id, qntdAtual + 1);

    },

    // botão remover item do carrinho
    removerItemCarrinho: (id) => {

        MEU_CARRINHO = $.grep(MEU_CARRINHO, (e, i) => { return e.id != id });
        cardapio.metodos.carregarCarrinho();

        // atualiza o botão carrinho com a quantidade atualizada
        cardapio.metodos.atualizarBadgeTotal();
        
    },

    // atualiza o carrinho com a quantidade atual
    atualizarCarrinho: (id, qntd) => {

        let objIndex = MEU_CARRINHO.findIndex((obj => obj.id == id));
        MEU_CARRINHO[objIndex].qntd = qntd;

        // atualiza o botão carrinho com a quantidade atualizada
        cardapio.metodos.atualizarBadgeTotal();

        // atualiza os valores (R$) totais do carrinho
        cardapio.metodos.carregarValores();

    },

    // carrega os valores de SubTotal, Entrega e Total
    carregarValores: () => {

        VALOR_CARRINHO = 0;

        $("#lblSubTotal").text('R$ 0,00');
        $("#lblValorEntrega").text('+ R$ 0,00');
        $("#lblValorTotal").text('R$ 0,00');

        $.each(MEU_CARRINHO, (i, e) => {

            VALOR_CARRINHO += parseFloat(e.price * e.qntd);

            if ((i + 1) == MEU_CARRINHO.length) {
                $("#lblSubTotal").text(`R$ ${VALOR_CARRINHO.toFixed(2).replace('.', ',')}`);
                $("#lblValorEntrega").text(`+ R$ ${VALOR_ENTREGA.toFixed(2).replace('.', ',')}`);
                $("#lblValorTotal").text(`R$ ${(VALOR_CARRINHO + VALOR_ENTREGA).toFixed(2).replace('.', ',')}`);
            }

        })

    },
    
    // carregar a etapa enderecos
    carregarEndereco: () => {

        if (MEU_CARRINHO.length <= 0) {
            cardapio.metodos.mensagem('Seu carrinho está vazio.')
            return;
        } 

        cardapio.metodos.carregarEtapa(2);

    },

    // API ViaCEP
    buscarCep: () => {

        // cria a variavel com o valor do cep
        var cep = $("#txtCEP").val().trim().replace(/\D/g, '');

        // verifica se o CEP possui valor informado
        if (cep != "") {

            // Expressão regular para validar o CEP
            var validacep = /^[0-9]{8}$/;

            if (validacep.test(cep)) {

                $.getJSON("https://viacep.com.br/ws/" + cep + "/json/?callback=?", function (dados) {

                    if (!("erro" in dados)) {

                        // Atualizar os campos com os valores retornados
                        $("#txtEndereco").val(dados.logradouro);
                        $("#txtBairro").val(dados.bairro);
                        $("#txtCidade").val(dados.localidade);
                        $("#ddlUf").val(dados.uf);
                        $("#txtNumero").focus();

                    }
                    else {
                        cardapio.metodos.mensagem('CEP não encontrado. Preencha as informações manualmente.');
                        $("#txtEndereco").focus();
                    }

                })

            }
            else {
                cardapio.metodos.mensagem('Formato do CEP inválido.');
                $("#txtCEP").focus();
            }

        }
        else {
            cardapio.metodos.mensagem('Informe o CEP, por favor.');
            $("#txtCEP").focus();
        }

    },

    // validação antes de prosseguir para a etapa 3
    resumoPedido: () => {

        let cep = $("#txtCEP").val().trim();
        let endereco = $("#txtEndereco").val().trim();
        let bairro = $("#txtBairro").val().trim();
        let cidade = $("#txtCidade").val().trim();
        let uf = $("#ddlUf").val().trim();
        let numero = $("#txtNumero").val().trim();
        let complemento = $("#txtComplemento").val().trim();
        

        if (cep.length <= 0) {
            cardapio.metodos.mensagem('Informe o CEP, por favor.');
            $("#txtCEP").focus();
            return;
        }

        if (endereco.length <= 0) {
            cardapio.metodos.mensagem('Informe o Endereço, por favor.');
            $("#txtEndereco").focus();
            return;
        }

        if (bairro.length <= 0) {
            cardapio.metodos.mensagem('Informe o Bairro, por favor.');
            $("#txtBairro").focus();
            return;
        }

        if (cidade.length <= 0) {
            cardapio.metodos.mensagem('Informe a Cidade, por favor.');
            $("#txtCidade").focus();
            return;
        }

        if (uf == "-1") {
            cardapio.metodos.mensagem('Informe a UF, por favor.');
            $("#ddlUf").focus();
            return;
        }

        if (numero.length <= 0) {
            cardapio.metodos.mensagem('Informe o Número, por favor.');
            $("#txtNumero").focus();
            return;
        }

        MEU_ENDERECO = {
            cep: cep,
            endereco: endereco,
            bairro: bairro,
            cidade: cidade,
            uf: uf,
            numero: numero,
            complemento: complemento
        }

        cardapio.metodos.carregarEtapa(3);
        cardapio.metodos.carregarResumo();

    },

    // carrega a etapa de Resumo do pedido
    carregarResumo: () => {

        $("#listaItensResumo").html('');

        $.each(MEU_CARRINHO, (i, e) => {

            let temp = cardapio.templates.itemResumo.replace(/\${img}/g, e.img)
                .replace(/\${nome}/g, e.name)
                .replace(/\${preco}/g, e.price.toFixed(2).replace('.', ','))
                .replace(/\${qntd}/g, e.qntd)

            $("#listaItensResumo").append(temp);

        });

        $("#resumoEndereco").html(`${MEU_ENDERECO.endereco}, ${MEU_ENDERECO.numero}, ${MEU_ENDERECO.bairro}`);
        $("#cidadeEndereco").html(`${MEU_ENDERECO.cidade}-${MEU_ENDERECO.uf} / ${MEU_ENDERECO.cep} ${MEU_ENDERECO.complemento}`);

        cardapio.metodos.finalizarPedido();

    },

    // Atualiza o link do botão do WhatsApp
    finalizarPedido: () => {

        if (MEU_CARRINHO.length > 0 && MEU_ENDERECO != null) {

            var texto = 'Olá! Vim pelo catálogo e gostaria de fazer meu pedido:';
            texto += `\n*Itens do pedido:*\n\n\${itens}`;
            texto += '\n*Endereço de entrega:*';
            texto += `\n${MEU_ENDERECO.endereco}, ${MEU_ENDERECO.numero}, ${MEU_ENDERECO.bairro}`;
            texto += `\n${MEU_ENDERECO.cidade}-${MEU_ENDERECO.uf} / ${MEU_ENDERECO.cep} ${MEU_ENDERECO.complemento}`;
            texto += `\n\n*Total (com entrega): R$ ${(VALOR_CARRINHO + VALOR_ENTREGA).toFixed(2).replace('.', ',')}*`;

            var itens = '';

            $.each(MEU_CARRINHO, (i, e) => {

                itens += `*${e.qntd}x* ${e.name} ....... R$ ${e.price.toFixed(2).replace('.', ',')} \n`;

                // último item
                if ((i + 1) == MEU_CARRINHO.length) {

                    texto = texto.replace(/\${itens}/g, itens);

                    // converte a URL
                    let encode = encodeURI(texto);
                    let URL = `https://wa.me/${CELULAR_EMPRESA}?text=${encode}`;

                    $("#btnEtapaResumo").attr('href', URL);

                }

            })

        }

    },

    // carrega o link do botão reserva
    carregarBotaoReserva: () => {

        var texto = 'Olá! gostaria de fazer uma *reserva*';

        let encode = encodeURI(texto);
        let URL = `https://wa.me/${CELULAR_EMPRESA}?text=${encode}`;

        $("#btnReserva").attr('href', URL);

    },

    // carrega o botão de ligar
    carregarBotaoLigar: () => {

        $("#btnLigar").attr('href', `tel:${CELULAR_EMPRESA}`);

    },

    // abre o depoimento
    abrirDepoimento: (depoimento) => {

        $("#depoimento-1").addClass('hidden');
        $("#depoimento-2").addClass('hidden');
        $("#depoimento-3").addClass('hidden');

        $("#btnDepoimento-1").removeClass('active');
        $("#btnDepoimento-2").removeClass('active');
        $("#btnDepoimento-3").removeClass('active');

        $("#depoimento-" + depoimento).removeClass('hidden');
        $("#btnDepoimento-" + depoimento).addClass('active');

    },

    // mensagens
    mensagem: (texto, cor = 'red', tempo = 3500) => {

        let id = Math.floor(Date.now() * Math.random()).toString();

        let msg = `<div id="msg-${id}" class="animated fadeInDown toast ${cor}">${texto}</div>`;

        $("#container-mensagens").append(msg);

        setTimeout(() => {
            $("#msg-" + id).removeClass('fadeInDown');
            $("#msg-" + id).addClass('fadeOutUp');
            setTimeout(() => {
                $("#msg-" + id).remove();
            }, 800);
        }, tempo)

    }

}

// Adiciona um ouvinte de evento para a mudança de hash na URL
window.addEventListener('hashchange', cardapio.metodos.handleRouteChange);

// Atualiza o tamanho da imagem quando a janela é redimensionada
window.addEventListener('resize', ajustarTamanhoImagem);

// Adiciona um ouvinte de evento para a carga inicial da página
window.addEventListener('load', cardapio.metodos.handleRouteChange);

window.addEventListener('load', cardapio.metodos.handleRouteChange);

window.addEventListener('click', function(event) {
    if (event.target === document.getElementById('#popup_image_zoom')) {
        cardapio.metodos.fecharPopupImagemAmpliada();
    }
  });

// >>>>>>>>>>>>>>>>>>>>>>>
function toggleDropdown() {
    $(".dropdown-content").toggle();
}

$(".category").click(function () {
    const category = $(this).data("category");

    // Verificar se a categoria está ativa
    const isActive = $(this).hasClass("active");

    // Remover a classe "active" de todas as categorias
    $(".category").removeClass("active");

    // Ocultar todas as subcategorias
    $(".subcategory").hide();

    // Se a categoria clicada não estava ativa, marcá-la como ativa e exibir suas subcategorias
    if (!isActive) {
        $(this).addClass("active");
        $(`.subcategory[data-parent="${category}"]`).show();
    }
});

function ajustarTamanhoImagem() {
    let popupImage = document.getElementById("popupImage");
    let popupContent = document.getElementById("popup-content-image-zoom");

    // Reinicia as dimensões da imagem
    popupImage.style.width = 'auto';
    popupImage.style.height = 'auto';

    var tamanhoAtual = Math.min(popupContent.offsetWidth, popupContent.offsetHeight);
    var tamanhoLimite = tamanhoAtual * 0.8; // 80% do tamanho atual do pop-up

    // Define as novas dimensões da imagem
    popupImage.style.width = tamanhoLimite + 'px';
    popupImage.style.height = tamanhoLimite + 'px';

    console.log("Altura do pop-up " + popupImage.style.height);
    console.log("Largura da img " + popupImage.style.width);
    console.log("Altura da img " + popupImage.style.height);
}


// Função para obter categorias/subcategorias selecionadas quando o botão "Confirmar" é clicado
function obterCategoriasSelecionadas() {
    const categoriasSelecionadas = [];

    // Percorra os checkboxes e adicione as categorias/subcategorias selecionadas ao array
    $("input[type='checkbox']:checked").each(function () {
        categoriasSelecionadas.push($(this).val());
    });

    // Chame a função obterItensCardapio com as categorias/subcategorias selecionadas
    cardapio.metodos.obterItensCardapio(categoriasSelecionadas, false);

    // Oculte o dropdown após a seleção
    $(".dropdown-content").hide();
}

// Adicione um botão "Confirmar" ao final do dropdown
$(".dropdown-content").append("<button class='m-2 btn btn-white btn-sm mr-3' onclick='obterCategoriasSelecionadas()'>Confirmar</button>");
// >>>>>>>>>>>>>>>>>>>>>>>

cardapio.templates = {

    item: `
        <div class="card-item-content col-12 col-lg-3 col-md-3 col-sm-6 mb-5 animated fadeInUp">
            <div class="card card-item" id="\${id}">
                <div class="img-produto" onclick="cardapio.metodos.mostrarFotodoProdutoAmpliada('\${img}','\${nome}','\${id}')">
                    <img src="\${img}" />
                </div>
                <p class="title-produto text-center mt-4">
                    <b id="\${categoria}">\${nome}</b>
                </p>
                <p class="price-produto text-center">
                    <b>R$ \${preco}</b>
                </p>
                <div class="add-carrinho">
                    <span class="btn-menos" onclick="cardapio.metodos.diminuirQuantidade('\${id}')"><i class="fas fa-minus"></i></span>
                    <span class="add-numero-itens" id="qntd-\${id}">0</span>
                    <span class="btn-mais" onclick="cardapio.metodos.aumentarQuantidade('\${id}')"><i class="fas fa-plus"></i></span>
                    <span class="btn btn-add" onclick="cardapio.metodos.adicionarAoCarrinho('\${id}','\${categoria}')"><i class="fa fa-shopping-bag"></i></span>
                </div>
            </div>
        </div>
    `,

    itemCarrinho: `
        <div class="col-12 item-carrinho">
            <div class="img-produto">
                <img src="\${img}" />
            </div>
            <div class="dados-produto">
                <p class="title-produto"><b>\${nome}</b></p>
                <p class="price-produto"><b>R$ \${preco}</b></p>
            </div>
            <div class="add-carrinho">
                <span class="btn-menos" onclick="cardapio.metodos.diminuirQuantidadeCarrinho('\${id}')"><i class="fas fa-minus"></i></span>
                <span class="add-numero-itens" id="qntd-carrinho-\${id}">\${qntd}</span>
                <span class="btn-mais" onclick="cardapio.metodos.aumentarQuantidadeCarrinho('\${id}')"><i class="fas fa-plus"></i></span>
                <span class="btn btn-remove no-mobile" onclick="cardapio.metodos.removerItemCarrinho('\${id}')"><i class="fa fa-trash"></i></span>
            </div>
        </div>
    `,

    itemResumo: `
        <div class="col-12 item-carrinho resumo">
            <div class="img-produto-resumo">
                <img src="\${img}" />
            </div>
            <div class="dados-produto">
                <p class="title-produto-resumo">
                    <b>\${nome}</b>
                </p>
                <p class="price-produto-resumo">
                    <b>R$ \${preco}</b>
                </p>
            </div>
            <p class="quantidade-produto-resumo">
                x <b>\${qntd}</b>
            </p>
        </div>
    `,

    itemPopup:`
        <button class="pagination-button pagination-button-lft" id="prevButton" onclick="cardapio.metodos.navegarParaAnterior()">&lt;</button>
            <div class="popup-content-image-zoom" id="popup-content-image-zoom" onclick="event.stopPropagation()">
                <span class="closePopupInsideBtn" id="closePopupInsideBtn" onclick="cardapio.metodos.fecharPopupImagemAmpliada()">&times;</span>
                <p id="popupImageName">\${titulo}</p>
                <img id="popupImage" src="\${img}" alt="\${titulo}">         
            </div>
        <button class="pagination-button pagination-button-rght" id="nextButton" onclick="cardapio.metodos.navegarParaProxima()">&gt;</button>
    `

}
