/* 📝 MINISTOCK | Registro de Usuário
   Gerencia a criação de novas contas e validação de credenciais.
*/

const registerUrl = `${CONFIG.API_URL}auth/register`;

document.getElementById("registerForm").addEventListener("submit", async function (event) {
    event.preventDefault();

    const nome = document.getElementById("nome").value;
    const email = document.getElementById("email").value;
    const senha = document.getElementById("senha").value;
    const confirmarSenha = document.getElementById("confirmarSenha") ? document.getElementById("confirmarSenha").value : senha;
    const btnRegister = document.getElementById("btnRegister");

    // Validação de segurança básica antes do envio
    if (senha !== confirmarSenha) {
        alert("As senhas não coincidem!");
        return;
    }

    btnRegister.innerText = "Criando conta...";
    btnRegister.disabled = true;

    try {
        const response = await fetch(registerUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nome, email, senha })
        });

        const data = await response.json();

        // Tratamento de erros vindos da API (ex: e-mail duplicado)
        if (!response.ok) {
            alert(data.message || "Erro ao criar conta.");
            btnRegister.innerText = "Finalizar Cadastro";
            btnRegister.disabled = false;
            return;
        }

        alert("Conta criada com sucesso! Faça seu login.");
        window.location.href = "login.html";

    } catch (error) {
        console.error("Erro no registro:", error);
        alert("Ops! Falha na conexão com o servidor.");
        
        btnRegister.innerText = "Finalizar Cadastro";
        btnRegister.disabled = false;
    }
});