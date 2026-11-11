/* =========================================================
   Portfólio Gabriel Marinho — script.js
   JS puro (sem bibliotecas). Tudo comentado em PT-BR.
   ========================================================= */
(function () {
  'use strict';

  var raiz = document.documentElement;

  // Marca que o JS está ativo: o CSS só esconde os .revelar quando existe .js
  raiz.classList.add('js');

  // O usuário pediu menos movimento no sistema?
  var poucoMovimento = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Atalhos para buscar elementos
  function $(sel, ctx) { return (ctx || document).querySelector(sel); }
  function $$(sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); }

  // localStorage pode falhar (aba anônima, bloqueio): sempre com try/catch
  function salvar(chave, valor) { try { localStorage.setItem(chave, valor); } catch (e) {} }

  /* ---------------------------------------------------------
     1. MODO (escuro / claro) — a cor é sempre o ciano
     O script inline do <head> já aplicou o modo salvo;
     aqui só ligamos o botão ◐ e mantemos o aria-pressed certo.
     --------------------------------------------------------- */
  var btnModo = $('.btn-modo');

  // Limpa a escolha de tema antiga (o seletor de cores foi removido)
  try { localStorage.removeItem('tema'); } catch (e) {}

  function aplicarModo(modo) {
    raiz.setAttribute('data-modo', modo);
    salvar('modo', modo);
    if (btnModo) btnModo.setAttribute('aria-pressed', String(modo === 'claro'));
    desenharReticulas(); // a cor dos pontos muda com o modo
  }

  if (btnModo) {
    btnModo.addEventListener('click', function () {
      aplicarModo(raiz.getAttribute('data-modo') === 'claro' ? 'escuro' : 'claro');
    });
  }

  /* ---------------------------------------------------------
     1b. RETÍCULA RADIAL (halftone em anéis concêntricos)
     Cada <canvas class="reticula"> desenha pontos sobre anéis.
     Os pontos crescem em dois "lóbulos" opostos (data-ang) e
     somem no centro e na borda. Estático: sem animação.
       data-cx / data-cy = centro (fração da largura/altura)
       data-r            = raio (fração da largura)
       data-ang          = direção dos lóbulos, em graus
     --------------------------------------------------------- */
  var reticulas = $$('canvas.reticula');

  function suave(a, b, x) { // smoothstep
    var t = Math.max(0, Math.min(1, (x - a) / (b - a)));
    return t * t * (3 - 2 * t);
  }

  function desenharReticula(cv) {
    var caixa = cv.getBoundingClientRect();
    var w = caixa.width, h = caixa.height;
    if (!w || !h) return;
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    cv.width = Math.round(w * dpr);
    cv.height = Math.round(h * dpr);
    var ctx = cv.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = getComputedStyle(raiz).getPropertyValue('--ponto').trim() || '#00E5FF';

    var cx = parseFloat(cv.dataset.cx || '.5') * w;
    var cy = parseFloat(cv.dataset.cy || '.5') * h;
    var R = parseFloat(cv.dataset.r || '.6') * Math.max(w, h);
    var ang0 = parseFloat(cv.dataset.ang || '-135') * Math.PI / 180;
    var gap = w < 500 ? 9 : 12;          // distância entre anéis (px)
    var maxPonto = gap * 0.46;

    ctx.beginPath();
    for (var k = 1; k * gap <= R; k++) {
      var r = k * gap;
      var t = r / R;
      var rad = suave(0.08, 0.45, t) * (1 - suave(0.72, 1, t));
      if (rad <= 0) continue;
      var n = Math.max(6, Math.round(2 * Math.PI * r / gap));
      var desloc = (k % 2) * Math.PI / n; // alterna os anéis
      for (var i = 0; i < n; i++) {
        var th = i / n * 2 * Math.PI + desloc;
        var lobo = Math.pow((1 + Math.cos(2 * (th - ang0))) / 2, 1.6);
        var tam = maxPonto * (0.12 + 0.88 * lobo) * rad;
        if (tam < 0.35) continue;
        var x = cx + Math.cos(th) * r, y = cy + Math.sin(th) * r;
        if (x < -tam || y < -tam || x > w + tam || y > h + tam) continue;
        ctx.moveTo(x + tam, y);
        ctx.arc(x, y, tam, 0, 2 * Math.PI);
      }
    }
    ctx.fill();
  }

  function desenharReticulas() { reticulas.forEach(desenharReticula); }

  var esperaResize;
  window.addEventListener('resize', function () {
    clearTimeout(esperaResize);
    esperaResize = setTimeout(desenharReticulas, 150);
  });

  // Estado inicial do botão (sem regravar nada) + primeiro desenho
  aplicarModo(raiz.getAttribute('data-modo') || 'escuro');
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(desenharReticulas);

  /* ---------------------------------------------------------
     2. MENU MOBILE (≤ 860px)
     O CSS abre o menu quando .menu-btn tem aria-expanded="true".
     --------------------------------------------------------- */
  var menuBtn = $('.menu-btn');
  var menu = $('#menu-lista');

  function abrirMenu(abrir) {
    if (menuBtn) menuBtn.setAttribute('aria-expanded', String(abrir));
  }

  if (menuBtn && menu) {
    menuBtn.addEventListener('click', function () {
      abrirMenu(menuBtn.getAttribute('aria-expanded') !== 'true');
    });
    // Clicou num link: fecha o menu
    $$('a', menu).forEach(function (a) {
      a.addEventListener('click', function () { abrirMenu(false); });
    });
    // Esc fecha e devolve o foco ao botão
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && menuBtn.getAttribute('aria-expanded') === 'true') {
        abrirMenu(false);
        menuBtn.focus();
      }
    });
  }

  /* ---------------------------------------------------------
     3. SCROLLSPY: destaca no menu a seção que está na tela
     --------------------------------------------------------- */
  var linksMenu = menu ? $$('a[href^="#"]', menu) : [];

  function marcarLink(id) {
    linksMenu.forEach(function (a) {
      var ativo = a.getAttribute('href') === '#' + id;
      a.classList.toggle('ativo', ativo);
      if (ativo) a.setAttribute('aria-current', 'true');
      else a.removeAttribute('aria-current');
    });
  }

  if ('IntersectionObserver' in window && linksMenu.length) {
    var secoes = linksMenu
      .map(function (a) { return document.getElementById(a.getAttribute('href').slice(1)); })
      .filter(Boolean);
    var inicio = document.getElementById('inicio');
    if (inicio) secoes.unshift(inicio);

    // Faixa estreita no meio da tela: a seção que cruza essa faixa é a "atual"
    var espiao = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (en) {
        if (en.isIntersecting) marcarLink(en.target.id);
      });
    }, { rootMargin: '-45% 0px -50% 0px' });

    secoes.forEach(function (s) { espiao.observe(s); });
  }

  /* ---------------------------------------------------------
     4. REVELAR AO ROLAR (.revelar → .visivel)
     --------------------------------------------------------- */
  var revelaveis = $$('.revelar');

  if (poucoMovimento || !('IntersectionObserver' in window)) {
    // Sem animação ou navegador antigo: mostra tudo de uma vez
    revelaveis.forEach(function (el) { el.classList.add('visivel'); });
  } else {
    var revelador = new IntersectionObserver(function (entradas, obs) {
      entradas.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add('visivel');
          obs.unobserve(en.target); // revela uma vez só
        }
      });
    }, { threshold: 0.12 });
    revelaveis.forEach(function (el) { revelador.observe(el); });
  }

  /* ---------------------------------------------------------
     5. COPIAR E-MAIL + TOAST
     --------------------------------------------------------- */
  var toast = $('#toast');
  var campoEmail = $('#email');
  var timerToast;

  function mostrarToast(texto) {
    if (!toast) return;
    toast.textContent = texto;
    toast.classList.add('visivel');
    clearTimeout(timerToast);
    timerToast = setTimeout(function () { toast.classList.remove('visivel'); }, 2200);
  }

  // Plano B para navegadores sem a API de área de transferência
  function copiarAntigo(texto) {
    var area = document.createElement('textarea');
    area.value = texto;
    area.setAttribute('readonly', '');
    area.style.position = 'fixed';
    area.style.opacity = '0';
    document.body.appendChild(area);
    area.select();
    var deu = false;
    try { deu = document.execCommand('copy'); } catch (e) {}
    document.body.removeChild(area);
    return deu;
  }

  function copiarEmail() {
    if (!campoEmail) return;
    var texto = campoEmail.textContent.trim();
    var ok = function () { mostrarToast('> copiado ✓'); };
    var falhou = function () { mostrarToast('> copie: ' + texto); };

    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(texto).then(ok, function () {
        copiarAntigo(texto) ? ok() : falhou();
      });
    } else {
      copiarAntigo(texto) ? ok() : falhou();
    }
  }

  $$('.copiar-email').forEach(function (b) { b.addEventListener('click', copiarEmail); });
})();
