# Registro de Desenvolvimento

## Objetivo

Desenvolver uma aplicação de gerenciamento de tarefas utilizando Django REST Framework no backend e React Native (Expo) no frontend.

---

# Etapa 1

Foi criada a estrutura inicial do projeto Django.

Foram instalados:

- Django
- Django REST Framework
- Simple JWT
- django-filter
- drf-spectacular
- django-cors-headers

Também foram criados os aplicativos:

- users
- tasks

---

# Etapa 2

Foi implementado o cadastro de usuários.

Também foi configurada a autenticação utilizando JWT.

Nesta etapa foram criados os endpoints de:

- Cadastro
- Login
- Refresh Token

---

# Etapa 3

Foi criado o modelo de tarefas.

Cada tarefa pertence a um único usuário.

Também foi implementado o isolamento dos dados para garantir que cada usuário visualize apenas suas próprias tarefas.

---

# Etapa 4

Foi desenvolvido o CRUD completo de tarefas.

Funcionalidades implementadas:

- Criar
- Editar
- Excluir
- Listar
- Marcar como concluída

---

# Etapa 5

Foram implementados filtros por:

- Status
- Data de criação

Também foi adicionada busca por título e descrição no aplicativo.

---

# Etapa 6

Foi implementada a recuperação de senha.

Foi utilizado o sistema de tokens do próprio Django.

Durante o desenvolvimento o envio de e-mails foi realizado utilizando o backend de console.

---

# Etapa 7

Foi desenvolvido o aplicativo React Native utilizando Expo.

Foram implementadas as telas de:

- Login
- Cadastro
- Recuperação de senha
- Redefinição de senha
- Lista de tarefas
- Lixeira

---

# Etapa 8

Foi implementado armazenamento seguro dos tokens JWT utilizando Expo Secure Store.

---

# Etapa 9

Foram desenvolvidos testes automatizados para o backend contemplando autenticação, recuperação de senha, permissões, validações e tarefas.

---

# Decisões tomadas

- Utilização de JWT para autenticação.
- Expo Secure Store para armazenamento seguro dos tokens.
- Soft Delete para a lixeira.
- ViewSets para reduzir repetição de código.
- Separação entre serializers, permissões, filtros e views.

---

# Utilização de Inteligência Artificial

Durante o desenvolvimento foram utilizadas ferramentas de Inteligência Artificial como apoio técnico.

As sugestões recebidas foram analisadas, adaptadas e testadas antes de serem incorporadas ao projeto.

Nenhum trecho foi utilizado sem validação manual.

Todos os testes foram executados após cada funcionalidade implementada para garantir o funcionamento correto.