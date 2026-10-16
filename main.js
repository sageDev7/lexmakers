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
