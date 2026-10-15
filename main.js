// Header: transparente -> sólido al scrollear. WhatsApp flotante: aparece apenas se scrollea
(function () {
  var header = document.getElementById('siteHeader');
  var waFloat = document.getElementById('waFloat');
  if (!header) return;
  function onScroll() {
    var scrolled = window.scrollY > 40;
    header.classList.toggle('scrolled', scrolled);
    if (waFloat) waFloat.classList.toggle('visible', scrolled);
  }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
})();

// Menú mobile (hamburguesa + panel deslizante + overlay)
(function () {
  var burger = document.getElementById('burger');
  var mnav = document.getElementById('mnav');
  var overlay = document.getElementById('moverlay');
  if (!burger || !mnav || !overlay) return;

  function closeMenu() {
    burger.classList.remove('active');
    mnav.classList.remove('active');
    overlay.classList.remove('active');
    burger.setAttribute('aria-expanded', 'false');
  }
  function toggleMenu() {
    var isOpen = mnav.classList.toggle('active');
    burger.classList.toggle('active', isOpen);
    overlay.classList.toggle('active', isOpen);
    burger.setAttribute('aria-expanded', String(isOpen));
  }

  burger.addEventListener('click', toggleMenu);
  burger.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleMenu(); }
  });
  overlay.addEventListener('click', closeMenu);
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeMenu();
  });
  mnav.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', closeMenu);
  });
})();

// Botón volver arriba: aparece después del hero, se oculta cerca del footer
(function () {
  var topFloat = document.getElementById('topFloat');
  var waFloat = document.getElementById('waFloat');
  var hero = document.getElementById('top');
  var footer = document.getElementById('siteFooter');
  if (!topFloat) return;

  topFloat.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  if (hero && 'IntersectionObserver' in window) {
    var heroObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        topFloat.classList.toggle('visible', !entry.isIntersecting);
      });
    }, { threshold: 0 });
    heroObserver.observe(hero);
  }

  if (footer && 'IntersectionObserver' in window) {
    var footerObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (waFloat) waFloat.classList.toggle('hidden', entry.isIntersecting);
        topFloat.classList.toggle('hidden', entry.isIntersecting);
      });
    }, { threshold: 0.01 });
    footerObserver.observe(footer);
  }
})();

// Video del hero -> variante anterior con ?hero=1; se detiene si el usuario pidió "reducir movimiento"
(function () {
  var video = document.getElementById('heroVideo');
  if (!video) return;
  if (/[?&]hero=1(&|$)/.test(location.search)) {
    video.poster = 'tech-bg.jpg';
    video.querySelector('source').src = 'hero-silver-opt.mp4';
    video.load();
  }
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
    video.removeAttribute('autoplay');
    video.pause();
  }
})();

// Videos de fondo de secciones: se cargan al acercarse y solo se reproducen mientras están en pantalla
(function () {
  var vids = document.querySelectorAll('video[data-src]');
  if (!vids.length || !('IntersectionObserver' in window)) return;
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      var v = e.target;
      if (e.isIntersecting) {
        if (!v.getAttribute('src')) v.src = v.dataset.src;
        var p = v.play();
        if (p && p.catch) p.catch(function () {});
      } else {
        v.pause();
      }
    });
  }, { rootMargin: '200px 0px' });
  vids.forEach(function (v) { io.observe(v); });
})();

// Galería del estudio -> lightbox con flechas, teclado y swipe
(function () {
  var items = document.querySelectorAll('.g-item');
  var lb = document.getElementById('lightbox');
  if (!items.length || !lb) return;
  var img = lb.querySelector('.lb-img');
  var count = lb.querySelector('.lb-count');
  var closeBtn = lb.querySelector('.lb-close');
  var idx = 0, last = null, x0 = null;

  function show(i) {
    idx = (i + items.length) % items.length;
    var src = items[idx].querySelector('img');
    img.src = src.src;
    img.alt = src.alt;
    count.textContent = (idx + 1) + ' / ' + items.length;
  }
  function open(i) {
    last = document.activeElement;
    show(i);
    lb.hidden = false;
    document.documentElement.classList.add('lb-open');
    closeBtn.focus();
  }
  function close() {
    lb.hidden = true;
    document.documentElement.classList.remove('lb-open');
    if (last) last.focus();
  }

  items.forEach(function (b, i) { b.addEventListener('click', function () { open(i); }); });
  closeBtn.addEventListener('click', close);
  lb.querySelector('.lb-prev').addEventListener('click', function () { show(idx - 1); });
  lb.querySelector('.lb-next').addEventListener('click', function () { show(idx + 1); });
  lb.addEventListener('click', function (e) { if (e.target === lb) close(); });
  document.addEventListener('keydown', function (e) {
    if (lb.hidden) return;
    if (e.key === 'Escape') close();
    else if (e.key === 'ArrowLeft') show(idx - 1);
    else if (e.key === 'ArrowRight') show(idx + 1);
  });
  lb.addEventListener('touchstart', function (e) { x0 = e.touches[0].clientX; }, { passive: true });
  lb.addEventListener('touchend', function (e) {
    if (x0 === null) return;
    var dx = e.changedTouches[0].clientX - x0;
    if (Math.abs(dx) > 50) show(idx + (dx < 0 ? 1 : -1));
    x0 = null;
  });
})();

// Newsletter -> envía a MailerLite vía iframe oculto; confirmación optimista (no se puede leer la respuesta cross-origin)
(function () {
  var form = document.getElementById('newsletterForm');
  var status = document.getElementById('newsletterStatus');
  if (!form || !status) return;
  form.addEventListener('submit', function () {
    setTimeout(function () {
      status.hidden = false;
      form.reset();
    }, 600);
  });
})();

// Formulario de contacto -> FormSubmit.co
(function () {
  var form = document.getElementById('contactForm');
  var status = document.getElementById('formStatus');
  if (!form || !status) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    if (form._honey && form._honey.value) return;

    var submitBtn = form.querySelector('button[type="submit"]');
    var originalLabel = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Enviando...';
    status.textContent = '';
    status.className = 'form-status';

    fetch(form.action, {
      method: 'POST',
      body: new FormData(form),
      headers: { 'Accept': 'application/json' }
    })
      .then(function (res) { return res.json(); })
      .then(function (data) {
        if (data && data.success === 'true') {
          status.textContent = 'Mensaje enviado. Te vamos a contactar a la brevedad.';
          status.className = 'form-status success';
          form.reset();
        } else {
          throw new Error('server-error');
        }
      })
      .catch(function () {
        status.textContent = 'No pudimos enviar tu mensaje. Probá de nuevo o escribinos por WhatsApp.';
        status.className = 'form-status error';
      })
      .finally(function () {
        submitBtn.disabled = false;
        submitBtn.textContent = originalLabel;
      });
  });
})();
