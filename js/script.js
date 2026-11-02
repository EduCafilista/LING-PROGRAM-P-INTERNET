const API_URL = 'http://localhost:3001/api';
let vagas = [];
const grid = document.getElementById('jobs-grid');
const inputBusca = document.getElementById('busca');
const contagem = document.getElementById('resultado-contagem');

function criarCard(vaga) {
  const article = document.createElement('article');
  article.className = 'job-card';
  article.dataset.id = String(vaga.id);
  const header = document.createElement('div');
  header.className = 'job-card__header';
  const badge = document.createElement('span');
  badge.className = `job-card__badge ${({remoto:'job-card__badge--remote',presencial:'job-card__badge--onsite',hibrido:'job-card__badge--hybrid'})[vaga.tipo] || ''}`;
  badge.textContent = ({remoto:'Remoto',presencial:'Presencial',hibrido:'Híbrido'})[vaga.tipo] || vaga.tipo;
  const title = document.createElement('h3');
  title.className = 'job-card__title';
  title.textContent = vaga.titulo;
  const company = document.createElement('p');
  company.className = 'job-card__company';
  company.textContent = vaga.empresa_nome || 'Empresa não informada';
  header.append(badge,title,company);
  const body = document.createElement('div');
  body.className = 'job-card__body';
  const tech = document.createElement('p');
  tech.className = 'job-card__tech';
  tech.textContent = (vaga.tecnologias || '').split(',').map(t => t.trim()).filter(Boolean).join(' · ') || 'Tecnologias não informadas';
  const salary = document.createElement('p');
  salary.className = 'job-card__salary';
  salary.textContent = vaga.salario || 'Salário a combinar';
  const location = document.createElement('p');
  location.className = 'job-card__location';
  location.textContent = vaga.tipo === 'remoto' ? '📍 Remoto' : `📍 ${[vaga.cidade,vaga.estado].filter(Boolean).join(', ') || 'Local não informado'}`;
  body.append(tech,salary,location);
  const footer = document.createElement('div');
  footer.className = 'job-card__footer';
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'btn btn--primary';
  btn.textContent = 'Ver detalhes';
  btn.addEventListener('click', () => mostrarDetalhes(vaga));
  footer.appendChild(btn);
  article.append(header,body,footer);
  return article;
}

function mostrarDetalhes(vaga) {
  const dialog = document.getElementById('detalhes-vaga');
  const conteudo = document.getElementById('detalhes-conteudo');
  conteudo.replaceChildren();
  const titulo = document.createElement('h2');
  titulo.textContent = vaga.titulo;
  conteudo.appendChild(titulo);
  for (const [rotulo,valor] of [
    ['Empresa',vaga.empresa_nome], ['Modalidade',vaga.tipo],
    ['Tecnologias',vaga.tecnologias], ['Salário',vaga.salario || 'A combinar'],
    ['Localização',[vaga.cidade,vaga.estado].filter(Boolean).join(', ') || (vaga.tipo === 'remoto' ? 'Remoto' : 'Não informado')],
    ['Descrição',vaga.descricao || 'Descrição não informada']
  ]) {
    const p = document.createElement('p');
    const strong = document.createElement('strong');
    strong.textContent = `${rotulo}: `;
    p.append(strong, document.createTextNode(valor || 'Não informado'));
    conteudo.appendChild(p);
  }
  dialog.showModal();
}

function renderizarVagas() {
  const termo = inputBusca.value.trim().toLocaleLowerCase('pt-BR');
  const filtradas = vagas.filter(v => [v.titulo,v.empresa_nome,v.tipo,v.tecnologias,v.cidade,v.estado,v.descricao]
    .some(campo => String(campo || '').toLocaleLowerCase('pt-BR').includes(termo)));
  grid.replaceChildren();
  if (!filtradas.length) {
    const aviso = document.createElement('p');
    aviso.className = 'empty-msg';
    aviso.textContent = 'Nenhuma vaga encontrada.';
    grid.appendChild(aviso);
  } else {
    const fragmento = document.createDocumentFragment();
    filtradas.forEach(v => fragmento.appendChild(criarCard(v)));
    grid.appendChild(fragmento);
  }
  contagem.textContent = `${filtradas.length} vaga(s) encontrada(s)`;
}

async function carregarVagas() {
  contagem.textContent = 'Carregando vagas...';
  try {
    const resposta = await fetch(`${API_URL}/vagas`);
    if (!resposta.ok) throw new Error(`HTTP ${resposta.status}`);
    vagas = await resposta.json();
    if (!Array.isArray(vagas)) throw new Error('Resposta inválida');
    renderizarVagas();
  } catch (erro) {
    console.error('Erro ao carregar vagas:', erro);
    grid.replaceChildren();
    contagem.textContent = 'Não foi possível carregar as vagas. Verifique se a API está rodando.';
  }
}
inputBusca.addEventListener('input', renderizarVagas);
document.getElementById('fechar-detalhes').addEventListener('click', () => document.getElementById('detalhes-vaga').close());

const THEME_KEY = 'devjobs-theme';
const btnTheme = document.getElementById('theme-toggle');
function aplicarTema(tema) {
  document.body.classList.toggle('dark', tema === 'dark');
  btnTheme.textContent = tema === 'dark' ? '☀️' : '🌙';
  btnTheme.setAttribute('aria-label', tema === 'dark' ? 'Ativar tema claro' : 'Ativar tema escuro');
}
const salvo = localStorage.getItem(THEME_KEY);
aplicarTema(salvo === 'dark' || (!salvo && window.matchMedia('(prefers-color-scheme: dark)').matches) ? 'dark' : 'light');
btnTheme.addEventListener('click', () => {
  const novoTema = document.body.classList.contains('dark') ? 'light' : 'dark';
  aplicarTema(novoTema);
  localStorage.setItem(THEME_KEY, novoTema);
});
carregarVagas();
