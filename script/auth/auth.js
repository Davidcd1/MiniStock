/* 🛡️ MINISTOCK | Auth Guard
   Controla o acesso às páginas baseado na validade do JWT.
*/

const Auth = {
    // Valida o estado de autenticação e redireciona o usuário
    check: function() {
        const token = localStorage.getItem("token");
        const path = window.location.pathname;

        // Define se a página atual é pública (Login, Registro ou Home)
        const isAuthPage = path.includes("login.html") || 
                           path.includes("register.html") || 
                           path.endsWith("/") || 
                           path.endsWith("index.html");

        if (token) {
            if (this.isTokenValid(token)) {
                // Se autenticado, impede acesso às páginas de login/home
                if (isAuthPage) {
                    this.goToDash();
                    return;
                }
            } else {
                // Token expirado: limpa storage e redireciona se tentar acessar área restrita
                localStorage.removeItem("token");
                if (!isAuthPage) this.goToLogin();
            }
        } else {
            // Sem token: bloqueia acesso a qualquer página que não seja pública
            if (!isAuthPage) {
                this.goToLogin();
            }
        }
    },

    // Decodifica o payload do JWT e verifica o timestamp de expiração (exp)
    isTokenValid: function(token) {
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            return payload.exp > (Math.floor(Date.now() / 1000));
        } catch (e) {
            return false;
        }
    },

    // Redireciona para o Dashboard ajustando o caminho conforme a profundidade da pasta
    goToDash: function() {
        const target = window.location.pathname.includes("/pages/") 
            ? "../client/dashboard.html" 
            : "./pages/client/dashboard.html";
        window.location.href = target;
    },

    // Redireciona para o Login ajustando o caminho conforme a profundidade da pasta
    goToLogin: function() {
        const target = window.location.pathname.includes("/pages/") 
            ? "../auth/login.html" 
            : "./pages/auth/login.html";
        window.location.href = target;
    }
};

// Auto-execução ao carregar o script no <head>
Auth.check();