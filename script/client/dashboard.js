/* 🚀 MINISTOCK | Dashboard & Router
   Gerencia a navegação entre páginas (SPA) e a inicialização de módulos dinâmicos.
*/

// Proteção de rota básica (complementa o Auth Guard)
const token = localStorage.getItem("token");
if (!token) window.location.href = "../auth/login.html";

const navButtons = document.querySelectorAll(".nav-btn");
const container = document.getElementById("conteudo-dinamico");

// Mapeamento de arquivos físicos para nomes de rotas
const pages = {
    "visao-geral": "../client/visaogeral.html",
    "produtos": "../client/produtos/exibirprodutos.html",
    "novo-produto": "../client/produtos/novoproduto.html",
    "editar-produto": "../client/produtos/editarproduto.html"
};

// Carrega o HTML de forma assíncrona e dispara as funções de cada módulo
async function carregarPagina(page) {
    container.innerHTML = '<div class="text-center mt-5"><div class="spinner-border text-primary"></div></div>';

    if (!pages[page]) return;

    try {
        const response = await fetch(pages[page]);
        const html = await response.text();
        container.innerHTML = html;

        // Delay para garantir que o DOM injetado seja processado antes de rodar os scripts específicos
        setTimeout(() => {
            if (page === "visao-geral") {
                const nome = localStorage.getItem("nome") || "Usuário";
                const el = document.getElementById("dash-user-name");
                if (el) el.innerText = nome;
            }

            // Inicializa os scripts de cada página se as funções existirem no escopo global
            if (page === "produtos" && typeof carregarProdutos === "function") carregarProdutos();
            if (page === "novo-produto" && typeof iniciarNovoProduto === "function") iniciarNovoProduto();
            
            if (page === "editar-produto" && typeof iniciarEdicaoProduto === "function") {
                const id = sessionStorage.getItem("edit_produto_id");
                iniciarEdicaoProduto(id); 
            }
        }, 150);

    } catch (error) {
        container.innerHTML = `<div class="alert alert-danger">Erro ao carregar página: ${error.message}</div>`;
    }
}

// Configura os eventos de clique nos itens da Sidebar
navButtons.forEach(botao => {
    botao.addEventListener("click", () => {
        navButtons.forEach(b => b.classList.remove("active"));
        botao.classList.add("active");
        carregarPagina(botao.dataset.page);
    });
});

// Atalho global para troca de rota de edição (usado pela tabela de produtos)
window.pgeditarproduto = function(id) {
    sessionStorage.setItem("edit_produto_id", id);
    carregarPagina("editar-produto");
}

// Carregamento inicial da Dashboard
carregarPagina("visao-geral");