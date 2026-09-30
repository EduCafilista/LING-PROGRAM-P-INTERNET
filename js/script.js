const vagas = [
    {
        id: 1,
        titulo: 'Desenvolvedor(a) Frontend React',
        empresa: 'TechNova',
        tipo: 'remoto',
        tecnologias: ['React', 'TypeScript', 'CSS'],
        salario: 'R$ 6.000 – R$ 9.000',
        local: 'Remoto'
    },
    {
        id: 2,
        titulo: 'Desenvolvedor(a) Backend Node.js',
        empresa: 'DataFlow',
        tipo: 'hibrido',
        tecnologias: ['Node.js', 'PostgreSQL'],
        salario: 'R$ 7.000 – R$ 10.000',
        local: 'São Paulo, SP'
    },
    {
        id: 3,
        titulo: 'Desenvolvedor(a) Fullstack',
        empresa: 'AgroTech',
        tipo: 'presencial',
        tecnologias: ['React', 'Node.js', 'MySQL'],
        salario: 'R$ 5.500 – R$ 8.000',
        local: 'Uberlândia, MG'
    },
    {
        id: 4,
        titulo: 'Analista de Dados',
        empresa: 'Banco Triângulo',
        tipo: 'hibrido',
        tecnologias: ['Python', 'SQL', 'Power BI'],
        salario: 'R$ 5.000 – R$ 7.500',
        local: 'Uberaba, MG'
    },
    {
        id: 5,
        titulo: 'Engenheiro(a) DevOps',
        empresa: 'CloudMine',
        tipo: 'remoto',
        tecnologias: ['AWS', 'Docker', 'Kubernetes'],
        salario: 'R$ 9.000 – R$ 13.000',
        local: 'Remoto'
    },
    {
        id: 6,
        titulo: 'Estágio em Desenvolvimento Web',
        empresa: 'StartUp Hub',
        tipo: 'hibrido',
        tecnologias: ['HTML', 'CSS', 'JavaScript'],
        salario: 'R$ 1.800',
        local: 'Uberlândia, MG'
    }
];

let filtroTipo = 'todos';
const inputBusca = document.getElementById('busca');

function criarCard(vaga) {
    const article = document.createElement('article');
    article.className = 'job-card';

    const badgeClass = {
        remoto: 'job-card__badge--remote',
        presencial: 'job-card__badge--onsite',
        hibrido: 'job-card__badge--hybrid'
    }[vaga.tipo] || '';

    const tipoLabel = {
        remoto: 'Remoto',
        presencial: 'Presencial',
        hibrido: 'Híbrido'
    }[vaga.tipo] || vaga.tipo;

    const badge = document.createElement('span');
    badge.className = 'job-card__badge ' + badgeClass;
    badge.textContent = tipoLabel;

    const title = document.createElement('h3');
    title.className = 'job-card__title';
    title.textContent = vaga.titulo;

    const company = document.createElement('p');
    company.className = 'job-card__company';
    company.textContent = vaga.empresa;

    const tech = document.createElement('p');
    tech.className = 'job-card__tech';
    tech.textContent = vaga.tecnologias.join(' · ');

    const salary = document.createElement('p');
    salary.className = 'job-card__salary';
    salary.textContent = vaga.salario;

    const location = document.createElement('p');
    location.className = 'job-card__location';
    location.textContent = '📍 ' + vaga.local;

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'btn';
    btn.textContent = 'Ver detalhes';

    article.append(badge, title, company, tech, salary, location, btn);

    return article;
}

function renderizarVagas(lista) {
    const grid = document.getElementById('jobs-grid');
    grid.replaceChildren();

    if (lista.length === 0) {
        const emptyMsg = document.createElement('p');
        emptyMsg.className = 'empty-msg';
        emptyMsg.textContent = 'Nenhuma vaga encontrada.';
        grid.appendChild(emptyMsg);
        return;
    }

    lista.forEach(vaga => grid.appendChild(criarCard(vaga)));
}

function filtrarVagas(termo) {
    const busca = termo.trim().toLowerCase();

    return vagas.filter(vaga => {
        if (filtroTipo !== 'todos' && vaga.tipo !== filtroTipo) {
            return false;
        }

        if (!busca) {
            return true;
        }

        const texto = [
            vaga.titulo,
            vaga.empresa,
            vaga.local,
            ...vaga.tecnologias
        ].join(' ').toLowerCase();

        return texto.includes(busca);
    });
}

function atualizarContagem(qtd, termo) {
    const el = document.getElementById('resultado-contagem');

    if (!termo.trim()) {
        el.textContent = qtd + ' vagas disponíveis';
    } else {
        el.textContent = qtd + ' vaga(s) encontrada(s) para "' + termo + '"';
    }
}

function atualizarTela() {
    const termo = inputBusca.value;
    const resultado = filtrarVagas(termo);
    renderizarVagas(resultado);
    atualizarContagem(resultado.length, termo);
}

inputBusca.addEventListener('input', atualizarTela);

// filtro por tipo
const chips = document.querySelectorAll('.chip');

chips.forEach(chip => {
    chip.addEventListener('click', () => {
        filtroTipo = chip.dataset.tipo;
        chips.forEach(c => c.classList.remove('ativo'));
        chip.classList.add('ativo');
        atualizarTela();
    });
});

// tema claro/escuro
const THEME_KEY = 'devjobs-theme';
const btnTheme = document.getElementById('theme-toggle');

function aplicarTema(tema) {
    document.body.classList.toggle('dark', tema === 'dark');
    btnTheme.textContent = tema === 'dark' ? '☀️' : '🌙';
}

function carregarTemaSalvo() {
    const salvo = localStorage.getItem(THEME_KEY);

    if (salvo) {
        aplicarTema(salvo);
        return;
    }

    const prefereDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    aplicarTema(prefereDark ? 'dark' : 'light');
}

btnTheme.addEventListener('click', () => {
    const isDark = document.body.classList.contains('dark');
    const novoTema = isDark ? 'light' : 'dark';
    aplicarTema(novoTema);
    localStorage.setItem(THEME_KEY, novoTema);
});

carregarTemaSalvo();
atualizarTela();
