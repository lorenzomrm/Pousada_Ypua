// Script relacionado ao módulo de clientes

// Array principal armazenado no navegador
if (localStorage.getItem('listaclientes') == null) {
    listaclientes = [];
    localStorage.setItem('listaclientes', JSON.stringify(listaclientes));
} else {
    listaclientes = JSON.parse(localStorage.getItem('listaclientes'));
}

// Aguarda o carregamento do HTML para ser executado
document.addEventListener('DOMContentLoaded', function () {

    // Chamadas
    listar();

    // Salva cadastro e edição
    document.querySelector('#bt-salvar').addEventListener('click', function () {
        // Pega os dados dos campos do formulário
        let id = document.querySelector('#campo-id').value;
        let nomeCompleto = document.querySelector('#campo-nome-completo').value;    
        let dataNascimento = document.querySelector('#campo-data-nascimento').value;
        let documento = document.querySelector('#campo-documento').value;
        let pais = document.querySelector('#campo-pais').value;
        let estado = document.querySelector('#campo-estado').value;
        let cidade = document.querySelector('#campo-cidade').value;
        let fidelidade = document.querySelector('#campo-fidelidade').checked;
        let observacao = document.querySelector('#campo-obs').value;

        // Validações de campos
        if (nomeCompleto == "") {
            alert("Nome completo é um campo obrigatório!");
            return;
        } else if (dataNascimento == "") {
            alert("Data de nascimento é um campo obrigatório!");
            return;
        } else if (documento == "") {
            alert("Documento é um campo obrigatório!");
            return;
        }

        // Cria objeto
        let cliente = {
            id: (id != "") ? id : getMaiorIdLista() + 1,
            nomeCompleto: nomeCompleto,
            dataNascimento: formatarDataParaBR(dataNascimento),
            documento: documento,
            pais: pais,
            estado: estado,
            cidade: cidade,
            fidelidade: fidelidade,
            observacao: observacao
        };

        // Altera ou insere uma posição no array principal
        if (id != "") {
            let indice = getIndiceListaPorId(id);
            listaclientes[indice] = cliente;
        } else {
            listaclientes.push(cliente);
        }

        // Armazena a lista atualizada no navegador
        localStorage.setItem('listaclientes', JSON.stringify(listaclientes));

        // Reseta o formulário e recarrega a tabela de listagem
        this.blur();
        resetarForm();

        // Recarrega listagem
        carregar("Salvo com sucesso!");
        listar();
    });

    // Cancelamento de edição
    document.querySelector('#bt-cancelar').addEventListener('click', function () {
        resetarForm();
    }); 

});

// Funções

function listar(lista = listaclientes) {
    document.querySelector('table tbody').innerHTML = "";
    document.querySelector('#total-registros').textContent = lista.length;

    lista.forEach(function (objeto) {
        let htmlAcoes = `
            <button class="bt-tabela bt-editar" title="Editar"><i class="ph ph-pencil"></i></button>
            <button class="bt-tabela bt-excluir" title="Excluir"><i class="ph ph-trash"></i></button>
            <button class="bt-tabela bt-visualizar" title="Visualizar Perfil"><i class="ph ph-eye"></i></button>
        `;

        let tr = `
            <tr>
                <td>${objeto.id}</td>
                <td>${objeto.nomeCompleto}</td>
                <td>${objeto.dataNascimento}</td>
                <td>${objeto.documento}</td>
                <td>${objeto.pais}</td>
                <td>${objeto.estado}</td>
                <td>${objeto.cidade}</td>
                <td>${objeto.fidelidade ? "Sim" : "Não"}</td>
                <td>${objeto.observacao}</td>
                <td>${htmlAcoes}</td>
            </tr>
        `;
        document.querySelector('table tbody').innerHTML += tr;
    });

     // Vincula eventos de clique para os botões "Editar" e "Excluir" e "Visualisar"
     document.querySelectorAll('.bt-editar').forEach(function (botao, index) {
        botao.addEventListener('click', function () {
            editar(listaclientes[index]);
        });
    });

    document.querySelectorAll('.bt-excluir').forEach(function (botao, index) {
        botao.addEventListener('click', function () {
            excluir(listaclientes[index].id);
        });
    });
    document.querySelectorAll('.bt-visualizar').forEach((botao, index) => {
        botao.addEventListener('click', function () {
            visualizar(lista[index]);
        });
    });
}

function editar(cliente) {
    document.querySelector('#campo-id').value = cliente.id;
    document.querySelector('#campo-nome-completo').value = cliente.nomeCompleto;
    document.querySelector('#campo-data-nascimento').value = formatarDataParaEN(cliente.dataNascimento);
    document.querySelector('#campo-documento').value = cliente.documento;
    document.querySelector('#campo-pais').value = cliente.pais;
    document.querySelector('#campo-estado').value = cliente.estado;
    document.querySelector('#campo-cidade').value = cliente.cidade;
    document.querySelector('#campo-fidelidade').checked = cliente.fidelidade;
    document.querySelector('#campo-obs').value = cliente.observacao;
}

function excluir(id) {
    if (confirm("Deseja realmente excluir este cliente?")) {
        let indice = getIndiceListaPorId(id);
        listaclientes.splice(indice, 1);
        localStorage.setItem('listaclientes', JSON.stringify(listaclientes));
        carregar("Excluído com sucesso!");
        listar();
    }
}

function resetarForm() {
    document.querySelector('#campo-id').value = "";
    document.querySelector('#campo-nome-completo').value = "";
    document.querySelector('#campo-data-nascimento').value = "";
    document.querySelector('#campo-documento').value = "";
    document.querySelector('#campo-pais').value = "";
    document.querySelector('#campo-estado').value = "";
    document.querySelector('#campo-cidade').value = "";
    document.querySelector('#campo-fidelidade').checked = false;
    document.querySelector('#campo-obs').value = "";
}

document.addEventListener('DOMContentLoaded', function () {
    // Listagem inicial
    listar();

    // Evento para o botão de pesquisa
    document.querySelector('#bt-pesquisar').addEventListener('click', function () {
        let termo = document.querySelector('#pesquisa-geral').value.toLowerCase();

        // Filtra a lista com base no termo de pesquisa
        let listaFiltrada = listaclientes.filter(cliente =>
            cliente.nomeCompleto.toLowerCase().includes(termo) ||
            cliente.documento.toLowerCase().includes(termo) ||
            (cliente.email && cliente.email.toLowerCase().includes(termo))
        );

        listar(listaFiltrada);
    })
        // Evento para limpar o filtro e restaurar a listagem completa
        document.querySelector('#bt-limpar-filtro').addEventListener('click', function () {
            document.querySelector('#pesquisa-geral').value = ""; // Limpa o campo de pesquisa
            listar(); // Restaura a listagem original
        });
    });

    function visualizar(cliente) {
        if (!cliente) {
            console.error("Cliente inválido!");
            return;
        }
    
        // Preenche os dados do cliente no modal
        document.querySelector('#detalhe-nome').textContent = cliente.nomeCompleto;
        document.querySelector('#detalhe-nascimento').textContent = cliente.dataNascimento;
        document.querySelector('#detalhe-documento').textContent = cliente.documento;
        document.querySelector('#detalhe-pais').textContent = cliente.pais;
        document.querySelector('#detalhe-estado').textContent = cliente.estado;
        document.querySelector('#detalhe-cidade').textContent = cliente.cidade;
        document.querySelector('#detalhe-fidelidade').textContent = cliente.fidelidade ? "Sim" : "Não";
        document.querySelector('#detalhe-obs').textContent = cliente.observacao;
    
        // Exibe uma foto (se não houver, usa a padrão)
        let foto = cliente.foto || '/assets/imagens/default-photo.png';
        document.querySelector('#foto-cliente').src = foto;
    
        // Histórico de Reservas
        let historico = cliente.reservas || ["Sem histórico de reservas"];
        document.querySelector('#historico-reservas').innerHTML = historico
            .map(reserva => `<li>${reserva}</li>`)
            .join("");
    
        // Exibe o modal
        document.querySelector('#modal-detalhes').style.display = 'block';
    }
    document.addEventListener('DOMContentLoaded', function () {
        // Fecha o modal
        document.querySelector('#close-modal').addEventListener('click', function () {
            document.querySelector('#modal-detalhes').style.display = 'none';
        });
    
        // Fecha o modal clicando fora do conteúdo
        window.addEventListener('click', function (event) {
            let modal = document.querySelector('#modal-detalhes');
            if (event.target == modal) {
                modal.style.display = 'none';
            }
        });
    });

    document.addEventListener('DOMContentLoaded', function () {
        const alterarFotoBtn = document.querySelector('#alterar-foto');
        const inputFoto = document.querySelector('#input-foto');
        const fotoCliente = document.querySelector('#foto-cliente');
    
        // Quando o botão "Alterar Foto" é clicado, ativa o input de arquivo
        alterarFotoBtn.addEventListener('click', () => {
            inputFoto.click();
        });
    
        // Quando uma nova foto é selecionada
        inputFoto.addEventListener('change', function () {
            const file = this.files[0];
    
            if (file) {
                const reader = new FileReader();
    
                reader.onload = function (e) {
                    // Atualiza a imagem no modal
                    fotoCliente.src = e.target.result;
    
                    // Atualiza a imagem no cliente armazenado
                    const clienteId = document.querySelector('#detalhe-documento').textContent;
                    const clienteIndex = listaclientes.findIndex(cliente => cliente.documento === clienteId);
                    if (clienteIndex !== -1) {
                        listaclientes[clienteIndex].foto = e.target.result;
                        localStorage.setItem('listaclientes', JSON.stringify(listaclientes));
                        alert('Foto atualizada com sucesso!');
                    }
                };
    
                reader.readAsDataURL(file);
            }
        });
    });
    
        


function getIndiceListaPorId(id) {
    return listaclientes.findIndex(cliente => cliente.id == id);
}

function getMaiorIdLista() {
    return listaclientes.length > 0 ? Math.max(...listaclientes.map(cliente => cliente.id)) : 0;
}

function carregar(mensagem) {
    alert(mensagem);
}

function formatarDataParaBR(dataEN) {
    let data = new Date(dataEN);
    let dia = String(data.getDate()).padStart(2, '0');
    let mes = String(data.getMonth() + 1).padStart(2, '0');
    let ano = data.getFullYear();
    return `${dia}/${mes}/${ano}`;
}

function formatarDataParaEN(dataBR) {
    let partes = dataBR.split('/');
    return `${partes[2]}-${partes[1]}-${partes[0]}`;
}