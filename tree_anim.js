
// Fixed "Boas Festas" tree — bottom-right
(function(){
  function ready(fn){ 
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  }

  ready(function(){
    if (document.getElementById('tree-greetings')) return;

    const css = `
      @keyframes tree-slide-in {
        0%   { transform: translateX(30px) translateY(20px) scale(0.95); opacity: 0; }
        60%  { transform: translateX(-4px) translateY(-2px) scale(1.02); opacity: 1; }
        100% { transform: translateX(0) translateY(0) scale(1); opacity: 1; }
      }
      @keyframes tree-float {
        0%,100% { transform: translateY(0); }
        50%     { transform: translateY(-5px); }
      }
      .tree-greetings {
        position: fixed;
        right: 12px;
        bottom: 12px;
        z-index: 2147483646;
        pointer-events: none;
        width: min(28vw, 300px);
        filter: drop-shadow(0 10px 22px rgba(0,0,0,.35));
        animation: tree-slide-in .8s ease-out both;
      }
      .tree-greetings img {
        width: 100%;
        height: auto;
        display: block;
        user-select: none;
        pointer-events: none;
        animation: tree-float 4.2s ease-in-out infinite;
      }
      @media (max-width: 1024px){
        .tree-greetings{ width: min(32vw, 280px); right: 8px; bottom: 10px; }
      }
      @media (max-width: 820px){
        .tree-greetings{ width: min(36vw, 260px); right: 6px; bottom: 10px; }
      }
      @media (max-width: 640px){
        .tree-greetings{ width: 48vw; }
      }
    `;
    const style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);

    const wrap = document.createElement('div');
    wrap.className = 'tree-greetings';
    wrap.id = 'tree-greetings';

    const img = document.createElement('img');
    img.src = 'arvore.png'; // usar imagem recém enviada
    img.alt = 'Boas Festas - Conquista';
    img.decoding = 'async';
    img.loading = 'eager';

    wrap.appendChild(img);
    document.body.appendChild(wrap);
  });
})();
