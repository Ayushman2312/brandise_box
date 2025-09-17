;(function(){
  function ready(fn){
    if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',fn)}else{fn()}
  }

  ready(function(){
    var container = document.querySelector('.nx-links')
    var dots = Array.prototype.slice.call(document.querySelectorAll('.nx-slider-dots .nx-dot'))
    if(!container || dots.length===0){return}

    function isMobile(){return window.matchMedia('(max-width: 640px)').matches}

    function getCardWidth(){
      var card = container.querySelector('.nx-card')
      if(!card){return 0}
      var style = window.getComputedStyle(card)
      var width = card.getBoundingClientRect().width
      var marginRight = parseFloat(style.marginRight)||0
      return width + marginRight
    }

    function getPageWidth(){
      // Page is two cards wide
      return getCardWidth() * 2
    }

    function goTo(index){
      if(!isMobile()){return}
      var page = getPageWidth()
      if(page<=0){return}
      var target = index * page
      container.scrollTo({left: target, behavior: 'smooth'})
      updateDots(index)
    }

    function updateDots(activeIndex){
      dots.forEach(function(dot, i){
        if(i===activeIndex){dot.classList.add('is-active'); dot.setAttribute('aria-selected','true')}
        else{dot.classList.remove('is-active'); dot.setAttribute('aria-selected','false')}
      })
    }

    dots.forEach(function(dot, i){
      dot.addEventListener('click', function(){ goTo(i) })
    })

    // Keep snapping aligned on resize
    var resizeTO
    window.addEventListener('resize', function(){
      if(!isMobile()){return}
      clearTimeout(resizeTO)
      resizeTO = setTimeout(function(){
        var page = getPageWidth()
        if(page>0){
          var idx = Math.round(container.scrollLeft / page)
          container.scrollTo({left: idx * page})
          updateDots(idx)
        }
      }, 150)
    })

    // Reflect scroll position into dots (e.g., manual swipe)
    container.addEventListener('scroll', function(){
      if(!isMobile()){return}
      var page = getPageWidth()
      if(page>0){
        var idx = Math.round(container.scrollLeft / page)
        updateDots(idx)
      }
    })
  })
})()


