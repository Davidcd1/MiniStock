# 📦 MiniStock — Sistema de Gestão de Inventário

O **MiniStock** é uma solução de gerenciamento de estoque desenvolvida com foco em alta performance e interface responsiva. O projeto utiliza uma arquitetura **SPA (Single Page Application)** com comunicação assíncrona para garantir uma experiência de usuário fluida e sem recarregamentos de página.

---

## 🚀 Estado Atual do Projeto

O sistema encontra-se em estágio **MVP (Minimum Viable Product)** funcional, com os seguintes módulos operacionais:

* **Core de Autenticação:** Fluxo completo de login e registro integrado via JWT.
* **Gestão de Produtos (CRUD):** Persistência completa de dados com suporte a upload de imagens e tratamento de preços em centavos (inteiros) para precisão matemática.
* **Engine de Busca & Filtros:** Lógica de filtragem, ordenação e paginação processada diretamente no banco de dados através de **Stored Procedures**.
* **Interface Híbrida:** Design System próprio que alterna automaticamente entre visualização em tabelas (Desktop) e cards interativos (Mobile).
* **Gerenciamento de Estado:** Persistência de preferências de tema (Dark/Light Mode) e tokens de sessão via LocalStorage.

---

## 🛠️ Especificações Técnicas

* **Frontend:** JavaScript Vanilla (ES6+), HTML5 e CSS3.
* **Backend & DB:** API em C# Integração com **PostgreSQL** utilizando lógica de negócio em **PL/pgSQL** para reduzir a latência e aumentar a segurança das transações.

---

## 📱 Responsividade Nativa

O projeto foi construído sob a filosofia **Mobile-First**. No desktop, prioriza a densidade de informação; em dispositivos móveis, o layout é reestruturado em componentes de fácil leitura e interação por toque, garantindo 100% de acessibilidade em qualquer tela.

---

## 👨‍💻 Autor
**David Carvalho**
