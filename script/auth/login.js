/* 🔑 MINISTOCK | Autenticação de Usuário
   Gerencia o envio de credenciais e armazenamento da sessão.
*/

const loginUrl = `${CONFIG.API_URL}auth/login`;

document.getElementById("loginForm").addEventListener("submit", async function (event) {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const senha = document.getElementById("senha").value;
    const btnLogin = document.getElementById("btnLogin");

    // Feedback visual de carregamento
    btnLogin.innerText = "Conectando...";
    btnLogin.disabled = true;

    try {
        const response = await fetch(loginUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, senha })
        });

        const data = await response.json();

        // Validação de resposta do servidor
        if (!response.ok) {
            alert(data.message || "E-mail ou senha incorretos.");
            btnLogin.innerText = "Entrar no Painel";
            btnLogin.disabled = false;
            return;
        }

        // Persistência do JWT e dados básicos do perfil
        localStorage.setItem("token", data.token);
        localStorage.setItem("nome", data.nome);
        localStorage.setItem("email", data.email);

        alert(`Bem-vindo de volta, ${data.nome}!`);
        window.location.href = "../client/dashboard.html";

    } catch (error) {
        console.error("Erro no login:", error);
        alert("Ops! Falha na conexão com o servidor.");
        
        btnLogin.innerText = "Entrar no Painel";
        btnLogin.disabled = false;
    }
});