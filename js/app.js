document.addEventListener('DOMContentLoaded', () => {
    // 1. Mobile Menu Toggle
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (navToggle && navLinks) {
        navToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            navToggle.classList.toggle('active');
        });

        // Close menu on link click
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                navToggle.classList.remove('active');
            });
        });
    }

    // 2. Navbar Floating / Scrolled effect
    const navbarContainer = document.querySelector('.navbar-container');
    const navbar = document.querySelector('.navbar');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('navbar-scrolled');
        } else {
            navbar.classList.remove('navbar-scrolled');
        }
    });

    // 3. Interactive Calculator Mini-Widget (Dashboard)
    const calcItems = document.querySelectorAll('.widget-calc-item');
    const valConsumption = document.getElementById('calc-consumption');
    const valBattery = document.getElementById('calc-battery');
    const valSolar = document.getElementById('calc-solar');
    const valController = document.getElementById('calc-controller');

    function updateCalculations() {
        let totalWh = 0;

        calcItems.forEach(item => {
            if (item.classList.contains('active')) {
                totalWh += parseInt(item.getAttribute('data-wh'), 10);
            }
        });

        // Update Daily Consumption
        valConsumption.textContent = totalWh.toLocaleString('en-US');

        // Update Battery Needed (Ah @ 12V, 2 days autonomy)
        // Formula: (Wh * 2 days) / 12V = Ah
        const batteryAh = totalWh > 0 ? Math.round((totalWh * 2) / 12) : 0;
        valBattery.textContent = batteryAh.toLocaleString('en-US');

        // Update Solar Array (W)
        // Formula: Wh / 4.0 peak sun hours * 1.3 efficiency loss -> rounded to nearest 100W
        const solarWatts = totalWh > 0 ? Math.ceil((totalWh / 4 * 1.3) / 100) * 100 : 0;
        valSolar.textContent = solarWatts.toLocaleString('en-US');

        // Update Controller Rating (A)
        // Formula: Solar Array W / 12V * 0.9 (safety margin) -> rounded to 10A increments (MPPT)
        const controllerAmps = solarWatts > 0 ? Math.ceil(((solarWatts / 12) * 0.9) / 10) * 10 : 0;
        valController.textContent = controllerAmps;
    }

    if (calcItems.length > 0) {
        calcItems.forEach(item => {
            item.addEventListener('click', () => {
                item.classList.toggle('active');
                updateCalculations();
            });
        });
        // Initial run
        updateCalculations();
    }

    // 4. Pre-Startup Checklist Preview
    const checkboxes = document.querySelectorAll('.checklist-checkbox');
    const progressBar = document.querySelector('.progress-bar-fill');
    const progressText = document.querySelector('.progress-text');
    const successBanner = document.querySelector('.checklist-banner');

    function updateChecklist() {
        if (checkboxes.length === 0) return;

        const totalItems = checkboxes.length;
        let checkedCount = 0;

        checkboxes.forEach(box => {
            if (box.checked) {
                checkedCount++;
            }
        });

        const percent = Math.round((checkedCount / totalItems) * 100);
        progressBar.style.width = `${percent}%`;
        progressText.textContent = `${checkedCount}/${totalItems}`;

        if (percent === 100) {
            successBanner.style.display = 'block';
        } else {
            successBanner.style.display = 'none';
        }
    }

    if (checkboxes.length > 0) {
        checkboxes.forEach(box => {
            box.addEventListener('change', updateChecklist);
        });
        // Initial run
        updateChecklist();
    }

    // 5. FAQ Accordion
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const header = item.querySelector('.faq-header');
        const content = item.querySelector('.faq-content');

        header.addEventListener('click', () => {
            const isActive = item.classList.contains('active');

            // Close all items
            faqItems.forEach(el => {
                el.classList.remove('active');
                el.querySelector('.faq-content').style.maxHeight = null;
            });

            // Toggle current item
            if (!isActive) {
                item.classList.add('active');
                content.style.maxHeight = content.scrollHeight + "px";
            }
        });
    });

    // 6. Testimonial Carousel / Slider
    const reviewsSlider = document.querySelector('.reviews-slider');
    const reviewCards = document.querySelectorAll('.review-card');
    
    if (reviewsSlider && reviewCards.length > 0) {
        let currentIndex = 0;
        let slideInterval;
        const totalCards = reviewCards.length;

        // Auto play slider
        function startSlider() {
            slideInterval = setInterval(() => {
                nextSlide();
            }, 6000);
        }

        function stopSlider() {
            clearInterval(slideInterval);
        }

        function showSlide(index) {
            if (index < 0) {
                currentIndex = totalCards - 1;
            } else if (index >= totalCards) {
                currentIndex = 0;
            } else {
                currentIndex = index;
            }
            
            // Calculate screen size adjustments
            const isMobile = window.innerWidth <= 768;
            const isTablet = window.innerWidth > 768 && window.innerWidth <= 1200;
            
            let percentage = 100;
            if (isTablet) {
                percentage = 50;
            } else if (!isMobile) {
                percentage = 33.333;
            }
            
            // Translate the slider
            // If total viewable is 3 cards, translate is based on single index
            const amountToTranslate = currentIndex * (percentage + (30 / reviewsSlider.offsetWidth * 100));
            // Cap translation so slider doesn't go blank at the end in desktop
            let maxIndex = totalCards - 3;
            if (isTablet) maxIndex = totalCards - 2;
            if (isMobile) maxIndex = totalCards - 1;
            
            if (currentIndex > maxIndex) {
                currentIndex = 0;
            }
            
            const offset = currentIndex * (100 / (isMobile ? 1 : isTablet ? 2 : 3));
            reviewsSlider.style.transform = `translateX(-${offset}%)`;
        }

        function nextSlide() {
            showSlide(currentIndex + 1);
        }

        // Initialize slider
        startSlider();
        
        // Pause on hover
        reviewsSlider.addEventListener('mouseenter', stopSlider);
        reviewsSlider.addEventListener('mouseleave', startSlider);
        
        // Adjust on resize
        window.addEventListener('resize', () => {
            showSlide(currentIndex);
        });
    }

    // 7. Scroll reveal animations
    const revealElements = document.querySelectorAll('.reveal');

    const revealOnScroll = () => {
        const triggerBottom = window.innerHeight * 0.85;

        revealElements.forEach(el => {
            const elTop = el.getBoundingClientRect().top;

            if (elTop < triggerBottom) {
                el.classList.add('active');
            }
        });
    };

    window.addEventListener('scroll', revealOnScroll);
    // Initial check
    revealOnScroll();
});
