/* 🌓 MINISTOCK | Gerenciador de Temas
   Controla a alternância entre Dark e Light mode e persiste a escolha no navegador.
*/

const btn = document.getElementById('theme-toggle');
const body = document.body;

// Verifica e aplica a preferência salva no LocalStorage ao carregar a página
if (localStorage.getItem('theme') === 'dark') {
    body.classList.add('dark-mode');
    if (btn) btn.innerHTML = '☀️';
} else {
    if (btn) btn.innerHTML = '🌙';
}

// Lógica de troca de tema e atualização do ícone/storage
if (btn) {
    btn.addEventListener('click', () => {
        body.classList.toggle('dark-mode');
        
        const isDark = body.classList.contains('dark-mode');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        btn.innerHTML = isDark ? '☀️' : '🌙';
    });
}