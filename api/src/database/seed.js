const db = require('./db');
const bcrypt = require('bcryptjs');

const criarDadosDemo = db.transaction(() => {
  const senhaHash = bcrypt.hashSync('123456', 10);
  db.prepare(`
    INSERT OR IGNORE INTO empresas (id, nome, email, senha_hash)
    VALUES (1, 'TechNova Ltda', 'contato@technova.com', ?)
  `).run(senhaHash);

  const empresa = db.prepare('SELECT id FROM empresas WHERE email = ?')
    .get('contato@technova.com');

  const vagaExiste = db.prepare(`
    SELECT id FROM vagas WHERE empresa_id = ? AND titulo = ?
  `).get(empresa.id, 'Dev Frontend React');

  if (!vagaExiste) {
    db.prepare(`
      INSERT INTO vagas (titulo, empresa_id, tipo, tecnologias, salario, descricao)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(
      'Dev Frontend React', empresa.id, 'remoto', 'React,TypeScript,CSS',
      'R$ 6.000 – R$ 9.000',
      'Vaga para desenvolvimento de interfaces modernas.'
    );
  }
});

criarDadosDemo();
console.log('Seed concluído! Login: contato@technova.com / 123456');
