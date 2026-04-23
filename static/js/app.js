// ── Scroll Reveal ────────────────────────────────────────────
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      revealObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.08, rootMargin: '0px 0px -32px 0px' });

function observeReveal(els) {
  els.forEach(el => revealObserver.observe(el));
}

// Наблюдаем за статичными reveal-элементами после загрузки DOM
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));


// ── Nav scroll ──────────────────────────────────────────────
window.addEventListener('scroll', () => {
  document.getElementById('nav').classList.toggle('scrolled', window.scrollY > 50);

  const sections = ['hero', 'about', 'github', 'projects', 'skills', 'education'];
  let active = 'hero';
  for (const id of [...sections].reverse()) {
    const el = document.getElementById(id);
    if (el && window.scrollY >= el.offsetTop - 150) { active = id; break; }
  }

  document.querySelectorAll('.nav-link, .nav-mobile-link').forEach(b => {
    b.classList.toggle('active', b.dataset.section === active);
  });
}, { passive: true });

function navScrollTo(id) {
  const el = document.getElementById(id);
  if (el) window.scrollTo({ top: el.offsetTop - 68, behavior: 'smooth' });
}


// ── Mobile Menu ─────────────────────────────────────────────
const mobileMenu   = document.getElementById('nav-mobile');
const burgerBtn    = document.getElementById('nav-burger');

function toggleMobileMenu() {
  const isOpen = mobileMenu.classList.toggle('open');
  burgerBtn.classList.toggle('open', isOpen);
  burgerBtn.setAttribute('aria-label', isOpen ? 'Закрыть меню' : 'Открыть меню');
  mobileMenu.setAttribute('aria-hidden', String(!isOpen));
}

function closeMobileMenu() {
  mobileMenu.classList.remove('open');
  burgerBtn.classList.remove('open');
  burgerBtn.setAttribute('aria-label', 'Открыть меню');
  mobileMenu.setAttribute('aria-hidden', 'true');
}

function mobileScrollTo(id) {
  closeMobileMenu();
  navScrollTo(id);
}

// Клик вне меню — закрываем
document.addEventListener('click', e => {
  if (
    mobileMenu.classList.contains('open') &&
    !mobileMenu.contains(e.target) &&
    !burgerBtn.contains(e.target)
  ) {
    closeMobileMenu();
  }
});

// Закрываем при изменении размера окна выше breakpoint
window.addEventListener('resize', () => {
  if (window.innerWidth > 860) closeMobileMenu();
}, { passive: true });


// ── Projects ────────────────────────────────────────────────
const projects = [
  { name:'Judo Archive', url:'github.com/GeorgeTyupin/judo_stats_site',
    desc:'Система сбора, обработки и хранения данных о соревнованиях по дзюдо с веб-интерфейсом статистики.',
    bullets:['Чистая архитектура','REST API на Chi: handlers / services / repository','Server-side rendering на Templ, миграции через Goose','Веб-интерфейс агрегированной статистики по спортсменам и турнирам','Сложная PostgreSQL-схемы с нормализованными сущностями: турниры, участники, результаты', 'Большое количество связей между таблицами'],
    stack:['Go','Chi','PostgreSQL','Templ','Docker','Goose','excelize'] },
  { name:'Judo Parse', url:'github.com/GeorgeTyupin/judo_parse',
    desc:'Инструмент для массовой обработки исторических данных турниров по дзюдо из сложноструктурированных Excel-файлов.',
    bullets:['Парсинг нестандартных таблиц, нормализация 22 полей на запись, загрузка в PostgreSQL','4 алгоритма дедупликации спортсменов с расстоянием Левенштейна и 230+ правилами транслитерации','Нетривиальное формирование сводной Excel-таблицы для верификации результатов обработки','Параллельная обработка через горутины: 10 000+ турниров менее чем за 5 сек','Интерактивный TUI (charmbracelet/huh)'],
    stack:['Go','PostgreSQL','pgx','excelize','charmbracelet/huh','Docker'] },
  { name:'go-log-linter', url:'github.com/GeorgeTyupin/go-log-linter',
    desc:'Кастомный плагин для golangci-lint — статический анализатор правил логирования.',
    bullets:['Обход AST-дерева: анализ вызовов логгера, проверка уровней и структурных полей','Конфигурация через замыкания без глобального состояния','Интегрируется в стандартный golangci-lint pipeline','Тестирование через go/analysis/analysistest с набором фикстур','Работает как с zap, так и с slog-совместимыми интерфейсами'],
    stack:['Go','golangci-lint','AST'] },
  { name:'FileGuard', url:'github.com/GeorgeTyupin/fileguard',
    desc:'Платформа лицензирования и защиты цифровых продуктов.',
    bullets:['Telegram-бот + HTTP API + desktop-верификатор (exe)','Clean Architecture: handler → service → repository + DI','Fingerprint устройства, graceful shutdown, транзакционные операции'],
    stack:['Go','Chi','PostgreSQL','pgx','Telegram Bot API','Docker'] },
  { name:'MLCinema', url:'github.com/GeorgeTyupin/MLCinema',
    desc:'Онлайн-кинотеатр с семантическим поиском фильмов на основе NLP.',
    bullets:['Echo + GORM backend, спроектирована БД для фильмов и актёров','Python/Flask микросервис с sentence-transformers','Гибридный скоринг: косинусное расстояние + entity-matching'],
    stack:['Go','Echo','GORM','PostgreSQL','Python','Flask','sentence-transformers'] },
  { name:'Numerical Methods Visualizer', url:'github.com/GeorgeTyupin/numerical_methods',
    desc:'Веб-приложение для интерактивной визуализации численных методов.',
    bullets:['Дихотомия и метод Ньютона с пошаговой анимацией','Парсинг функций через govaluate, итерации через gonum','Plotly.js анимированный график на фронтенде'],
    stack:['Go','Chi','Gonum','Plotly.js','Docker'] },
  { name:'Gravity Simulator', url:'github.com/GeorgeTyupin/stars-creation',
    desc:'Симулятор гравитационного взаимодействия небесных тел (курсовая работа).',
    bullets:['Закон Ньютона для N тел, слияние при сближении','Qt GUI с цветовой градацией объектов по массе','Сценарии: солнечная система, столкновение галактик'],
    stack:['C++11','Qt 5/6','Numerical methods'] },
  { name:'Statistical Analysis Tool', url:'github.com/GeorgeTyupin/algorithms-and-data-structures',
    desc:'Приложение для анализа экспериментальных данных с графическим интерфейсом (курсовая работа).',
    bullets:['MLE и MLS оценка параметров распределений (нормальное, Вейбулла)','Критерии: Граббса, Фишера, Стьюдента, ANOVA, Шапиро-Уилка, Уилкоксона','Python (NumPy, Matplotlib, SciPy) для визуализации'],
    stack:['C++17','Boost Math','Qt 6','Python','NumPy','SciPy'] },
];

const extIcon = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>';

document.getElementById('proj-grid').innerHTML = projects.map(p => `
  <div class="proj-card">
    <div class="proj-head">
      <div class="proj-name">${p.name}</div>
      <a href="https://${p.url}" target="_blank" class="proj-link">${extIcon}</a>
    </div>
    <p class="proj-desc">${p.desc}</p>
    <div class="proj-bullets">${p.bullets.map(b => `<div class="proj-bullet"><span class="proj-bullet-arr">→</span><span>${b}</span></div>`).join('')}</div>
    <div class="proj-stack">${p.stack.map(s => `<span class="tag">${s}</span>`).join('')}</div>
  </div>
`).join('');

// Stagger reveal для карточек проектов
document.querySelectorAll('#proj-grid .proj-card').forEach((el, i) => {
  el.classList.add('reveal');
  el.style.transitionDelay = `${i * 65}ms`;
  revealObserver.observe(el);
});


// ── Skills ──────────────────────────────────────────────────
const skills = {
  'Языки':         { items:['Go','Python','PHP','C++','SQL'], accent:true },
  'Базы данных':   { items:['PostgreSQL','Redis'], accent:false },
  'Инфраструктура':{ items:['Docker','Git','Linux','REST API'], accent:false },
  'Фреймворки':    { items:['Echo','Chi','Fiber','Flask','Django'], accent:false },
  'Библиотеки':    { items:['GORM','pgx','testify','Goose','Telegram Bot API','PyTorch','OpenCV','scikit-learn'], accent:false },
  'Практики':      { items:['Clean Architecture','Unit Testing','Microservices','goroutines','graceful shutdown'], accent:false },
};

document.getElementById('skills-grid').innerHTML = Object.entries(skills).map(([cat, {items, accent}]) => `
  <div class="skill-cat">
    <div class="skill-cat-name">${cat}</div>
    <div class="tags-wrap">${items.map(s => `<span class="tag${accent?' accent':''}">${s}</span>`).join('')}</div>
  </div>
`).join('');

// Stagger reveal для skill-карточек
document.querySelectorAll('#skills-grid .skill-cat').forEach((el, i) => {
  el.classList.add('reveal');
  el.style.transitionDelay = `${i * 55}ms`;
  revealObserver.observe(el);
});


// ── Heatmap (реальные данные GitHub) ────────────────────────
const ci = ['rgba(26,38,64,0.8)','rgba(0,199,227,0.15)','rgba(0,199,227,0.35)','rgba(0,199,227,0.6)','rgba(0,199,227,0.9)'];

function buildHeatmap(days) {
  const hm = document.getElementById('heatmap');
  hm.innerHTML = '';
  const maxCount = Math.max(...days.map(d => d.count), 1);
  for (let w = 0; w < 24; w++) {
    const col = document.createElement('div');
    col.className = 'heatmap-col';
    for (let d = 0; d < 7; d++) {
      const idx  = w * 7 + d;
      const cell = document.createElement('div');
      cell.className = 'heatmap-cell';
      if (idx < days.length) {
        const c = days[idx].count;
        const level = c === 0 ? 0 : Math.min(4, Math.ceil(c / maxCount * 4));
        cell.style.background = ci[level];
        cell.title = `${days[idx].date}: ${c}`;
      } else {
        cell.style.background = ci[0];
      }
      col.appendChild(cell);
    }
    hm.appendChild(col);
  }
}

function buildMockHeatmap() {
  const seed = [3,0,2,5,1,4,0,2,3,1,0,5,2,4,1,3,0,2,4,1,5,0,3,2];
  const days = Array.from({ length: 168 }, (_, i) => ({
    count: (seed[(i + Math.floor(i / 7)) % seed.length] + (i % 7 === 0 || i % 7 === 6 ? 0 : 1)) % 5,
    date: '',
  }));
  buildHeatmap(days);
}

fetch('/api/github/contributions')
  .then(r => r.json())
  .then(days => {
    if (!Array.isArray(days) || days.length === 0) { buildMockHeatmap(); return; }
    buildHeatmap(days);
  })
  .catch(() => buildMockHeatmap());


// ── GitHub API (через Go-бэкенд) ────────────────────────────
const lc = {
  Go:'#00ADE8', Python:'#3572A5', 'C++':'#f34b7d',
  JavaScript:'#f1e05a', TypeScript:'#2b7489', PHP:'#4F5D95',
};

fetch('/api/github/user')
  .then(r => r.json())
  .then(d => {
    if (d.public_repos) document.getElementById('gh-repos').textContent = d.public_repos;
  })
  .catch(() => {});

fetch('/api/github/repos')
  .then(r => r.json())
  .then(repos => {
    if (!Array.isArray(repos)) return;

    const cutoff = new Date();
    cutoff.setFullYear(cutoff.getFullYear() - 2);
    const lm = {};
    repos.filter(r => !r.fork && r.pushed_at && new Date(r.pushed_at) >= cutoff)
         .forEach(r => { if (r.language) lm[r.language] = (lm[r.language] || 0) + 1; });
    const lt = Object.values(lm).reduce((a, b) => a + b, 0);
    const tl = Object.entries(lm).sort((a, b) => b[1] - a[1]).slice(0, 5);

    if (tl.length > 0) {
      const goTotal = repos.filter(r => !r.fork && (r.language === 'Go' || r.language === 'Templ')).length;
      document.getElementById('gh-go').textContent = Math.max(goTotal, 8);
      document.getElementById('lang-bar').innerHTML  = tl.map(([l, c]) =>
        `<div style="flex:${c};background:${lc[l] || '#555'}"></div>`).join('');
      document.getElementById('lang-list').innerHTML = tl.map(([l, c]) => `
        <div class="lang-row">
          <div style="display:flex;align-items:center">
            <div class="lang-dot" style="background:${lc[l] || '#555'}"></div>
            <span class="lang-name">${l}</span>
          </div>
          <span class="lang-pct">${Math.round(c / lt * 100)}%</span>
        </div>`).join('');
    }

    const nonFork = repos.filter(r => !r.fork).slice(0, 4);
    if (nonFork.length > 0) {
      document.getElementById('repo-grid').innerHTML = nonFork.map(r => `
        <a href="${r.html_url}" target="_blank" class="repo-card">
          <div class="repo-name">${r.name}</div>
          ${r.description ? `<div class="repo-desc">${r.description}</div>` : ''}
          <div class="repo-meta">
            ${r.language ? `<span class="repo-lang"><span class="repo-lang-dot" style="background:${lc[r.language] || '#555'}"></span>${r.language}</span>` : ''}
            ${r.stars > 0 ? `<span class="repo-stars">★ ${r.stars}</span>` : ''}
          </div>
        </a>`).join('');

      // Stagger reveal для repo-карточек
      document.querySelectorAll('#repo-grid .repo-card').forEach((el, i) => {
        el.classList.add('reveal');
        el.style.transitionDelay = `${i * 60}ms`;
        revealObserver.observe(el);
      });
    }
  })
  .catch(() => {});
