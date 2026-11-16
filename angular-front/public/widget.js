/*
 * Akwaba — script d'installation du widget de chat.
 * Sur le site du client :
 *   <script src="https://<domaine-akwaba>/widget.js" data-akwaba-key="CLE" async></script>
 * Ajoute une bulle en bas à droite qui ouvre la fenêtre de chat (iframe /widget/CLE).
 */
(function () {
  var script = document.currentScript;
  var key = script && script.getAttribute('data-akwaba-key');
  if (!key || window.__akwabaLoaded) return;
  window.__akwabaLoaded = true;

  var origin = new URL(script.src).origin;
  var color = script.getAttribute('data-akwaba-color') || '#0f766e';

  var frame = document.createElement('iframe');
  frame.src = origin + '/widget/' + encodeURIComponent(key);
  frame.title = 'Assistant du service client';
  frame.style.cssText =
    'position:fixed;bottom:96px;right:20px;width:370px;max-width:calc(100vw - 40px);height:560px;' +
    'max-height:calc(100vh - 120px);border:0;border-radius:16px;box-shadow:0 12px 40px rgba(0,0,0,.25);' +
    'z-index:2147483646;display:none;background:#fff';

  var button = document.createElement('button');
  button.type = 'button';
  button.setAttribute('aria-label', 'Ouvrir le chat');
  button.style.cssText =
    'position:fixed;bottom:20px;right:20px;width:60px;height:60px;border-radius:50%;border:0;cursor:pointer;' +
    'background:' + color + ';color:#fff;box-shadow:0 8px 24px rgba(0,0,0,.25);z-index:2147483647;' +
    'display:flex;align-items:center;justify-content:center';
  var chatIcon =
    '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ' +
    'stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>';
  var closeIcon =
    '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" ' +
    'stroke-linecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>';
  button.innerHTML = chatIcon;

  button.addEventListener('click', function () {
    var open = frame.style.display === 'none';
    frame.style.display = open ? 'block' : 'none';
    button.innerHTML = open ? closeIcon : chatIcon;
    button.setAttribute('aria-label', open ? 'Fermer le chat' : 'Ouvrir le chat');
  });

  function mount() {
    document.body.appendChild(frame);
    document.body.appendChild(button);
  }
  if (document.body) mount();
  else document.addEventListener('DOMContentLoaded', mount);
})();
