/* 🗑️ MINISTOCK | Exclusão de Produtos
   Gerencia a remoção de itens do estoque com confirmação e atualização da lista.
*/

async function excluirProduto(id, nome) {
    // 1. Confirmação de segurança para evitar cliques acidentais
    if (!confirm(`Deseja realmente excluir o produto: ${nome}?`)) return;

    const token = localStorage.getItem("token");
    const url = `${CONFIG.API_URL}produtos/${id}`;

    try {
        const response = await fetch(url, {
            method: 'DELETE',
            headers: { "Authorization": `Bearer ${token}` }
        });

        if (response.ok) {
            alert("Produto excluído com sucesso!");
            
            // Recarrega a lista de produtos se a função global estiver disponível
            if (typeof carregarProdutos === "function") {
                carregarProdutos();
            }
        } else {
            const erroTexto = await response.text(); 
            alert("Não foi possível excluir: " + erroTexto);
        }
    } catch (error) {
        console.error("Erro ao deletar:", error);
        alert("Erro de conexão com o servidor.");
    }
}

// Expõe a função para o escopo global (usada nos botões do dashboard/tabela)
window.excluirProduto = excluirProduto;