document.addEventListener('DOMContentLoaded', function () {
    var body = document.querySelector('.about-body');
    var cta = document.querySelector('.about-cta');
    var timeline = document.querySelector('.timeline');
    var track = document.querySelector('.tl-track');
    var nextBtn = document.querySelector('.tl-next');
    var exitBtn = document.querySelector('.tl-exit');

    if (!body || !cta || !timeline || !track || !nextBtn || !exitBtn) return;

    // Respect reduced motion
    var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
        body.classList.add('no-motion');
    }

    var slideIndex = 0;
    var totalSlides = track.children.length;

    function updateTrack(){
        var offset = -slideIndex * 100;
        track.style.transform = 'translateX(' + offset + '%)';
        // Back button should always be visible
        timeline.classList.add('show-exit');
        if (slideIndex >= totalSlides - 1) {
            timeline.classList.add('is-end');
        } else {
            timeline.classList.remove('is-end');
        }
    }

    function openTimeline(event){
        event.preventDefault();
        slideIndex = 0;
        updateTrack();
        body.classList.add('is-dark');
    }

    function closeTimeline(event){
        event.preventDefault();
        body.classList.remove('is-dark');
    }

    function goNext(){
        if (slideIndex < totalSlides - 1){
            slideIndex += 1;
            updateTrack();
        }
    }

    cta.addEventListener('click', openTimeline);
    exitBtn.addEventListener('click', closeTimeline);
    nextBtn.addEventListener('click', goNext);
    document.addEventListener('keydown', function(e){
        if (!body.classList.contains('is-dark')) return;
        if (e.key === 'Escape') closeTimeline(e);
        if (e.key === 'ArrowRight') goNext();
    });
});

