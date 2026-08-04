# Todo App Mobile

Aplicativo desenvolvido em React Native utilizando Expo para gerenciamento de tarefas.

O aplicativo consome uma API desenvolvida em Django REST Framework utilizando autenticação JWT.

---

# Tecnologias utilizadas

- React Native
- Expo
- Expo Router
- Axios
- Expo Secure Store
- TypeScript

---

# Funcionalidades

- Cadastro de usuários
- Login
- Logout
- Recuperação de senha
- Redefinição de senha
- Persistência segura do token
- Listagem de tarefas
- Criação de tarefas
- Edição de tarefas
- Exclusão de tarefas
- Marcação como concluída
- Busca por título
- Busca por descrição
- Filtro por status
- Filtro por data
- Indicadores de carregamento
- Mensagens de erro amigáveis

---

# Pré-requisitos

- Node.js
- npm
- Expo CLI
- Android Studio ou dispositivo físico
- Backend em execução

---

# Instalação

Clone o repositório.

```bash
git clone <URL_DO_REPOSITORIO>
```

Entre na pasta.

```bash
cd todo-mobile
```

Instale as dependências.

```bash
npm install
```

---

# Executando

```bash
npx expo start
```

Depois:

- pressione **A** para abrir o Android;
- ou utilize o Expo Go em um dispositivo físico.

---

# Comunicação com a API

O aplicativo utiliza Axios para consumir a API REST.

A autenticação é realizada utilizando JWT.

Os tokens são armazenados utilizando Expo Secure Store.

---

# Estrutura

```
src/
 ├── app/
 ├── services/
 ├── components/
 ├── hooks/
 └── constants/
```

---

# Dependências principais

- expo-router
- axios
- expo-secure-store

---

# Observações

O aplicativo foi desenvolvido utilizando Expo Router para navegação entre telas e Expo Secure Store para armazenamento seguro do token JWT.