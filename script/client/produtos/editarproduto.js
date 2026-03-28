/* 📦 MINISTOCK | Edição de Produtos
   Gerencia a busca de dados, montagem do formulário e atualização via API.
*/

async function iniciarEdicaoProduto(id) {
    let divConteudo = document.getElementById("editar-produto") || document.getElementById("conteudo-dinamico");
    const token = localStorage.getItem("token");

    if (!id) {
        divConteudo.innerHTML = `<div class="alert alert-danger">ID do produto inválido.</div>`;
        return;
    }

    try {
        // 1. Busca dados do produto para preencher os campos
        const response = await fetch(`${CONFIG.BASE_URL}/produtos/${id}`, {
            headers: { "Authorization": `Bearer ${token}` }
        });

        if (!response.ok) throw new Error("Produto não encontrado.");
        const produto = await response.json();

        // 2. Injeta o formulário de edição com os dados atuais
        divConteudo.innerHTML = `
            <div class="ms-auth-card" style="max-width: 800px; margin: 20px auto;">
                <div class="d-flex align-items-center gap-2 mb-4">
                    <i class="bi bi-pencil-square text-accent fs-4"></i>
                    <h3 class="fw-bold m-0">Editar Produto</h3>
                </div>

                <form id="form-edit" class="row g-4">
                    <div class="col-md-7">
                        <label class="ms-label">Nome do Produto</label>
                        <input type="text" id="edit-nome" class="ms-input" value="${produto.nome}" required>
                    </div>
                    
                    <div class="col-md-5">
                        <label class="ms-label">Preço (R$)</label>
                        <input type="number" step="0.01" id="edit-preco" class="ms-input" value="${(produto.precoCentavos / 100).toFixed(2)}" required>
                    </div>

                    <div class="col-md-4">
                        <label class="ms-label">Quantidade</label>
                        <input type="number" id="edit-qtd" class="ms-input" value="${produto.quantidade}" required>
                    </div>

                    <div class="col-md-8">
                        <label class="ms-label">Imagem do Produto</label>
                        <div class="d-flex align-items-center gap-3">
                            <img id="edit-preview" src="${produto.imagemUrl || '../../assets/img/placeholder.png'}" 
                                 style="width: 60px; height: 60px; object-fit: cover; border-radius: 8px; border: 2px solid var(--border);">
                            <div class="flex-grow-1">
                                <input type="file" id="edit-imagem" class="form-control form-control-sm" accept="image/*" onchange="previewImagem(this)">
                            </div>
                        </div>
                    </div>

                    <div class="col-12">
                        <label class="ms-label">Descrição</label>
                        <textarea id="edit-desc" class="ms-input" rows="4">${produto.descricao || ''}</textarea>
                    </div>

                    <div class="col-12 mt-4 d-flex gap-2">
                        <button type="submit" id="btnSalvarEdicao" class="ms-btn ms-btn-primary flex-grow-1">Salvar Alterações</button>
                        <button type="button" class="ms-btn ms-btn-outline" onclick="carregarPagina('produtos')">Cancelar</button>
                    </div>
                </form>
            </div>
        `;

        // 3. Processamento do envio (PUT) usando FormData para suporte a arquivos
        document.getElementById("form-edit").onsubmit = async (e) => {
            e.preventDefault();
            const btn = document.getElementById("btnSalvarEdicao");
            btn.innerText = "Salvando...";
            btn.disabled = true;

            const formData = new FormData();
            formData.append("Nome", document.getElementById("edit-nome").value);
            formData.append("Preco", document.getElementById("edit-preco").value);
            formData.append("Quantidade", document.getElementById("edit-qtd").value);
            formData.append("Descricao", document.getElementById("edit-desc").value);

            const fileInput = document.getElementById("edit-imagem");
            if (fileInput.files[0]) formData.append("Imagem", fileInput.files[0]);

            try {
                const putResponse = await fetch(`${CONFIG.BASE_URL}/produtos/${id}`, {
                    method: 'PUT',
                    headers: { "Authorization": `Bearer ${token}` },
                    body: formData // Content-Type é definido automaticamente pelo navegador
                });

                if (putResponse.ok) {
                    alert("Produto atualizado!");
                    carregarPagina('produtos');
                } else {
                    throw new Error();
                }
            } catch (err) {
                alert("Erro ao salvar alterações.");
                btn.innerText = "Salvar Alterações";
                btn.disabled = false;
            }
        };

    } catch (error) {
        divConteudo.innerHTML = `<div class="alert alert-danger">Erro: ${error.message}</div>`;
    }
}

// Gera o preview instantâneo da imagem selecionada
window.previewImagem = function(input) {
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = (e) => document.getElementById('edit-preview').src = e.target.result;
        reader.readAsDataURL(input.files[0]);
    }
}