// Enable click-drag and stepped wheel horizontal scroll for the cards row
(function(){
  const scroller = document.getElementById('bp-scroller');
  if(!scroller) return;

  let isDown = false;
  let startX = 0;
  let scrollLeft = 0;
  let isStepping = false;
  let stepUnlockTimer = 0;

  const getStep = () => {
    const card = scroller.querySelector('.bp-card');
    if(!card) return 0;
    const style = getComputedStyle(scroller);
    const gap = parseFloat(style.columnGap || style.gap || 0);
    return card.getBoundingClientRect().width + (isNaN(gap) ? 0 : gap);
  };

  const scrollByStep = (dir) => {
    const step = getStep();
    if(step <= 0) return;
    isStepping = true;
    scroller.scrollBy({ left: dir * step, behavior: 'smooth' });
    clearTimeout(stepUnlockTimer);
    stepUnlockTimer = setTimeout(()=>{ isStepping = false; }, 320);
  };

  scroller.addEventListener('mousedown', (e)=>{
    isDown = true;
    scroller.classList.add('dragging');
    startX = e.pageX - scroller.offsetLeft;
    scrollLeft = scroller.scrollLeft;
  });
  window.addEventListener('mouseup', ()=>{
    isDown = false;
    scroller.classList.remove('dragging');
  });
  scroller.addEventListener('mouseleave', ()=>{ isDown = false; scroller.classList.remove('dragging'); });
  scroller.addEventListener('mousemove', (e)=>{
    if(!isDown) return;
    e.preventDefault();
    const x = e.pageX - scroller.offsetLeft;
    const walk = (x - startX) * 1.2;
    scroller.scrollLeft = scrollLeft - walk;
  });

  // Intercept vertical wheel: step horizontally by one card and prevent page scroll
  const handleWheel = (e) => {
    const absX = Math.abs(e.deltaX);
    const absY = Math.abs(e.deltaY);
    if(absY >= absX){
      e.preventDefault();
      if(isStepping) return;
      const dir = e.deltaY > 0 ? 1 : -1; // down -> right, up -> left
      scrollByStep(dir);
    } else {
      e.preventDefault();
      scroller.scrollLeft += e.deltaX;
    }
  };

  // Listen globally so scrolling anywhere triggers the carousel movement
  window.addEventListener('wheel', handleWheel, { passive:false });
  // Also listen on scroller and stop propagation to avoid double-handling
  scroller.addEventListener('wheel', (e)=>{ handleWheel(e); e.stopPropagation(); }, { passive:false });
})();

// Note: Navigation buttons removed per new UX

