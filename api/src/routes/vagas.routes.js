const { Router } = require('express');
const router = Router();
const db = require('../database/db');
const auth = require('../middleware/auth.middleware');

const TIPOS_VALIDOS = ['remoto', 'presencial', 'hibrido'];

const SELECT_VAGA = `
  SELECT v.*, e.nome AS empresa_nome
  FROM vagas v
  JOIN empresas e ON e.id = v.empresa_id
`;

// Leitura pública: listagem e detalhes continuam disponíveis sem login.
router.get('/', (req, res) => {
  const vagas = db.prepare(`${SELECT_VAGA} ORDER BY v.created_at DESC`).all();
  return res.json(vagas);
});

router.get('/:id', (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id < 1) return res.status(400).json({ erro: 'ID inválido' });

  const vaga = db.prepare(`${SELECT_VAGA} WHERE v.id = ?`).get(id);
  if (!vaga) return res.status(404).json({ erro: 'Vaga não encontrada' });
  return res.json(vaga);
});

// Criação protegida. empresa_id é sempre obtido do JWT, nunca do body.
router.post('/', auth, (req, res) => {
  const {
    titulo, tipo, tecnologias = '', salario = '', cep = '',
    cidade = '', estado = '', descricao = ''
  } = req.body || {};

  if (typeof titulo !== 'string' || !titulo.trim() || !TIPOS_VALIDOS.includes(tipo)) {
    return res.status(400).json({ erro: 'Informe titulo e tipo válido (remoto, presencial ou hibrido)' });
  }

  const textos = [tecnologias, salario, cep, cidade, estado, descricao];
  if (!textos.every((valor) => typeof valor === 'string')) {
    return res.status(400).json({ erro: 'tecnologias, salario, cep, cidade, estado e descricao devem ser textos' });
  }

  const result = db.prepare(`
    INSERT INTO vagas (titulo, empresa_id, tipo, tecnologias, salario, cep, cidade, estado, descricao)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    titulo.trim(), req.empresa.id, tipo, tecnologias, salario, cep, cidade, estado, descricao
  );

  const vaga = db.prepare(`${SELECT_VAGA} WHERE v.id = ?`).get(result.lastInsertRowid);
  return res.status(201).json(vaga);
});

// Edição também fica autenticada e limitada à vaga da empresa do token.
router.put('/:id', auth, (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id < 1) return res.status(400).json({ erro: 'ID inválido' });

  const existente = db.prepare('SELECT id FROM vagas WHERE id = ? AND empresa_id = ?')
    .get(id, req.empresa.id);
  if (!existente) return res.status(404).json({ erro: 'Vaga não encontrada' });

  const { titulo, tipo, tecnologias, salario, cep, cidade, estado, descricao } = req.body || {};
  if (tipo !== undefined && !TIPOS_VALIDOS.includes(tipo)) {
    return res.status(400).json({ erro: 'tipo deve ser remoto, presencial ou hibrido' });
  }

  db.prepare(`
    UPDATE vagas SET
      titulo = COALESCE(?, titulo), tipo = COALESCE(?, tipo),
      tecnologias = COALESCE(?, tecnologias), salario = COALESCE(?, salario),
      cep = COALESCE(?, cep), cidade = COALESCE(?, cidade),
      estado = COALESCE(?, estado), descricao = COALESCE(?, descricao)
    WHERE id = ? AND empresa_id = ?
  `).run(titulo, tipo, tecnologias, salario, cep, cidade, estado, descricao, id, req.empresa.id);

  const atualizada = db.prepare(`${SELECT_VAGA} WHERE v.id = ?`).get(id);
  return res.json(atualizada);
});

// Só a empresa proprietária da vaga pode excluí-la.
router.delete('/:id', auth, (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id < 1) return res.status(400).json({ erro: 'ID inválido' });

  const result = db.prepare('DELETE FROM vagas WHERE id = ? AND empresa_id = ?')
    .run(id, req.empresa.id);
  if (result.changes === 0) return res.status(404).json({ erro: 'Vaga não encontrada' });
  return res.status(204).send();
});

module.exports = router;
