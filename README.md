📚 Plataforma de Cursos - API (Desafio Backend)
Uma API RESTful para gerenciamento de cursos, aulas e comentários, desenvolvida com NestJS.

🚀 Tecnologias Utilizadas
NestJS - Framework Node.js para construção eficiente de aplicações server-side

TypeORM - ORM para integração com banco de dados

PostgreSQL (ou SQLite para desenvolvimento) - Banco de dados relacional

JWT - Autenticação segura

Swagger - Documentação interativa da API

Docker - Containerização e ambiente de desenvolvimento consistente

📋 Requisitos do Sistema
Node.js v16+

npm ou yarn

Docker (opcional)

PostgreSQL (ou SQLite para desenvolvimento)

🛠️ Instalação

1. Clonar o repositório
   bash
   Copy
   git clone https://github.com/seu-usuario/plataforma-cursos-api.git
   cd plataforma-cursos-api
2. Instalar dependências
   bash
   Copy
   npm install
3. Configurar ambiente
   Crie um arquivo .env baseado no .env.example:

bash
Copy
cp .env.example .env
Edite o .env com suas configurações:

env
Copy

# Banco de dados

DB_TYPE=postgres
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=seu_usuario
DB_PASSWORD=sua_senha
DB_DATABASE=plataforma_cursos

# Autenticação JWT

JWT_SECRET=seuSegredoSuperSecreto
JWT_EXPIRES_IN=1d

# Modo de desenvolvimento

NODE_ENV=development 4. Executar com Docker (recomendado)
bash
Copy
docker-compose up -d 5. Executar sem Docker
bash
Copy

# Iniciar o servidor

npm run start:dev
🗄️ Estrutura do Banco de Dados
Copy
courses
├── id
├── name
├── category
└── lessons (relação 1-n)
├── id
├── title
├── description
└── comments (relação 1-n)
├── id
├── user
├── text
└── date
📡 Endpoints da API
Autenticação
POST /auth/register - Registrar novo usuário

POST /auth/login - Login e obtenção de token JWT

Cursos
GET /courses - Listar todos os cursos

POST /courses - Criar novo curso

GET /courses/:id - Obter detalhes de um curso

PUT /courses/:id - Atualizar curso

DELETE /courses/:id - Remover curso

Aulas
GET /courses/:id/lessons - Listar aulas de um curso

POST /courses/:id/lessons - Criar nova aula

GET /courses/:id/lessons/:lessonId - Detalhes de uma aula

PUT /courses/:id/lessons/:lessonId - Atualizar aula

DELETE /courses/:id/lessons/:lessonId - Remover aula

Comentários
POST /courses/:id/lessons/:lessonId/comments - Adicionar comentário

GET /courses/:id/lessons/:lessonId/comments - Listar comentários

🧪 Testes
Executar testes unitários:

bash
Copy
npm run test
Executar testes com cobertura:

bash
Copy
npm run test:cov
📚 Documentação com Swagger
Acesse a documentação interativa em:

Copy
http://localhost:3000/api
🐳 Docker
Construir a imagem
bash
Copy
docker-compose build
Iniciar containers
bash
Copy
docker-compose up -d
Parar containers
bash
Copy
docker-compose down
🔧 Variáveis de Ambiente
Variável Descrição Padrão
DB_TYPE Tipo de banco de dados postgres
DB_HOST Host do banco de dados localhost
DB_PORT Porta do banco de dados 5432
DB_USERNAME Usuário do banco de dados postgres
DB_PASSWORD Senha do banco de dados -
DB_DATABASE Nome do banco de dados plataforma_cursos
JWT_SECRET Segredo para assinar tokens JWT -
JWT_EXPIRES_IN Tempo de expiração do token 1d
NODE_ENV Ambiente de execução development
📦 Scripts Úteis
Comando Descrição
npm run start Inicia a aplicação em produção
npm run start:dev Inicia em modo desenvolvimento
npm run build Compila o projeto
npm run format Formata o código com Prettier
npm run lint Verifica qualidade do código
npm run migration:generate Gera nova migração
npm run migration:run Executa migrações pendentes
🤝 Contribuição
Faça um fork do projeto

Crie uma branch para sua feature (git checkout -b feature/incrivel)

Commit suas mudanças (git commit -m 'Adiciona feature incrível')

Push para a branch (git push origin feature/incrivel)

Abra um Pull Request

📄 Licença
Este projeto está licenciado sob a licença MIT - veja o arquivo LICENSE para detalhes.

✉️ Contato
Desenvolvedor - Seu Nome
LinkedIn - seu-perfil

Nota: Para desenvolvimento local com SQLite, altere no .env:

env
Copy
DB_TYPE=sqlite
DB_DATABASE=db.sqlite
