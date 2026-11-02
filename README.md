# DevJobs — Mural de Vagas de TI

Frontend em HTML/CSS/JavaScript e API Node.js/Express com SQLite.

## Executar

1. Entre na pasta `api`.
2. Execute `npm install`.
3. Copie `.env.example` para `.env` e **substitua JWT_SECRET por uma chave forte**.
4. Execute `npm run seed` para criar os dados de demonstração.
5. Execute `npm start` (API em `http://localhost:3001`).
6. Abra `index.html` no navegador (preferencialmente usando um servidor local estático).

O frontend consulta `GET /api/vagas`, permite pesquisar vagas, alternar o tema e abrir detalhes dos anúncios. O botão **Ver detalhes** mostra informações da vaga, mas não realiza candidatura.

Se a API estiver em outro endereço, altere `API_URL` no início de `js/script.js`. A API permite cadastrar, editar e excluir vagas mediante autenticação da empresa. Para teste local, o seed cria uma conta demonstrativa; altere as credenciais antes de qualquer publicação.

## Arquivos modificados

- `js/script.js`: integração à API, filtros e detalhes das vagas.
- `index.html`: janela acessível de detalhes.
- `css/style.css`: estilos da janela.
- `README.md`: instruções de execução.

## Observação sobre o roteiro

O texto fornecido da Atividade 2 de Indústria 4.0 descreve respostas acadêmicas sobre sustentabilidade e ESG, não requisitos funcionais do sistema DevJobs. Por isso, esta atualização não inventa funcionalidades ambientais nem altera a finalidade do projeto.
