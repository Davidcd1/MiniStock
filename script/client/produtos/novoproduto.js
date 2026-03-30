/* 🆕 MINISTOCK | Cadastro de Novos Produtos
   Gerencia a captura do formulário, upload de imagem e persistência via API.
*/

function iniciarNovoProduto() {
    const form = document.getElementById("form-novo-produto");
    if (!form) return;

    form.onsubmit = async (event) => {
        event.preventDefault();

        const btn = document.getElementById("btnSalvarNovo");
        const originalText = btn.innerHTML;
        
        // Feedback visual de processamento
        btn.innerHTML = `<span class="spinner-border spinner-border-sm"></span> Criando...`;
        btn.disabled = true;

        // Uso de FormData para suportar o envio da imagem (multipart/form-data)
        const formData = new FormData();
        formData.append("Nome", document.getElementById("nome").value.trim());
        formData.append("Descricao", document.getElementById("descricao").value.trim());
        formData.append("Preco", document.getElementById("preco").value.replace(',', '.'));
        formData.append("Quantidade", document.getElementById("quantidade").value);
        
        const imagemInput = document.getElementById("imagem");
        if (imagemInput.files[0]) {
            formData.append("Imagem", imagemInput.files[0]);
        }

        try {
            const response = await fetch(`${CONFIG.API_URL}produtos`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                },
                body: formData // O navegador define o Boundary automaticamente
            });

            if (response.ok) {
                alert("Produto criado com sucesso!");
                carregarPagina('produtos'); 
            } else {
                const erro = await response.text();
                alert(`Erro: ${erro}`);
                btn.innerHTML = originalText;
                btn.disabled = false;
            }
        } catch (error) {
            console.error("Erro na requisição:", error);
            alert("Erro ao conectar com o servidor.");
            btn.innerHTML = originalText;
            btn.disabled = false;
        }
    };
}