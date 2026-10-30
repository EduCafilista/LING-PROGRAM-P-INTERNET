const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;
require('./database/db');

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    projeto: 'DevJobs API',
    timestamp: new Date().toISOString()
  });
});

const vagasRoutes = require('./routes/vagas.routes');
app.use('/api/vagas', vagasRoutes);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ erro: 'Erro interno do servidor' });
});

app.listen(PORT, () => {
  console.log(`DevJobs API rodando em http://localhost:${PORT}`);
});

