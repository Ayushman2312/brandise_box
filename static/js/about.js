document.addEventListener('DOMContentLoaded', function () {
    var body = document.querySelector('.about-body');
    var cta = document.querySelector('.about-cta');
    var timeline = document.querySelector('.timeline');
    var track = document.querySelector('.tl-track');
    var card = document.querySelector('.tl-card');
    var prevBtn = document.querySelector('.tl-prev');
    var nextBtn = document.querySelector('.tl-next');
    var closeBtn = document.querySelector('.tl-close');

    if (!body || !cta || !timeline || !track || !nextBtn || !prevBtn || !closeBtn || !card) return;

    // Respect reduced motion
    var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
        body.classList.add('no-motion');
    }

    var slideIndex = 0;
    var totalSlides = track.children.length;

    function sizeSlides(){
        var slideWidth = card.clientWidth;
        var slides = track.querySelectorAll('.tl-slide');
        slides.forEach(function(slide){
            slide.style.width = slideWidth + 'px';
            slide.style.flex = '0 0 ' + slideWidth + 'px';
        });
        track.style.width = (slideWidth * totalSlides) + 'px';
    }

    function applyTheme(){
        var colors = ['#000000', '#7D46EB', '#CCA133', '#F0F0F0', '#4F2B4F'];
        var bg = colors[slideIndex] || '#000000';
        card.style.backgroundColor = bg;
        timeline.style.backgroundColor = bg;

        // Remove previous index theme classes
        for (var i = 0; i < colors.length; i++){
            card.classList.remove('theme-idx-' + i);
        }
        card.classList.add('theme-idx-' + slideIndex);

        // Toggle light theme hint for very light backgrounds (slide 4)
        if (slideIndex === 3){
            card.classList.add('theme-light');
        } else {
            card.classList.remove('theme-light');
        }
    }

    function updateTrack(){
        var firstSlide = track.querySelector('.tl-slide');
        var slideWidth = firstSlide ? firstSlide.clientWidth : card.clientWidth;
        var offsetPx = -slideIndex * slideWidth;
        track.style.transform = 'translateX(' + offsetPx + 'px)';
        // Update state classes
        if (slideIndex <= 0) { timeline.classList.add('is-start'); } else { timeline.classList.remove('is-start'); }
        if (slideIndex >= totalSlides - 1) { timeline.classList.add('is-end'); } else { timeline.classList.remove('is-end'); }
        // Update button disabled states
        prevBtn.disabled = slideIndex <= 0;
        nextBtn.disabled = slideIndex >= totalSlides - 1;
        applyTheme();
    }

    function openTimeline(event){
        event.preventDefault();
        slideIndex = 0;
        sizeSlides();
        updateTrack();
        body.classList.add('is-dark');
    }

    function closeTimeline(event){
        if (event && typeof event.preventDefault === 'function') event.preventDefault();
        body.classList.remove('is-dark');
    }

    function goNext(){
        if (slideIndex < totalSlides - 1){
            slideIndex += 1;
            updateTrack();
        }
    }

    function goPrev(){
        if (slideIndex > 0){
            slideIndex -= 1;
            updateTrack();
        }
    }

    cta.addEventListener('click', openTimeline);
    closeBtn.addEventListener('click', closeTimeline);
    nextBtn.addEventListener('click', goNext);
    prevBtn.addEventListener('click', goPrev);
    document.addEventListener('keydown', function(e){
        if (!body.classList.contains('is-dark')) return;
        if (e.key === 'Escape') closeTimeline(e);
        if (e.key === 'ArrowRight') goNext();
        if (e.key === 'ArrowLeft') goPrev();
    });

    // Keep slide aligned on resize/orientation change
    var resizeRaf = null;
    window.addEventListener('resize', function(){
        if (resizeRaf) cancelAnimationFrame(resizeRaf);
        resizeRaf = requestAnimationFrame(function(){
            sizeSlides();
            updateTrack();
        });
    });

    // Initial sizing in case timeline is opened by keyboard
    sizeSlides();
});

