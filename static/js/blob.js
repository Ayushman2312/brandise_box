// Fluid, smoothly morphing blob that drifts around the viewport background
(function(){
  const canvas = document.getElementById('blob-canvas');
  if(!canvas) return;
  const ctx = canvas.getContext('2d');

  let width, height, dpr;
  function resize(){
    dpr = Math.min(window.devicePixelRatio || 1.5, 2);
    // Canvas uses its own size; we render in logical px and scale via dpr
    const cssSize = Math.min(window.innerWidth, window.innerHeight) * 1.2;
    width = cssSize; height = cssSize;
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    ctx.setTransform(dpr,0,0,dpr,0,0);
  }
  resize();
  window.addEventListener('resize', resize);

  // Parameters for organic motion
  const nodes = 16;
  const baseRadius = () => Math.min(width, height) * 0.36;

  const points = new Array(nodes).fill(0).map((_,i)=>({
    angle: (i / nodes) * Math.PI * 2,
    n1: Math.random()*1000,
    n2: Math.random()*1000,
  }));

  // Smooth noise from blended sines
  function noise(t, seed){
    return (
      Math.sin(t*0.6 + seed*0.21) +
      Math.sin(t*1.1 + seed*0.63) * 0.6 +
      Math.sin(t*1.9 + seed*1.13) * 0.32
    ) / 1.85;
  }

  // Keep blob anchored behind the hero title; update on resize/scroll
  const anchorEl = document.querySelector('.nx-logo') || document.querySelector('.nx-hero-content');
  function updateCanvasPosition(){
    if(!anchorEl) return;
    const rect = anchorEl.getBoundingClientRect();
    const centerX = rect.left + rect.width/2;
    const centerY = rect.top + rect.height/2;
    const vw = window.innerWidth; const vh = window.innerHeight;
    const offX = centerX - vw/2;
    const offY = centerY - vh/2;
    canvas.style.transform = 'translate(-50%, -50%) translate3d(' + offX.toFixed(2) + 'px,' + offY.toFixed(2) + 'px,0)';
  }
  window.addEventListener('resize', ()=>{ resize(); updateCanvasPosition(); });
  window.addEventListener('scroll', updateCanvasPosition, { passive: true });

  function draw(now){
    const t = (now || performance.now()) / 1000;
    ctx.clearRect(0,0,width,height);

    // position handled by updateCanvasPosition(); blob only morphs now

    const r = baseRadius();

    const grad = ctx.createRadialGradient(width/2, height/2, 8, width/2, height/2, r*1.2);
    // Blue → Purple blend
    grad.addColorStop(0.0, 'rgba(183, 202, 233, 0.8)');   // blue
    grad.addColorStop(0.55, 'rgb(203, 182, 249)'); // violet/purple

    const pts = points.map((p)=>{
      const rOffset = r * (0.22 * noise(t*1.6, p.n1) + 0.11 * noise(t*3.2, p.n2));
      const rr = r + rOffset;
      return {
        x: width/2 + Math.cos(p.angle) * rr,
        y: height/2 + Math.sin(p.angle) * rr
      };
    });

    ctx.beginPath();
    for(let i=0;i<pts.length;i++){
      const p0 = pts[(i-1+pts.length)%pts.length];
      const p1 = pts[i];
      const p2 = pts[(i+1)%pts.length];
      const p3 = pts[(i+2)%pts.length];
      if(i===0){ ctx.moveTo(p1.x, p1.y); }
      const cp1x = p1.x + (p2.x - p0.x)/6;
      const cp1y = p1.y + (p2.y - p0.y)/6;
      const cp2x = p2.x - (p3.x - p1.x)/6;
      const cp2y = p2.y - (p3.y - p1.y)/6;
      ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, p2.x, p2.y);
    }
    ctx.closePath();

    ctx.fillStyle = grad;
    ctx.fill();

    // Very soft outer glow
    ctx.save();
    ctx.filter = 'blur(26px)';
    ctx.globalAlpha = 0.32;
    ctx.fill();
    ctx.restore();

    requestAnimationFrame(draw);
  }

  updateCanvasPosition();
  requestAnimationFrame(draw);
})();


