/* 📋 MINISTOCK | Listagem e Gestão de Produtos
   Gerencia busca, paginação, ordenação e renderização responsiva.
*/

let paginaAtual = 1;
let termoBusca = "";
let ordenarPor = "nome";
let direcao = "ASC";
const LIMITE = 30;

// Atualiza a busca em tempo real e reinicia a paginação
function aoDigitarBusca(event) {
    termoBusca = event.target.value;
    paginaAtual = 1;
    carregarProdutos();
}

// Alterna entre ASC/DESC ou muda a coluna de ordenação
function definirOrdenacao(coluna) {
    if (ordenarPor === coluna) {
        direcao = direcao === "ASC" ? "DESC" : "ASC";
    } else {
        ordenarPor = coluna;
        direcao = "ASC";
    }
    carregarProdutos();
}

// Faz o fetch principal dos produtos com filtros e headers de autenticação
async function carregarProdutos() {
    const container = document.getElementById("lista-produtos");
    if (!container) return;

    try {
        const token = localStorage.getItem("token");
        const url = `${CONFIG.BASE_URL}/produtos?busca=${termoBusca}&pagina=${paginaAtual}&ordenarPor=${ordenarPor}&direcao=${direcao}`;

        const response = await fetch(url, {
            headers: { "Authorization": `Bearer ${token}` }
        });

        if (!response.ok) throw new Error("Erro ao buscar produtos");

        const data = await response.json(); 
        
        // Dispara a atualização de todos os componentes da tela
        renderizarProdutos(data.items); 
        atualizarEstatisticas(data.items.length, data.totalItems);
        renderizarPaginacao(data.totalItems);
        atualizarIconesOrdenacao();

    } catch (error) {
        container.innerHTML = `<tr><td colspan="6" class="text-center py-4 text-danger">${error.message}</td></tr>`;
    }
}

// Gera o HTML da tabela (Desktop) e dos Cards (Mobile) dinamicamente
function renderizarProdutos(produtos) {
    const container = document.getElementById("lista-produtos");
    if (!container) return;

    container.innerHTML = produtos.map(p => {
        const preco = (p.precoCentavos / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2 });
        const badgeEstoque = p.quantidade < 5 ? 'badge-low-stock' : 'badge-ok-stock';
        const img = p.imagemBase64 ? 'data:image/png;base64,' + p.imagemBase64 : 'https://via.placeholder.com/45';

        return `
            <tr class="ms-desktop-row">
                <td class="ps-4"><img src="${img}" class="rounded-3" style="width: 40px; height: 40px; object-fit: cover;"></td>
                <td class="text-main fw-bold">${p.nome}</td>
                <td class="text-sub small">${p.descricao || '---'}</td>
                <td class="text-center text-accent fw-bold">R$ ${preco}</td>
                <td class="text-center"><span class="badge ${badgeEstoque} rounded-pill">${p.quantidade} un</span></td>
                <td class="text-end pe-4">
                    <button class="btn btn-sm text-primary" onclick="iniciarEdicaoProduto('${p.id}')"><i class="bi bi-pencil-square"></i></button>
                    <button class="btn btn-sm text-danger" onclick="excluirProduto('${p.id}', '${p.nome}')"><i class="bi bi-trash3"></i></button>
                </td>
            </tr>

            <tr class="ms-mobile-card-container d-md-none">
                <td style="padding: 0; border: none !important; background: transparent !important;">
                    <div class="ms-mobile-card">
                        <div class="ms-mobile-card-header">
                            <img src="${img}" class="rounded-3 border" style="width: 50px; height: 50px; object-fit: cover;">
                            <div class="flex-grow-1 overflow-hidden">
                                <div class="d-flex justify-content-between">
                                    <span class="text-main fw-bold text-truncate-custom">${p.nome}</span>
                                    <span class="badge ${badgeEstoque} rounded-pill">${p.quantidade} un</span>
                                </div>
                                <div class="text-accent fw-bold">R$ ${preco}</div>
                            </div>
                        </div>
                        <div class="d-flex justify-content-between align-items-center mt-2 border-top pt-2" style="border-color: var(--border) !important;">
                            <span class="text-sub font-monospace" style="font-size: 0.65rem;">ID: ${p.id.substring(0,8)}</span>
                            <div class="d-flex gap-2">
                                <button class="ms-btn-outline px-3 py-1" onclick="iniciarEdicaoProduto('${p.id}')"><i class="bi bi-pencil"></i></button>
                                <button class="ms-btn-outline px-3 py-1 border-danger text-danger" onclick="excluirProduto('${p.id}', '${p.nome}')"><i class="bi bi-trash"></i></button>
                            </div>
                        </div>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

// Atualiza os contadores de itens na interface
function atualizarEstatisticas(mostrando, total) {
    const elMostrando = document.getElementById("count-mostrando");
    const elTotal = document.getElementById("count-total");
    if(elMostrando) elMostrando.innerText = mostrando;
    if(elTotal) elTotal.innerText = total;
}

// Altera visualmente os ícones de seta nas colunas da tabela
function atualizarIconesOrdenacao() {
    document.querySelectorAll('.sortable i').forEach(i => i.className = "bi bi-arrow-down-up ms-1 small text-muted");
    const icon = document.getElementById(`sort-icon-${ordenarPor.includes('preco') ? 'preco' : ordenarPor}`);
    if (icon) {
        icon.className = `bi bi-sort-${direcao === 'ASC' ? 'down' : 'up'} ms-1 small text-accent`;
    }
}

// Controla a exibição dos botões de Próximo/Anterior
function renderizarPaginacao(totalItems) {
    const pagContainer = document.getElementById("paginacao");
    if(!pagContainer) return;
    const totalPaginas = Math.ceil(totalItems / LIMITE);
    
    if (totalPaginas <= 1) {
        pagContainer.innerHTML = "";
        return;
    }

    pagContainer.innerHTML = `
        <button class="btn btn-sm btn-outline-secondary ${paginaAtual === 1 ? 'disabled' : ''}" 
                onclick="mudarPagina(${paginaAtual - 1})"><i class="bi bi-chevron-left"></i></button>
        <div class="align-self-center small text-sub mx-2">
            Página <b class="text-main">${paginaAtual}</b> de ${totalPaginas}
        </div>
        <button class="btn btn-sm btn-outline-secondary ${paginaAtual === totalPaginas ? 'disabled' : ''}" 
                onclick="mudarPagina(${paginaAtual + 1})"><i class="bi bi-chevron-right"></i></button>
    `;
}

function mudarPagina(novaPagina) {
    paginaAtual = novaPagina;
    carregarProdutos();
}