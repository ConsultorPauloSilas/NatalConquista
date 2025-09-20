// Natal decor: glitter + sparkles + snow + garland (no assets needed)
(function () {
  const isMobile = matchMedia('(max-width: 768px)').matches;
  const sparkleCount = isMobile ? 70 : 140;
  const snowCount = isMobile ? 90 : 160;

  // ---- Inject CSS ----
  const css = `
  .glitter-overlay{
    pointer-events:none; position:fixed; inset:-1px; z-index:3;
    background:
      radial-gradient(1200px 1200px at 50% 50%, rgba(255,255,255,.08), transparent 60%),
      conic-gradient(from 0deg at 50% 50%, rgba(255,0,80,.10), rgba(255,220,0,.10), rgba(0,200,255,.10), rgba(120,0,255,.10), rgba(255,0,80,.10));
    mix-blend-mode: screen;
    animation: glitter-spin 18s linear infinite;
  }
  @keyframes glitter-spin{ to { transform: rotate(360deg); } }

  canvas#sparkleCanvas{
    position:fixed; inset:0; z-index:4; pointer-events:none;
  }

  /* Garland lights */
  .garland{ position:fixed; left:0; right:0; top:0; height:90px; pointer-events:none; z-index:5; }
  .garland .wire{ position:absolute; inset:0;
    background: radial-gradient(50% 6px at 0% 30px, #194, #0a3 70%, transparent 71%) repeat-x 0 0/60px 90px;
    opacity:.55;
  }
  .garland .bulb{
    position:absolute; top:22px; width:14px; height:14px; border-radius:50%;
    transform-origin:center -10px;
    filter: drop-shadow(0 0 6px currentColor);
    animation: bulb-twinkle 2.6s ease-in-out infinite;
  }
  .garland .bulb::after{
    content:""; position:absolute; inset:-13px; border-radius:50%;
    background: currentColor; opacity:.35; filter: blur(10px);
  }
  @keyframes bulb-twinkle{ 0%,100%{ opacity:.3; transform:translateY(0) rotate(0deg);} 50%{opacity:1; transform:translateY(2px) rotate(2deg);} }

  /* Subtle glow on highlighted product images */
  .xmas-glow{
    animation: glowPulse 3.5s ease-in-out infinite;
    filter: drop-shadow(0 0 12px rgba(255,215,0,.55)) drop-shadow(0 0 24px rgba(255,0,120,.28));
  }
  @keyframes glowPulse{
    0%,100%{ filter: drop-shadow(0 0 12px rgba(255,215,0,.55)) drop-shadow(0 0 24px rgba(255,0,120,.28)); }
    50%{ filter: drop-shadow(0 0 26px rgba(255,215,0,.85)) drop-shadow(0 0 42px rgba(0,220,255,.45)); }
  }
  `;
  const style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);

  // ---- DOM layers ----
  const glitter = document.createElement('div');
  glitter.className = 'glitter-overlay';
  document.body.appendChild(glitter);

  const canvas = document.createElement('canvas');
  canvas.id = 'sparkleCanvas';
  document.body.appendChild(canvas);
  const ctx = canvas.getContext('2d');

  // ---- Canvas sizing ----
  let w, h, dpr;
  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = canvas.width = Math.floor(innerWidth * dpr);
    h = canvas.height = Math.floor(innerHeight * dpr);
    canvas.style.width = innerWidth + 'px';
    canvas.style.height = innerHeight + 'px';
  }
  resize(); window.addEventListener('resize', resize);

  // ---- Particles ----
  function rand(a,b){ return Math.random()*(b-a)+a; }
  const sparkleColors = ['#ffffff', '#ff80ff', '#ffd166', '#8ecae6', '#baffc9', '#ffadad', '#fdfcdc', '#cdb4db', '#90f1ef'];

  function Sparkle(){
    this.reset = () => {
      this.x = rand(0, w); this.y = rand(0, h);
      this.r = rand(1.0*dpr, 2.6*dpr);
      this.color = sparkleColors[(Math.random()*sparkleColors.length)|0];
      this.alpha = rand(0.25, 0.9);
      this.va = rand(-0.015, 0.02);
      this.vx = rand(-0.03, 0.03)*dpr; this.vy = rand(-0.03, 0.03)*dpr;
    };
    this.reset();
    this.draw = () => {
      this.x += this.vx; this.y += this.vy; this.alpha += this.va;
      if(this.alpha<0.15 || this.alpha>1){ this.va *= -1; }
      if(this.x<0||this.x>w||this.y<0||this.y>h){ this.reset(); }
      ctx.globalCompositeOperation='lighter';
      ctx.globalAlpha = this.alpha;
      ctx.fillStyle = this.color;
      ctx.beginPath(); ctx.arc(this.x, this.y, this.r, 0, Math.PI*2); ctx.fill();
    };
  }

  function Snow(){
    this.reset = () => {
      this.x = rand(0, w); this.y = rand(-h*0.2, -10);
      this.r = rand(0.8*dpr, 2.4*dpr);
      this.vx = rand(-0.15, 0.15)*dpr; this.vy = rand(0.25, 0.7)*dpr;
      this.alpha = rand(0.35, 0.9);
    };
    this.reset();
    this.draw = () => {
      this.x += this.vx; this.y += this.vy;
      if(this.y>h+10) this.reset();
      ctx.globalCompositeOperation='screen';
      ctx.globalAlpha = this.alpha;
      ctx.fillStyle = '#ffffff';
      ctx.beginPath(); ctx.arc(this.x, this.y, this.r, 0, Math.PI*2); ctx.fill();
    };
  }

  const sparkles = Array.from({length: sparkleCount}, () => new Sparkle());
  const snows = Array.from({length: snowCount}, () => new Snow());

  (function animate(){
    ctx.clearRect(0,0,w,h);
    snows.forEach(s => s.draw());
    sparkles.forEach(p => p.draw());
    requestAnimationFrame(animate);
  })();

  // ---- Garland lights at the top ----
  const garland = document.createElement('div');
  garland.className = 'garland';
  const wire = document.createElement('div'); wire.className='wire'; garland.appendChild(wire);
  const bulbColors = ['#ff4d6d','#ffd166','#06d6a0','#118ab2','#f72585','#e76f51','#00f5d4','#b5179e'];
  const bulbs = isMobile ? 14 : 24;
  for(let i=0;i<bulbs;i++){
    const b = document.createElement('span'); b.className='bulb';
    const color = bulbColors[i%bulbColors.length];
    b.style.color = color;
    const left = (i/(bulbs-1))*100;
    b.style.left = `calc(${left}vw - 7px)`;
    b.style.animationDelay = (i*0.15)+'s';
    garland.appendChild(b);
  }
  document.body.appendChild(garland);

  // ---- Add glow to known product images ----
  const selectors = ['img[src*="airfryer"]', 'img[src*="sanduicheira"]'];
  document.querySelectorAll(selectors.join(',')).forEach(el => el.classList.add('xmas-glow'));
})();