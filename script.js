// === UTIL HELPERS
const qs = sel => document.querySelector(sel);
const qsa = sel => Array.from(document.querySelectorAll(sel));

// ====== tsParticles INIT (visual tech background)
window.addEventListener('load', () => {
  if (window.tsParticles) {
    tsParticles.load("bg-particles", {
      fpsLimit: 60,
      particles: {
        number: { value: 40, density: { enable: true, area: 800 } },
        color: { value: ["#00d7ff", "#66f0ff"] },
        shape: { type: "circle" },
        opacity: { value: 0.08 },
        size: { value: { min: 1, max: 3 } },
        links: { enable: true, distance: 120, color: "#00d7ff", opacity: 0.06, width: 1 },
        move: { enable: true, speed: 0.8, outModes: "bounce" }
      },
      interactivity: {
        events: { onHover: { enable: true, mode: "repulse" }, onClick: { enable: false } },
        modes: { repulse: { distance: 100 } }
      },
      detectRetina: true
    });
  }
});

// ====== HERO chart (Chart.js) - mini preview
function createHeroChart() {
  const ctx = qs('#heroChart')?.getContext('2d');
  if (!ctx) return;
  new Chart(ctx, {
    type: 'line',
    data: {
      labels: ['Jan','Fev','Mar','Abr','Mai','Jun'],
      datasets: [{
        label: 'Receita',
        data: [65,59,80,81,56,75],
        borderColor: '#00d7ff',
        backgroundColor: 'rgba(0,215,255,0.08)',
        tension: 0.35,
        pointRadius: 3,
        fill: true
      }]
    },
    options: {
      responsive: true,
      plugins: { legend: { display: false } },
      scales: {
        x: { grid: { display: false } },
        y: { grid: { color: 'rgba(255,255,255,0.03)' } }
      }
    }
  });
}

// ====== TYPING EFFECT
function startTyping() {
  const el = qs('.typing');
  if (!el) return;
  const text = "Especialista em BI, Visualização de Dados e Estratégia Analítica";
  let i = 0;
  function step() {
    if (i < text.length) {
      el.textContent += text.charAt(i);
      i++;
      setTimeout(step, 30);
    }
  }
  step();
}

// ====== REVEAL ON SCROLL
function revealOnScroll() {
  qsa('.reveal').forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight - 80) el.classList.add('active');
  });
}

// ====== COUNTERS (impact + mini metrics)
function animateCounters() {
  qsa('.counter, .metric .num').forEach(el => {
    const target = +el.dataset.target;
    if (!target) return;
    const start = +el.textContent || 0;
    let current = start;
    const step = Math.max(1, Math.floor(target / 80));
    const run = () => {
      current += step;
      if (current >= target) el.textContent = target;
      else { el.textContent = current; requestAnimationFrame(run); }
    };
    run();
  });
}

// ====== SKILL CARDS expand/collapse
function initSkillCards() {
  qsa('.skill-card').forEach(card => {
    card.addEventListener('click', () => toggleSkill(card));
    card.addEventListener('keypress', e => { if (e.key === 'Enter' || e.key === ' ') toggleSkill(card); });
  });

  function toggleSkill(card) {
    // close others
    qsa('.skill-card.active').forEach(c => { if (c !== card) { c.classList.remove('active'); c.setAttribute('aria-expanded','false'); c.querySelector('.skill-details').setAttribute('aria-hidden','true'); }});
    // toggle this
    const active = card.classList.toggle('active');
    card.setAttribute('aria-expanded', active ? 'true' : 'false');
    const details = card.querySelector('.skill-details');
    if (details) details.setAttribute('aria-hidden', active ? 'false' : 'true');
  }
}

// ====== PROJECTS modal
function initProjects() {
  const modal = qs('#projectModal');
  const modalTitle = qs('#modalTitle');
  const modalDesc = qs('#modalDesc');
  const modalDemo = qs('#modalDemo');
  const modalRepo = qs('#modalRepo');
  let modalChart = null;
  const modalCtx = qs('#modalChart')?.getContext('2d');

  qsa('[data-open="modal"]').forEach(btn => {
    btn.addEventListener('click', (ev) => {
      const card = ev.currentTarget.closest('.project-card');
      if (!card) return;
      const p = JSON.parse(card.dataset.project || '{}');
      modalTitle.textContent = p.title || 'Projeto';
      modalDesc.textContent = p.desc || '';
      modalDemo.href = p.demo || '#';
      modalRepo.href = p.repo || '#';

      // create/destroy chart
      if (modalChart) modalChart.destroy();
      modalChart = new Chart(modalCtx, {
        type: 'bar',
        data: { labels: p.labels || [], datasets: [{ label: p.title || 'Métrica', data: p.data || [], backgroundColor: 'rgba(0,215,255,0.12)', borderColor: '#00d7ff' }] },
        options: { responsive:true, plugins:{legend:{display:false}} }
      });

      modal.setAttribute('aria-hidden','false');
      document.body.style.overflow = 'hidden';
    });
  });

  // close events
  qsa('.modal-close').forEach(b => b.addEventListener('click', closeModal));
  modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });

  function closeModal(){
    modal.setAttribute('aria-hidden','true');
    document.body.style.overflow = '';
    if (modalChart) { modalChart.destroy(); modalChart = null; }
  }
}

// ====== PROJECT FILTER
function initProjectFilters() {
  qsa('.filter').forEach(btn => {
    btn.addEventListener('click', () => {
      qsa('.filter').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const f = btn.dataset.filter;
      qsa('#projectsGrid .project-card').forEach(card => {
        card.style.display = (f === 'all' || card.dataset.category === f) ? '' : 'none';
      });
    });
  });
}

// ====== CONTACT form -> opens mailto prefilled
function initContactForm() {
  const form = qs('#contactForm');
  if (!form) return;
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = qs('#cfName').value.trim();
    const email = qs('#cfEmail').value.trim();
    const msg = qs('#cfMessage').value.trim();
    const to = 'seuemail@email.com';
    const subject = encodeURIComponent(`Contato do site: ${name}`);
    const body = encodeURIComponent(`Nome: ${name}\nEmail: ${email}\n\nMensagem:\n${msg}`);
    window.location.href = `mailto:${to}?subject=${subject}&body=${body}`;
  });

  qs('#btnCopyMail')?.addEventListener('click', () => {
    navigator.clipboard?.writeText('seuemail@email.com');
    alert('Email copiado para a área de transferência.');
  });

  // direct mailto quick button
  qs('#contactMailBtn')?.addEventListener('click', (e) => {
    // allow default mailto link
  });
}

// ====== INIT all
window.addEventListener('DOMContentLoaded', () => {
  createHeroChart();
  startTyping();
  initSkillCards();
  initProjects();
  initProjectFilters();
  initContactForm();
  revealOnScroll();
  animateCounters();

  // trigger reveal on scroll continuously
  window.addEventListener('scroll', () => {
    revealOnScroll();
  });
});
