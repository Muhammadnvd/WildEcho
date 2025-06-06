document.addEventListener('DOMContentLoaded', () => {
    const navbar = document.querySelector('.navbar');
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]'); // All sections with an ID
    const currentYearSpan = document.getElementById('currentYear');

    // Set current year in footer
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

    // Navbar scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Active nav link on scroll
        let currentSectionId = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - navbar.offsetHeight - 50; // Adjust offset
            const sectionBottom = sectionTop + section.offsetHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionBottom) {
                currentSectionId = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + currentSectionId) {
                link.classList.add('active');
            }
        });

        // Animate section titles' underlines when they come into view
        document.querySelectorAll('.section-title').forEach(title => {
            if (isElementInViewport(title) && !title.classList.contains('in-view')) {
                title.classList.add('in-view');
            }
        });
    });

    // Mobile navigation toggle
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            document.body.classList.toggle('nav-open'); // Used for hamburger icon styling
            // Toggle hamburger active state directly if not using body class for it
            // navToggle.classList.toggle('active');
            // navMenu.classList.toggle('active'); // Or similar class to show/hide
        }); 
    }

    // Close mobile menu when a link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (document.body.classList.contains('nav-open')) {
                document.body.classList.remove('nav-open');
            }
        });
    });

    // Helper function: Check if element is in viewport
    function isElementInViewport(el) {
        const rect = el.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        ) || ( // Also consider elements that are partially in view from the top
            rect.top < (window.innerHeight || document.documentElement.clientHeight) &&
            rect.bottom >= 0
        );
    }

    // On-load animations for hero content
    const heroElements = document.querySelectorAll('.hero-section .animate-on-load');
    heroElements.forEach(el => {
        const delay = parseFloat(el.dataset.delay || 0) * 1000;
        setTimeout(() => {
            el.classList.add('loaded');
        }, delay);
    });

    // On-scroll animations for other elements
    const scrollAnimatedElements = document.querySelectorAll('.animate-on-scroll');
    const observerOptions = {
        root: null, // relative to document viewport
        rootMargin: '0px', // margin around root. Values are similar to css property.
        threshold: 0.15 // percentage of target's visibility the observer's callback should be executed
    };

    const observer = new IntersectionObserver((entries, observerInstance) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = parseFloat(entry.target.dataset.delay || 0) * 1000;
                setTimeout(() => {
                    entry.target.classList.add('in-view');
                }, delay);
                observerInstance.unobserve(entry.target); // Stop observing after it's animated
            }
        });
    }, observerOptions);

    scrollAnimatedElements.forEach(el => {
        observer.observe(el);
    });

});