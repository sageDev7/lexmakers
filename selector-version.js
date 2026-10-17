// TEMPORAL: herramienta para que la clienta elija colores.
// 1) Botones de versión (Verde / Verde + bordó / Azulado).
// 2) Modo «Colores»: una paleta en cada sección para cambiarle el fondo, y «Copiar elección» arma un resumen para mandar por WhatsApp.
// Para sacarlo: borrar este archivo, tema-pantone.css, tema-verde-bordo.css y las líneas marcadas «TEMPORAL» en index.html.
// Envío: «Enviar por WhatsApp» manda el resumen al WhatsApp de sageDev (WA_SAGEDEV).
// Links directos: index.html?v=bordo, index.html?v=pantone
(function () {
  var WA_SAGEDEV = '5492664645118';
  var VERSIONES = [
    { id: 'verde', nombre: 'Verde', punto: '#003636' },
    { id: 'bordo', nombre: 'Verde + bordó', punto: 'linear-gradient(135deg,#003636 50%,#6E1F2F 50%)' },
    { id: 'pantone', nombre: 'Azulado', punto: 'linear-gradient(135deg,#124556 50%,#6E1F2F 50%)' }
  ];
  var OSCUROS = [
    ['Verde', '#003636'], ['Verde medio', '#004A4A'], ['Verde profundo', '#002424'],
    ['Azulado', '#124556'], ['Azulado profundo', '#072430'], ['Bordó', '#4A1420'], ['Negro', '#0A0C0E']
  ];
  var CLAROS = [
    ['Blanco', '#FFFFFF'], ['Verde agua', '#E4F4F4'], ['Gris azulado', '#E8EFF1'], ['Gris claro', '#F1F3F4'], ['Rosado suave', '#F5ECEE']
  ];
  // Cada zona: dónde va la paleta, si es oscura o clara, y qué CSS genera el color elegido
  function rgba(hex, a) {
    var n = parseInt(hex.slice(1), 16);
    return 'rgba(' + (n >> 16) + ',' + ((n >> 8) & 255) + ',' + (n & 255) + ',' + a + ')';
  }
  function tintRadial(sel, x) {
    return sel + '{background:radial-gradient(ellipse 70% 75% at 50% 50%,' + rgba(x, .86) + ' 0%,' + rgba(x, .62) + ' 70%,' + rgba(x, .45) + ' 100%)}';
  }
  var ZONAS = [
    { id: 'navfoot', nombre: 'Navbar y footer', donde: '.site-footer', tono: 'o',
      css: function (x) { return 'html .site-header.scrolled,html #mnav,html .site-footer{background:' + x + '}'; } },
    { id: 'pilar1', nombre: 'Pilar 01 (Legal Tech)', donde: '.area-panel-dark', tono: 'o',
      css: function (x) { return 'html .area-panel-dark{background:' + x + '}'; } },
    { id: 'pilar2', nombre: 'Pilar 02 (Derecho Esencial)', donde: '.area-panel-light', tono: 'c',
      css: function (x) { return 'html .area-panel-light{background:' + x + '}'; } },
    { id: 'porque', nombre: 'Por qué elegirnos', donde: '#porque', tono: 'c',
      css: function (x) { return 'html #porque{background:' + x + '}' + (x !== '#FFFFFF' ? 'html #porque .porque-card{background:#fff}' : ''); } },
    { id: 'testimonios', nombre: 'Testimonios', donde: '#testimonios', tono: 'o',
      css: function (x) { return 'html #testimonios{background:' + x + '}' + tintRadial('html #testimonios .sec-video-tint', x); } },
    { id: 'nosotros', nombre: 'Quiénes somos', donde: '#nosotros', tono: 'c',
      css: function (x) { return 'html #nosotros{background:' + x + '}'; } },
    { id: 'cita', nombre: 'Cita de Quiénes somos', donde: '.nosotros-quote', tono: 'o',
      css: function (x) { return 'html .nosotros-quote{background:' + x + '}'; } },
    { id: 'instagram', nombre: 'Franja de Instagram', donde: '.social-strip', tono: 'o',
      css: function (x) { return 'html .social-tint{background:linear-gradient(100deg,' + rgba(x, .88) + ' 10%,' + rgba(x, .62) + ' 60%,' + rgba(x, .45) + ' 100%)}'; } },
    { id: 'contacto', nombre: 'Contacto (fondo)', donde: '#contacto', tono: 'c',
      css: function (x) { return 'html #contacto{background:' + x + '}'; } },
    { id: 'contactoPanel', nombre: 'Contacto (panel de datos)', donde: '.contacto-info', tono: 'o',
      css: function (x) { return 'html .contacto-info{background:' + x + '}'; } },
    { id: 'newsletter', nombre: 'Newsletter', donde: '#newsletter', tono: 'o',
      css: function (x) { return 'html #newsletter{background:' + x + '}' + tintRadial('html #newsletter .sec-video-tint', x); } }
  ];

  function leer(k, def) { try { var v = localStorage.getItem(k); return v ? JSON.parse(v) : def; } catch (e) { return def; } }
  function guardar(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }

  var hojas = {};
  document.querySelectorAll('link[data-tema]').forEach(function (l) { hojas[l.getAttribute('data-tema')] = l; });
  var elegidos = leer('lexColores', {});
  var version = 'verde';
  var modoColores = false;

  // ---------- Estilos de la herramienta ----------
  var css = document.createElement('style');
  css.textContent =
    '.vsw{position:fixed;left:18px;bottom:18px;z-index:9000;display:flex;flex-wrap:wrap;max-width:calc(100vw - 110px);background:rgba(10,12,14,.86);' +
    '-webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px);border:1px solid rgba(255,255,255,.18);box-shadow:0 6px 18px rgba(0,0,0,.25)}' +
    '.vsw button{display:flex;align-items:center;gap:8px;padding:10px 13px;background:transparent;border:0;' +
    'color:rgba(255,255,255,.62);font:700 .72rem/1 Manrope,sans-serif;letter-spacing:.07em;text-transform:uppercase;cursor:pointer;white-space:nowrap}' +
    '.vsw button[aria-pressed="true"]{color:#fff;background:rgba(255,255,255,.12)}' +
    '.vsw .pt{width:12px;height:12px;border-radius:50%;flex-shrink:0;border:1px solid rgba(255,255,255,.4)}' +
    '.vsw .sep{width:1px;background:rgba(255,255,255,.18)}' +
    '.vsw .extra{display:none}.vsw.on .extra{display:flex}' +
    '.vsw-msg{position:fixed;left:18px;bottom:72px;z-index:9001;max-width:min(420px,calc(100vw - 36px));background:#0A0C0E;color:#fff;' +
    'border:1px solid rgba(255,255,255,.2);padding:14px;font:500 .85rem/1.5 Manrope,sans-serif;box-shadow:0 10px 30px rgba(0,0,0,.35)}' +
    '.vsw-msg textarea{width:100%;height:160px;margin-top:8px;font:500 .8rem/1.45 Manrope,sans-serif;color:#111;padding:8px;box-sizing:border-box}' +
    '.vsw-zona{position:absolute;top:92px;right:12px;z-index:60;display:flex;flex-direction:column;align-items:flex-end;gap:6px;font:700 .7rem/1 Manrope,sans-serif}' +
    '.vsw-zona>button{display:flex;align-items:center;gap:7px;padding:8px 11px;background:rgba(10,12,14,.86);color:#fff;border:1px solid rgba(255,255,255,.3);' +
    'letter-spacing:.06em;text-transform:uppercase;cursor:pointer;font:inherit;box-shadow:0 4px 12px rgba(0,0,0,.25)}' +
    '.vsw-zona>button .pt{width:12px;height:12px;border-radius:50%;border:1px solid rgba(255,255,255,.5)}' +
    '.vsw-sw{display:none;flex-direction:column;gap:2px;min-width:200px;padding:6px;background:rgba(10,12,14,.94);border:1px solid rgba(255,255,255,.2)}' +
    '.vsw-zona.abierta .vsw-sw{display:flex}' +
    '.vsw-sw button{display:flex;align-items:center;gap:10px;padding:7px 8px;background:transparent;border:1px solid transparent;color:#fff;cursor:pointer;' +
    'font:600 .76rem/1.2 Manrope,sans-serif;text-align:left;text-transform:none;letter-spacing:0}' +
    '.vsw-sw button:hover{background:rgba(255,255,255,.08)}' +
    '.vsw-sw button[aria-pressed="true"]{border-color:rgba(255,255,255,.55);background:rgba(255,255,255,.1)}' +
    '.vsw-sw .dot{width:22px;height:22px;border-radius:50%;flex-shrink:0;border:1px solid rgba(255,255,255,.45)}' +
    '.vsw-sw small{margin-left:auto;padding-left:10px;font:700 .7rem/1 monospace;color:rgba(255,255,255,.6)}' +
    '.vsw-zona>button small{font:700 .66rem/1 monospace;color:rgba(255,255,255,.7);text-transform:none}' +
    '.vsw .wa{background:#1E9E52;color:#fff}' +
    '@media (max-width:480px){.vsw{left:10px;bottom:10px}.vsw button{padding:9px 9px;font-size:.64rem}.vsw-zona{top:10px;right:8px}}' +
    '@media print{.vsw,.vsw-zona{display:none}}';
  document.head.appendChild(css);
  var dinamico = document.createElement('style');
  document.head.appendChild(dinamico);

  // ---------- Barra principal ----------
  var bar = document.createElement('div');
  bar.className = 'vsw';
  bar.setAttribute('role', 'group');
  bar.setAttribute('aria-label', 'Elegir colores');
  bar.innerHTML = VERSIONES.map(function (v) {
    return '<button type="button" data-v="' + v.id + '"><span class="pt" style="background:' + v.punto + '"></span>' + v.nombre + '</button>';
  }).join('') +
    '<span class="sep"></span><button type="button" data-a="colores"><i class="ti ti-palette"></i>Colores por sección</button>' +
    '<button type="button" class="extra wa" data-a="enviar"><i class="ti ti-brand-whatsapp"></i>Enviar por WhatsApp</button>' +
    '<button type="button" class="extra" data-a="copiar"><i class="ti ti-copy"></i>Copiar elección</button>' +
    '<button type="button" class="extra" data-a="reset"><i class="ti ti-refresh"></i>Restablecer</button>';
  document.body.appendChild(bar);

  function setVersion(v) {
    version = v;
    Object.keys(hojas).forEach(function (k) { hojas[k].media = k === v ? 'all' : 'not all'; });
    bar.querySelectorAll('[data-v]').forEach(function (b) { b.setAttribute('aria-pressed', String(b.dataset.v === v)); });
    guardar('lexVersion', v);
  }

  // ---------- Paletas por sección ----------
  function aplicarColores() {
    dinamico.textContent = ZONAS.map(function (z) { return elegidos[z.id] ? z.css(elegidos[z.id]) : ''; }).join('');
    document.querySelectorAll('.vsw-zona').forEach(function (box) {
      var x = elegidos[box.dataset.z];
      box.querySelector('.pt').style.background = x || 'transparent';
      box.querySelector('.vsw-toggle small').textContent = x || '';
      box.querySelectorAll('.vsw-sw button').forEach(function (b) {
        b.setAttribute('aria-pressed', String((b.dataset.c || '') === (x || '')));
      });
    });
    guardar('lexColores', elegidos);
  }

  function crearPaletas() {
    ZONAS.forEach(function (z) {
      var el = document.querySelector(z.donde);
      if (!el) return;
      if (getComputedStyle(el).position === 'static') el.style.position = 'relative';
      var lista = z.tono === 'o' ? OSCUROS : CLAROS;
      var box = document.createElement('div');
      box.className = 'vsw-zona';
      box.dataset.z = z.id;
      box.hidden = true;
      box.innerHTML = '<button type="button" class="vsw-toggle"><span class="pt"></span>' + z.nombre + ' <small></small></button>' +
        '<div class="vsw-sw">' + lista.map(function (c) {
          return '<button type="button" data-c="' + c[1] + '"><span class="dot" style="background:' + c[1] + '"></span>' + c[0] + '<small>' + c[1] + '</small></button>';
        }).join('') + '<button type="button" data-c=""><span class="dot"></span>Original del diseño</button></div>';
      el.appendChild(box);
      box.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        var b = e.target.closest('button');
        if (!b) return;
        if (b.classList.contains('vsw-toggle')) { box.classList.toggle('abierta'); return; }
        if (b.dataset.c) elegidos[z.id] = b.dataset.c; else delete elegidos[z.id];
        aplicarColores();
        box.classList.remove('abierta');
      });
    });
  }

  function nombreColor(hex) {
    var todos = OSCUROS.concat(CLAROS);
    for (var i = 0; i < todos.length; i++) if (todos[i][1] === hex) return todos[i][0] + ' (' + hex + ')';
    return hex;
  }
  function resumen() {
    var v = VERSIONES.filter(function (x) { return x.id === version; })[0];
    var lineas = ['Lex Makers: mi elección de colores', 'Versión: ' + v.nombre];
    ZONAS.forEach(function (z) { if (elegidos[z.id]) lineas.push('- ' + z.nombre + ': ' + nombreColor(elegidos[z.id])); });
    if (lineas.length === 2) lineas.push('(sin cambios por sección)');
    return lineas.join('\n');
  }
  var msg = null;
  function mostrar(html) {
    if (msg) msg.remove();
    msg = document.createElement('div');
    msg.className = 'vsw-msg';
    msg.innerHTML = html;
    document.body.appendChild(msg);
    msg.addEventListener('click', function (e) { if (e.target.closest('[data-cerrar]')) { msg.remove(); msg = null; } });
  }
  function copiar() {
    var txt = resumen();
    var ok = function () {
      mostrar('Copiado. Pegalo en WhatsApp para mandar tu elección. <button type="button" data-cerrar style="margin-left:8px;background:none;border:0;color:#fff;cursor:pointer;font-weight:700">OK</button>');
      setTimeout(function () { if (msg) { msg.remove(); msg = null; } }, 3500);
    };
    var manual = function () {
      mostrar('Copiá este texto y mandalo por WhatsApp: <button type="button" data-cerrar style="float:right;background:none;border:0;color:#fff;cursor:pointer;font-weight:700">Cerrar</button><textarea readonly></textarea>');
      var ta = msg.querySelector('textarea');
      ta.value = txt;
      ta.focus();
      ta.select();
    };
    if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(txt).then(ok, manual);
    else manual();
  }

  bar.addEventListener('click', function (e) {
    var b = e.target.closest('button');
    if (!b) return;
    if (b.dataset.v) return setVersion(b.dataset.v);
    if (b.dataset.a === 'colores') {
      modoColores = !modoColores;
      bar.classList.toggle('on', modoColores);
      b.setAttribute('aria-pressed', String(modoColores));
      document.querySelectorAll('.vsw-zona').forEach(function (z) { z.hidden = !modoColores; z.classList.remove('abierta'); });
    } else if (b.dataset.a === 'enviar') {
      window.open('https://wa.me/' + WA_SAGEDEV + '?text=' + encodeURIComponent(resumen()), '_blank', 'noopener');
    } else if (b.dataset.a === 'copiar') {
      copiar();
    } else if (b.dataset.a === 'reset') {
      elegidos = {};
      aplicarColores();
    }
  });

  var q = location.search.match(/[?&]v=(\w+)/);
  var inicial = q ? q[1] : leer('lexVersion', 'verde');
  if (!VERSIONES.some(function (v) { return v.id === inicial; })) inicial = 'verde';
  crearPaletas();
  setVersion(inicial);
  aplicarColores();
})();
