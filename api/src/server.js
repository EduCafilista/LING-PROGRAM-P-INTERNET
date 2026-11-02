require('dotenv').config();

const express = require('express');
const cors = require('cors');
const db = require('./database/db');
const authRoutes = require('./routes/auth.routes');
const vagasRoutes = require('./routes/vagas.routes');
const cepRoutes = require('./routes/cep.routes');

if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET não definido. Crie api/.env com JWT_SECRET e PORT.');
}

const app = express();
const PORT = Number(process.env.PORT) || 3001;

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', projeto: 'DevJobs API', timestamp: new Date().toISOString() });
});

app.use('/api/auth', authRoutes);
app.use('/api/vagas', vagasRoutes);
app.use('/api/cep', cepRoutes);

app.use((req, res) => res.status(404).json({ erro: 'Rota não encontrada' }));
app.use((err, req, res, next) => {
  console.error(err);
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({ erro: 'JSON inválido no corpo da requisição' });
  }
  return res.status(500).json({ erro: 'Erro interno do servidor' });
});

app.listen(PORT, () => {
  console.log(`DevJobs API rodando em http://localhost:${PORT}`);
  console.log(`Banco carregado: ${db.name || 'SQLite'}`);
});
