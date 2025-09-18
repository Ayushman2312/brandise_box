(function(){
  var toggle = document.querySelector('.nav-toggle');
  var drawer = document.getElementById('nav-drawer');
  var backdrop = document.getElementById('nav-backdrop');
  if(!toggle || !drawer || !backdrop) return;

  function openDrawer(){
    drawer.classList.add('is-open');
    drawer.setAttribute('aria-hidden','false');
    toggle.setAttribute('aria-expanded','true');
    backdrop.hidden = false;
    document.addEventListener('keydown', onKeyDown);
  }
  function closeDrawer(){
    drawer.classList.remove('is-open');
    drawer.setAttribute('aria-hidden','true');
    toggle.setAttribute('aria-expanded','false');
    backdrop.hidden = true;
    document.removeEventListener('keydown', onKeyDown);
  }
  function onKeyDown(e){ if(e.key === 'Escape') closeDrawer(); }

  toggle.addEventListener('click', function(){
    if(drawer.classList.contains('is-open')) closeDrawer(); else openDrawer();
  });
  backdrop.addEventListener('click', closeDrawer);
})();


