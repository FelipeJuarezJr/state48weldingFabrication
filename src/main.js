import PhotoSwipeLightbox from 'photoswipe/lightbox';
import 'photoswipe/dist/photoswipe.css';

const lightbox = new PhotoSwipeLightbox({
    gallery: '.pswp-gallery',
    children: 'a',
    showHideAnimationType: 'zoom',
    showAnimationDuration: 1000,
    hideAnimationDuration: 1000,
    bgOpacity: 0.9,
    pswpModule: () => import('photoswipe')
});

let isFirstOpen = true;

lightbox.on('beforeOpen', () => {
    isFirstOpen = true;
});

lightbox.on('change', () => {
    document.querySelectorAll('.pswp__zoom-wrap').forEach(el => el.classList.remove('is-active'));
    
    if (lightbox.pswp && lightbox.pswp.currSlide && lightbox.pswp.currSlide.container) {
        const container = lightbox.pswp.currSlide.container;
        // Trigger reflow
        void container.offsetHeight;
        container.style.setProperty('--blur-duration', isFirstOpen ? '1s' : '0.5s');
        isFirstOpen = false;
        container.classList.add('is-active');
    }
});

// Auto-calculate image dimensions
document.querySelectorAll('.pswp-gallery a').forEach(aEl => {
    const img = aEl.querySelector('img');
    if (!img) return;
    
    const setDimensions = () => {
        if (img.naturalWidth) {
            aEl.setAttribute('data-pswp-width', img.naturalWidth);
            aEl.setAttribute('data-pswp-height', img.naturalHeight);
        }
    };
    
    if (img.complete) {
        setDimensions();
    } else {
        img.addEventListener('load', setDimensions);
    }
});

lightbox.init();

// Support for UI buttons calling openGallery
window.openGallery = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    const firstLink = document.querySelector('.pswp-gallery a');
    if (firstLink) firstLink.click();
};
