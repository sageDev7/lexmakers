// TEMPORAL: botón para mostrarle a la clienta las dos versiones de color.
// Para sacarlo: borrar este archivo, tema-pantone.css y sus dos líneas en index.html.
// También se puede abrir directo con index.html?v=pantone
(function () {
  var sheet = document.getElementById('temaAlt');
  if (!sheet) return;

  var css = document.createElement('style');
  css.textContent =
    '.vsw{position:fixed;left:18px;bottom:18px;z-index:9000;display:flex;background:rgba(10,12,14,.82);' +
    '-webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px);border:1px solid rgba(255,255,255,.18);' +
    'font-family:Manrope,sans-serif;box-shadow:0 6px 18px rgba(0,0,0,.25)}' +
    '.vsw button{display:flex;align-items:center;gap:8px;padding:10px 14px;background:transparent;border:0;' +
    'color:rgba(255,255,255,.6);font:700 .74rem/1 Manrope,sans-serif;letter-spacing:.08em;text-transform:uppercase;cursor:pointer}' +
    '.vsw button[aria-pressed="true"]{color:#fff;background:rgba(255,255,255,.1)}' +
    '.vsw i{width:12px;height:12px;border-radius:50%;flex-shrink:0;border:1px solid rgba(255,255,255,.4)}' +
    '@media (max-width:480px){.vsw{left:12px;bottom:12px}.vsw button{padding:9px 10px;font-size:.68rem}}' +
    '@media print{.vsw{display:none}}';
  document.head.appendChild(css);

  var box = document.createElement('div');
  box.className = 'vsw';
  box.setAttribute('role', 'group');
  box.setAttribute('aria-label', 'Versión de color');
  box.innerHTML =
    '<button type="button" data-v="verde"><i style="background:#003636"></i>Verde</button>' +
    '<button type="button" data-v="pantone"><i style="background:linear-gradient(135deg,#124556 50%,#6E1F2F 50%)"></i>Azulado</button>';
  document.body.appendChild(box);

  function set(v) {
    sheet.media = v === 'pantone' ? 'all' : 'not all';
    box.querySelectorAll('button').forEach(function (b) {
      b.setAttribute('aria-pressed', String(b.dataset.v === v));
    });
    try { localStorage.setItem('lexVersion', v); } catch (e) {}
  }

  var inicial = /[?&]v=pantone(&|$)/.test(location.search) ? 'pantone' : 'verde';
  if (!/[?&]v=/.test(location.search)) {
    try { inicial = localStorage.getItem('lexVersion') || inicial; } catch (e) {}
  }
  set(inicial);
  box.addEventListener('click', function (e) {
    var b = e.target.closest('button');
    if (b) set(b.dataset.v);
  });
})();
