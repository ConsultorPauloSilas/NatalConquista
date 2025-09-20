
(function(){
  function ready(fn){ document.readyState!='loading'?fn():document.addEventListener('DOMContentLoaded',fn); }
  ready(function(){
    // Remove outros adesivos se existirem
    document.querySelectorAll('.sticker--address, .sticker--tree').forEach(el => el.remove());

    // Garante a presença do adesivo de marca
    let img = document.querySelector('.sticker--brand');
    if (!img){
      img = new Image();
      img.className = 'sticker--brand';
      img.src = 'ConquistaCestas.png';
      img.alt = 'Conquista Cestas';
      img.decoding = 'async';
      img.loading = 'eager';
      document.body.appendChild(img);
    }

    // Reforça estilo inline (caso algum CSS tente sobrescrever)
    Object.assign(img.style, {
      position:'fixed', top:'16px', left:'16px', right:'', bottom:'',
      width:'clamp(80px, 12vw, 150px)', opacity:'0.9',
      zIndex:'2147483647', pointerEvents:'none', userSelect:'none',
      transform:'none', filter:'drop-shadow(0 6px 16px rgba(0,0,0,.35))'
    });
  });
})();
