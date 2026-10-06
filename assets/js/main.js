/* Virada Fest 2027 — comportamento da página. Para links e integrações, edite config.js */
(function () {
  'use strict';
  var C = window.VF_CONFIG || {};

  function waLink() {
    var num = String(C.whatsapp || '').replace(/\D/g, '');
    if (!num) return '';
    return 'https://wa.me/' + num + (C.whatsappMensagem ? '?text=' + encodeURIComponent(C.whatsappMensagem) : '');
  }

  /* ---------- Links de compra (uma única fonte: config.js) ---------- */
  var comprar = String(C.comprarUrl || '').trim();
  var wa = waLink();
  // Antes da data de abertura (config.js > vendasAbremEm) os botões mostram um aviso em vez do link.
  var abre = C.vendasAbremEm ? new Date(C.vendasAbremEm) : null;
  var vendasAbertas = !!comprar && (!abre || isNaN(abre) || Date.now() >= abre.getTime());

  var aviso = document.getElementById('aviso-vendas');
  var avisoTexto = document.getElementById('aviso-texto');
  var avisoWa = document.getElementById('aviso-wa');
  if (avisoTexto && C.vendasAviso) avisoTexto.textContent = C.vendasAviso;
  if (avisoWa) {
    var numAviso = String(C.whatsapp || '').replace(/\D/g, '');
    if (numAviso) avisoWa.href = 'https://wa.me/' + numAviso + '?text=' + encodeURIComponent('Olá! Quero ser avisado quando abrirem as vendas do Réveillon Virada Fest 2027.');
    else avisoWa.hidden = true;
  }
  var focoAntes = null;
  function abrirAviso() { focoAntes = document.activeElement; aviso.hidden = false; document.body.style.overflow = 'hidden'; aviso.querySelector('.aviso__fechar').focus(); }
  function fecharAviso() { aviso.hidden = true; document.body.style.overflow = ''; if (focoAntes) focoAntes.focus(); }
  if (aviso) {
    aviso.querySelectorAll('[data-fechar]').forEach(function (el) { el.addEventListener('click', fecharAviso); });
    aviso.addEventListener('click', function (e) { if (e.target === aviso) fecharAviso(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !aviso.hidden) fecharAviso(); });
  }

  document.querySelectorAll('.js-comprar').forEach(function (a) {
    if (vendasAbertas) {
      a.href = comprar; a.target = '_blank'; a.rel = 'noopener';
      a.addEventListener('click', function () {
        if (window.gtag) window.gtag('event', 'begin_checkout', { link_url: a.href });
        if (window.fbq) window.fbq('track', 'InitiateCheckout');
      });
    } else {
      a.href = '#comprar';
      a.addEventListener('click', function (e) {
        e.preventDefault();
        if (aviso) abrirAviso();
        if (window.gtag) window.gtag('event', 'interesse_pre_venda');
        if (window.fbq) window.fbq('trackCustom', 'InteressePreVenda');
      });
    }
  });
  if (!vendasAbertas) {
    var note = document.getElementById('cta-note');
    if (note) { note.textContent = C.vendasAviso || note.textContent; note.hidden = false; }
  }

  /* ---------- WhatsApp e Instagram ---------- */
  document.querySelectorAll('.js-whatsapp').forEach(function (a) {
    if (wa) {
      a.href = wa;
      a.addEventListener('click', function () {
        if (window.gtag) window.gtag('event', 'contact', { method: 'whatsapp' });
        if (window.fbq) window.fbq('track', 'Contact');
      });
    } else a.hidden = true;
  });
  if (C.instagram) document.querySelectorAll('.js-instagram').forEach(function (a) { a.href = C.instagram; });


  /* ---------- Preços dos setores (config.js > precos) ---------- */
  var P = C.precos || {};
  document.querySelectorAll('.js-preco').forEach(function (el) {
    var v = P[el.dataset.preco];
    if (v) { el.textContent = v; el.hidden = false; }
  });
  var notaPreco = document.querySelector('.js-preco-nota');
  if (notaPreco && P.nota && (P.premium || P.mesa)) { notaPreco.textContent = P.nota; notaPreco.hidden = false; }


  /* ---------- Contador: até a abertura das vendas e, depois, até a virada ---------- */
  (function contador() {
    var box = document.getElementById('contador');
    if (!box) return;
    var label = document.getElementById('contador-label');
    var el = { d: document.getElementById('cd-dias'), h: document.getElementById('cd-horas'), m: document.getElementById('cd-min'), s: document.getElementById('cd-seg') };
    var vendas = C.vendasAbremEm ? new Date(C.vendasAbremEm).getTime() : NaN;
    var virada = new Date(C.viradaEm || '2027-01-01T00:00:00-03:00').getTime();
    function dois(n) { return (n < 10 ? '0' : '') + n; }
    function tick() {
      var agora = Date.now(), alvo, texto;
      if (!isNaN(vendas) && agora < vendas) { alvo = vendas; texto = 'Vendas do 1º lote abrem em'; }
      else if (agora < virada) { alvo = virada; texto = 'Faltam para a virada'; }
      else { box.hidden = true; return; }
      var t = Math.floor((alvo - agora) / 1000);
      el.d.textContent = dois(Math.floor(t / 86400));
      el.h.textContent = dois(Math.floor(t % 86400 / 3600));
      el.m.textContent = dois(Math.floor(t % 3600 / 60));
      el.s.textContent = dois(t % 60);
      if (label.textContent !== texto) label.textContent = texto;
      box.hidden = false;
    }
    tick();
    setInterval(tick, 1000);
  })();


  /* ---------- Lista de WhatsApps no rodapé ---------- */
  (function listaWa() {
    var li = document.querySelector('.js-wa-lista');
    if (!li) return;
    var nums = [C.whatsapp].concat(C.whatsappContatos || []).map(function (n) { return String(n || '').replace(/\D/g, ''); }).filter(Boolean);
    nums = nums.filter(function (n, i) { return nums.indexOf(n) === i; });
    if (!nums.length) return;
    function fmt(n) {
      var d = n.replace(/^55/, '');
      return d.length === 11 ? '(' + d.slice(0, 2) + ') ' + d.slice(2, 7) + '-' + d.slice(7) : d;
    }
    var msg = C.whatsappMensagem ? '?text=' + encodeURIComponent(C.whatsappMensagem) : '';
    var html = nums.map(function (n) {
      return '<li><a href="https://wa.me/' + n + msg + '" target="_blank" rel="noopener">WhatsApp ' + fmt(n) + '</a></li>';
    }).join('');
    li.insertAdjacentHTML('afterend', html);
    li.remove();
  })();

  /* ---------- Rodapé ---------- */
  var ano = document.getElementById('ano');
  if (ano) ano.textContent = new Date().getFullYear();
  if (C.producao) {
    var p = document.getElementById('producao');
    if (p) p.textContent = ' Produção e realização: ' + C.producao + '.';
  }

  /* ---------- Cabeçalho: transparente na capa, creme após rolar ---------- */
  var header = document.querySelector('.header');
  var waFloat = document.querySelector('.wa-float');
  function onScroll() {
    header.classList.toggle('is-solid', window.scrollY > 40);
    if (waFloat) waFloat.classList.toggle('is-hidden', window.innerWidth < 960 && window.scrollY < window.innerHeight * 0.6);
  }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---------- Menu do celular ---------- */
  var toggle = document.querySelector('.menu-toggle');
  function setMenu(open) {
    header.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    toggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
  }
  toggle.addEventListener('click', function () { setMenu(!header.classList.contains('is-open')); });
  document.querySelectorAll('.nav a').forEach(function (a) { a.addEventListener('click', function () { setMenu(false); }); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setMenu(false); });

  /* ---------- Galeria: setas + lightbox com gestos ---------- */
  var track = document.getElementById('galeria-lista');
  document.querySelectorAll('[data-scroll]').forEach(function (b) {
    b.addEventListener('click', function () {
      track.scrollBy({ left: Number(b.dataset.scroll) * track.clientWidth * 0.8, behavior: 'smooth' });
    });
  });

  var items = Array.prototype.slice.call(track.querySelectorAll('button[data-full]'));
  var lb = document.getElementById('lightbox');
  var lbImg = document.getElementById('lightbox-img');
  var current = 0, lastFocus = null;
  function show(i) {
    current = (i + items.length) % items.length;
    var btn = items[current];
    lbImg.src = btn.dataset.full;
    lbImg.alt = btn.querySelector('img').alt;
  }
  function openLb(i) { lastFocus = document.activeElement; show(i); lb.hidden = false; document.body.style.overflow = 'hidden'; lb.querySelector('.lightbox__close').focus(); }
  function closeLb() { lb.hidden = true; document.body.style.overflow = ''; if (lastFocus) lastFocus.focus(); }
  items.forEach(function (btn, i) { btn.addEventListener('click', function () { openLb(i); }); });
  lb.querySelector('.lightbox__close').addEventListener('click', closeLb);
  lb.querySelector('.lightbox__prev').addEventListener('click', function () { show(current - 1); });
  lb.querySelector('.lightbox__next').addEventListener('click', function () { show(current + 1); });
  lb.addEventListener('click', function (e) { if (e.target === lb) closeLb(); });
  document.addEventListener('keydown', function (e) {
    if (lb.hidden) return;
    if (e.key === 'Escape') closeLb();
    if (e.key === 'ArrowLeft') show(current - 1);
    if (e.key === 'ArrowRight') show(current + 1);
  });
  var touchX = null;
  lb.addEventListener('touchstart', function (e) { touchX = e.touches[0].clientX; }, { passive: true });
  lb.addEventListener('touchend', function (e) {
    if (touchX === null) return;
    var dx = e.changedTouches[0].clientX - touchX;
    if (Math.abs(dx) > 40) show(current + (dx < 0 ? 1 : -1));
    touchX = null;
  });

  /* ---------- Vídeo (só aparece se videoUrl estiver configurado) ---------- */
  var videoUrl = String(C.videoUrl || '').trim();
  if (videoUrl) {
    var section = document.getElementById('video');
    var frame = document.getElementById('video-frame');
    var cover = document.getElementById('video-cover');
    var poster = document.getElementById('video-poster');
    section.hidden = false;
    poster.src = C.videoCapa || 'assets/img/local-lounge-900.webp';
    var yt = videoUrl.match(/(?:youtu\.be\/|v=|embed\/|shorts\/)([\w-]{11})/);
    cover.addEventListener('click', function () {
      var el;
      if (yt) {
        el = document.createElement('iframe');
        el.src = 'https://www.youtube-nocookie.com/embed/' + yt[1] + '?autoplay=1&mute=1&rel=0&playsinline=1';
        el.allow = 'autoplay; encrypted-media; picture-in-picture';
        el.allowFullscreen = true;
        el.title = 'Vídeo do Virada Fest';
      } else {
        el = document.createElement('video');
        el.src = videoUrl; el.controls = true; el.muted = true; el.autoplay = true; el.playsInline = true;
      }
      frame.innerHTML = '';
      frame.appendChild(el);
    });
  }


  /* ---------- Fogos discretos no céu da capa ---------- */
  (function fogos() {
    var canvas = document.getElementById('fogos');
    if (!canvas || !canvas.getContext) return;
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    var ctx = canvas.getContext('2d');
    var hero = canvas.parentElement;
    var W = 0, H = 0, dpr = Math.min(window.devicePixelRatio || 1, 2);
    var cores = ['#E4CFA4', '#C9A66B', '#F6EFE3', '#E8A27C'];
    var rockets = [], sparks = [], visivel = true, ultimo = 0, proximo = 600, rodando = false;

    function resize() {
      W = canvas.clientWidth; H = canvas.clientHeight;
      canvas.width = W * dpr; canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    function lancar() {
      var desk = W >= 960;
      // no computador os fogos ficam à direita (céu livre); no celular, na parte de cima
      var x = desk ? W * (0.55 + Math.random() * 0.4) : W * (0.15 + Math.random() * 0.7);
      var alvo = desk ? H * (0.12 + Math.random() * 0.25) : H * (0.08 + Math.random() * 0.18);
      var inicio = desk ? H * 0.62 : H * 0.3;
      rockets.push({ x: x, y: inicio, alvo: alvo, vy: -((inicio - alvo) * 0.035 + 2), cor: cores[(Math.random() * cores.length) | 0] });
    }
    function explodir(r) {
      var n = 34 + ((Math.random() * 16) | 0);
      for (var i = 0; i < n; i++) {
        var a = (Math.PI * 2 * i) / n, v = 1.2 + Math.random() * 1.8;
        sparks.push({ x: r.x, y: r.y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, vida: 1, dec: 0.009 + Math.random() * 0.008, cor: r.cor });
      }
    }
    function frame(t) {
      if (!visivel) { rodando = false; return; }
      rodando = true;
      ctx.globalCompositeOperation = 'destination-out';
      ctx.fillStyle = 'rgba(0,0,0,0.22)';
      ctx.fillRect(0, 0, W, H);
      ctx.globalCompositeOperation = 'lighter';
      if (t - ultimo > proximo) { lancar(); ultimo = t; proximo = 1400 + Math.random() * 1800; }
      for (var i = rockets.length - 1; i >= 0; i--) {
        var r = rockets[i];
        r.y += r.vy; r.vy *= 0.985;
        ctx.fillStyle = r.cor; ctx.globalAlpha = 0.8;
        ctx.fillRect(r.x, r.y, 1.6, 4);
        if (r.y <= r.alvo || r.vy > -1) { explodir(r); rockets.splice(i, 1); }
      }
      for (var j = sparks.length - 1; j >= 0; j--) {
        var s = sparks[j];
        s.x += s.vx; s.y += s.vy; s.vy += 0.025; s.vx *= 0.985; s.vy *= 0.985; s.vida -= s.dec;
        if (s.vida <= 0) { sparks.splice(j, 1); continue; }
        ctx.globalAlpha = s.vida * 0.85;
        ctx.fillStyle = s.cor;
        ctx.beginPath(); ctx.arc(s.x, s.y, 1.5, 0, Math.PI * 2); ctx.fill();
      }
      ctx.globalAlpha = 1;
      requestAnimationFrame(frame);
    }
    function ligar() { if (!rodando && visivel) requestAnimationFrame(frame); }
    resize();
    window.addEventListener('resize', resize);
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (e) { visivel = e[0].isIntersecting && !document.hidden; ligar(); }).observe(hero);
    }
    document.addEventListener('visibilitychange', function () { visivel = !document.hidden; ligar(); });
    ligar();
  })();

  /* ---------- Google Analytics 4 e Meta Pixel (opcionais) ---------- */
  if (C.ga4Id) {
    var s = document.createElement('script');
    s.async = true; s.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(C.ga4Id);
    document.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', C.ga4Id);
  }
  if (C.metaPixelId) {
    /* eslint-disable */
    !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
    /* eslint-enable */
    window.fbq('init', String(C.metaPixelId));
    window.fbq('track', 'PageView');
  }
})();
