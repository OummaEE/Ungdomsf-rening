(function ($) {
    "use strict";

    // GSAP Configuration
    if (typeof gsap !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger, SplitText);
        gsap.config({
            nullTargetWarn: false,
            trialWarn: false
        });
    }

    // Preloader
    $(window).on('load', function () {
        setTimeout(() => {
            document.getElementById('preloader').classList.add('fade-out');
            setTimeout(() => {
                document.getElementById('preloader').style.display = 'none';
            }, 500);
        }, 1000);
    });

    // Header scroll effect
    $(window).on('scroll', function () {
        const header = document.querySelector('.header');
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // AOS Animation
    if ($("[data-aos]").length) {
        AOS.init({
            duration: 1000,
            once: true,
            offset: 100,
            easing: 'ease-in-out'
        });
    }

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Active navigation link
    $(window).on('scroll', function () {
        const sections = document.querySelectorAll('section');
        const navLinks = document.querySelectorAll('.nav-link');
        
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });

    // Enhanced Counter Animation with Odometer
    if ($(".counter").length && typeof Odometer !== 'undefined') {
        $(".counter").each(function () {
            const counter = $(this);
            const target = counter.attr('data-target') || counter.text();
            
            counter.appear(function () {
                if (!counter.hasClass('counted')) {
                    counter.addClass('counted');
                    const odometer = new Odometer({
                        el: this,
                        value: 0,
                        format: '(,ddd)',
                        theme: 'default'
                    });
                    odometer.update(target);
                }
            }, { accY: -50 });
        });
    } else {
        // Fallback counter animation
        const counterElements = document.querySelectorAll('.counter');
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
                    entry.target.classList.add('counted');
                    const target = parseInt(entry.target.getAttribute('data-target'));
                    const counter = entry.target;
                    let count = 0;
                    const increment = target / 100;
                    
                    const updateCount = () => {
                        if (count < target) {
                            count += increment;
                            counter.textContent = Math.ceil(count);
                            setTimeout(updateCount, 20);
                        } else {
                            counter.textContent = target + '+';
                        }
                    };
                    updateCount();
                }
            });
        }, { threshold: 0.5 });

        counterElements.forEach(counter => {
            counterObserver.observe(counter);
        });
    }

    // Testimonials Carousel
    if ($(".testimonial-carousel").length) {
        $(".testimonial-carousel").owlCarousel({
            loop: true,
            margin: 30,
            nav: false,
            dots: true,
            smartSpeed: 500,
            autoplay: true,
            autoplayTimeout: 5000,
            responsive: {
                0: { items: 1 },
                768: { items: 1 },
                992: { items: 2 },
                1200: { items: 2 }
            }
        });
    }

    // Services Carousel
    if ($(".services-carousel").length) {
        $(".services-carousel").owlCarousel({
            loop: true,
            margin: 30,
            nav: true,
            dots: false,
            smartSpeed: 500,
            autoplay: true,
            autoplayTimeout: 4000,
            navText: [
                '<i class="fas fa-chevron-left"></i>',
                '<i class="fas fa-chevron-right"></i>'
            ],
            responsive: {
                0: { items: 1 },
                768: { items: 2 },
                992: { items: 3 },
                1200: { items: 3 }
            }
        });
    }

    // Team Carousel
    if ($(".team-carousel").length) {
        $(".team-carousel").owlCarousel({
            loop: true,
            margin: 30,
            nav: false,
            dots: true,
            smartSpeed: 500,
            autoplay: true,
            autoplayTimeout: 6000,
            responsive: {
                0: { items: 1 },
                768: { items: 2 },
                992: { items: 3 },
                1200: { items: 4 }
            }
        });
    }

    // Magnific Popup for Videos
    if ($(".video-popup").length) {
        $(".video-popup").magnificPopup({
            type: "iframe",
            mainClass: "mfp-fade",
            removalDelay: 160,
            preloader: true,
            fixedContentPos: false
        });
    }

    // Magnific Popup for Images
    if ($(".img-popup").length) {
        $(".img-popup").magnificPopup({
            type: "image",
            closeOnContentClick: true,
            closeBtnInside: false,
            gallery: {
                enabled: true
            }
        });
    }

    // Form validation and submission
    if ($('.contact-form').length) {
        $('.contact-form').validate({
            rules: {
                name: { required: true, minlength: 2 },
                email: { required: true, email: true },
                subject: { required: true, minlength: 5 },
                message: { required: true, minlength: 10 }
            },
            messages: {
                name: "Vänligen ange ditt namn",
                email: "Vänligen ange en giltig e-postadress",
                subject: "Vänligen ange ett ämne",
                message: "Vänligen skriv ditt meddelande"
            },
            submitHandler: function (form) {
                // AJAX form submission
                $.ajax({
                    url: $(form).attr('action') || '#',
                    type: 'POST',
                    data: $(form).serialize(),
                    success: function (response) {
                        alert('Tack för ditt meddelande! Vi kommer att kontakta dig så snart som möjligt.');
                        form.reset();
                    },
                    error: function () {
                        alert('Ett fel uppstod. Vänligen försök igen.');
                    }
                });
                return false;
            }
        });
    }

    // WOW.js Animation
    if ($(".wow").length && typeof WOW !== 'undefined') {
        var wow = new WOW({
            boxClass: "wow",
            animateClass: "animated",
            mobile: true,
            live: true
        });
        wow.init();
    }

    // Isotope Portfolio Filter
    if ($(".filter-layout").length) {
        var $grid = $(".filter-layout").isotope({
            itemSelector: '.filter-item',
            layoutMode: 'fitRows'
        });

        // Filter items on button click
        $('.post-filter').on('click', 'li', function () {
            var filterValue = $(this).attr('data-filter');
            $grid.isotope({ filter: filterValue });
            
            // Update active class
            $('.post-filter li').removeClass('active');
            $(this).addClass('active');
        });
    }

    // Mobile Navigation
    $('.navbar-toggler').on('click', function () {
        $(this).toggleClass('active');
        $('.navbar-collapse').toggleClass('show');
        $('body').toggleClass('nav-open');
    });

    // Close mobile nav when clicking on links
    $('.navbar-nav .nav-link').on('click', function () {
        if ($(window).width() < 992) {
            $('.navbar-collapse').removeClass('show');
            $('.navbar-toggler').removeClass('active');
            $('body').removeClass('nav-open');
        }
    });

    // Scroll to top functionality
    if ($('.scroll-to-top').length) {
        $(window).on('scroll', function () {
            if ($(this).scrollTop() > 200) {
                $('.scroll-to-top').fadeIn();
            } else {
                $('.scroll-to-top').fadeOut();
            }
        });

        $('.scroll-to-top').on('click', function () {
            $('html, body').animate({ scrollTop: 0 }, 800);
            return false;
        });
    }

    // Animation on scroll observer
    const observerOptions = {
        threshold: 0.3,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.fade-in-up, .fade-in-left, .fade-in-right').forEach(el => {
        observer.observe(el);
    });

    // Parallax effect for hero section
    if ($('.hero').length) {
        $(window).on('scroll', function () {
            const scrolled = $(this).scrollTop();
            const parallax = $('.hero');
            const speed = scrolled * 0.5;
            
            parallax.css('transform', 'translateY(' + speed + 'px)');
        });
    }

    // Lazy loading for images
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });

        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }

    // Custom cursor (optional)
    if ($('.custom-cursor').length) {
        const cursor = document.querySelector('.custom-cursor');
        const cursorInner = document.querySelector('.custom-cursor-inner');

        document.addEventListener('mousemove', function (e) {
            cursor.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
            cursorInner.style.left = e.clientX + 'px';
            cursorInner.style.top = e.clientY + 'px';
        });

        document.addEventListener('mousedown', function () {
            cursor.classList.add('click');
        });

        document.addEventListener('mouseup', function () {
            cursor.classList.remove('click');
        });

        document.querySelectorAll('a, button').forEach(item => {
            item.addEventListener('mouseover', () => {
                cursor.classList.add('hover');
            });
            item.addEventListener('mouseleave', () => {
                cursor.classList.remove('hover');
            });
        });
    }

    // Initialize everything when DOM is ready
    $(document).ready(function () {
        // Add any initialization code here
        console.log('M.S Ungdomsförening website loaded successfully!');
    });

})(jQuery);
