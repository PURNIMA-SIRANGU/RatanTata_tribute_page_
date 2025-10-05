document.addEventListener('DOMContentLoaded', () => {

    // ----------------------------------------------------
    // 1. SCROLL-REVEAL & IMAGE PARALLAX (For index.html & biography.html)
    // ----------------------------------------------------
    const revealElements = document.querySelectorAll('.scroll-reveal');
    const imageContainers = document.querySelectorAll('.section-image');
    let rafTicking = false;

    // Intersection Observer for fade-in animation
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const observerCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                // Unobserve all, as we don't need to re-check the standard elements
                observer.unobserve(entry.target);
            }
        });
    };

    const revealObserver = new IntersectionObserver(observerCallback, observerOptions);

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

    // Dynamic Image Parallax for .section-image elements
    function updateImageTransforms() {
        imageContainers.forEach(container => {
            const image = container.querySelector('img');
            if (!image) return;

            const rect = container.getBoundingClientRect();
            const center = rect.top + rect.height / 2;
            const viewportCenter = window.innerHeight / 2;
            const offset = center - viewportCenter;
            const movement = offset / 25; // Slower vertical movement
            const scaleAmount = 1 + Math.min(Math.abs(offset) / 1500, 0.05); // Subtle scale

            image.style.transform = `translateY(${movement}px) scale(${scaleAmount})`;
        });
    }

    // Single Scroll Handler for performance
    window.addEventListener('scroll', () => {
        if (!rafTicking) {
            window.requestAnimationFrame(() => {
                updateImageTransforms();
                rafTicking = false; // Reset the flag after frame is drawn
            });
            rafTicking = true;
        }
    });

    // Run on load
    updateImageTransforms();

    // ----------------------------------------------------
    // 2. CAROUSEL LOGIC (For carousel.html)
    // ----------------------------------------------------
    // Only run if the elements exist (i.e., we are on carousel.html)
    const carouselDom = document.querySelector('.carousel');
    if (carouselDom) {
        let nextDom = document.getElementById('next');
        let prevDom = document.getElementById('prev');

        let SliderDom = carouselDom.querySelector('.carousel .list');
        let thumbnailBorderDom = carouselDom.querySelector('.carousel .thumbnail');
        let thumbnailItemsDom = thumbnailBorderDom.querySelectorAll('.item');
        
        thumbnailBorderDom.appendChild(thumbnailItemsDom[0]);
        let timeRunning = 3000;
        let timeAutoNext = 7000;
        let runTimeOut;
        let runNextAuto;

        function startAutoNext() {
            clearTimeout(runNextAuto);
            runNextAuto = setTimeout(() => {
                showSlider('next');
            }, timeAutoNext);
        }

        nextDom.onclick = function(){
            showSlider('next');
        }

        prevDom.onclick = function(){
            showSlider('prev');
        }

        function showSlider(type){
            let SliderItemsDom = SliderDom.querySelectorAll('.carousel .list .item');
            let thumbnailItemsDom = thumbnailBorderDom.querySelectorAll('.carousel .thumbnail .item');

            if(type === 'next'){
                SliderDom.appendChild(SliderItemsDom[0]);
                thumbnailBorderDom.appendChild(thumbnailItemsDom[0]);
                carouselDom.classList.add('next');
            } else {
                SliderDom.prepend(SliderItemsDom[SliderItemsDom.length - 1]);
                thumbnailBorderDom.prepend(thumbnailItemsDom[thumbnailItemsDom.length - 1]);
                carouselDom.classList.add('prev');
            }
            
            clearTimeout(runTimeOut);
            runTimeOut = setTimeout(() => {
                carouselDom.classList.remove('next');
                carouselDom.classList.remove('prev');
            }, timeRunning);

            startAutoNext();
        }

        // Initialize auto-run
        startAutoNext();
    }
    
    // ----------------------------------------------------
    // 3. QUOTES PAGE SCROLL-SNAP VISIBILITY (For quotes.html)
    // ----------------------------------------------------
    const scrollSnapSections = document.querySelectorAll('.snap-section, .quote-slide');
    
    if (scrollSnapSections.length > 0) {
        const snapOptions = {
            root: null, 
            threshold: 0.75 
        };

        const snapObserver = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                } else {
                    entry.target.classList.remove('is-visible'); 
                }
            });
        }, snapOptions);

        scrollSnapSections.forEach(section => {
            snapObserver.observe(section);
        });
    }
});
// Add this new function to the end of your existing script.js
function highlightSidebarLink() {
    // Only run this logic on the resources page
    if (!document.body.classList.contains('resources-body')) return;
    
    const sections = document.querySelectorAll('.resources-main-content h2[id]');
    const links = document.querySelectorAll('#sidebar-links a');
    let current = '';

    sections.forEach(section => {
        const sectionTop = section.offsetTop - 150; // Offset for sticky effect
        if (window.scrollY >= sectionTop) {
            current = section.getAttribute('id');
        }
    });

    links.forEach(link => {
        link.classList.remove('current-section');
        if (link.href.includes(current)) {
            link.classList.add('current-section');
        }
    });
}

// Add event listener for scroll to the global listener in script.js
window.addEventListener('scroll', highlightSidebarLink);
// --- New Sidebar Toggle Logic ---
document.addEventListener('DOMContentLoaded', () => {
    // ... (Existing DOMContentLoaded code) ... 

    // Find the toggle button and the sidebar menu
    const menuToggle = document.getElementById('menu-toggle');
    const sidebarMenu = document.getElementById('sidebar-menu');

    // Only run if the elements exist (i.e., we are on one of the main pages)
    if (menuToggle && sidebarMenu) {
        menuToggle.addEventListener('click', () => {
            sidebarMenu.classList.toggle('open');
            menuToggle.classList.toggle('is-active'); // For potential hamburger animation
        });
        
        // Close menu when a link is clicked (optional, but good UX)
        sidebarMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                sidebarMenu.classList.remove('open');
                menuToggle.classList.remove('is-active');
            });
        });
    }
});