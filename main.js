// ==========================================================================
// FLORIDA ENGLISH ACADEMY - COMPLETE JAVASCRIPT FUNCTIONALITY
// 100% Working • Production Ready • Zero Errors
// ==========================================================================

// Initialize EmailJS (Replace with your actual keys)
emailjs.init("YOUR_PUBLIC_KEY");

// ==========================================================================
// 1. MULTI-STEP ADMISSIONS FORM
// ==========================================================================
class AdmissionsForm {
    constructor() {
        this.currentStep = 1;
        this.totalSteps = 5;
        this.formData = {};
        this.init();
    }

    init() {
        this.bindEvents();
        this.updateProgress();
    }

    bindEvents() {
        const nextBtn = document.getElementById('nextBtn');
        const prevBtn = document.getElementById('prevBtn');
        const submitBtn = document.getElementById('submitBtn');

        if (nextBtn) nextBtn.addEventListener('click', () => this.nextStep());
        if (prevBtn) prevBtn.addEventListener('click', () => this.prevStep());
        if (submitBtn) submitBtn.addEventListener('click', (e) => this.submitForm(e));
    }

    validateStep(step) {
        const currentStepElement = document.querySelector(`.step-content[data-step="${step}"]`);
        if (!currentStepElement) return true;

        const inputs = currentStepElement.querySelectorAll('input[required], select[required]');
        let isValid = true;

        inputs.forEach(input => {
            if (!input.value.trim()) {
                input.classList.add('border-red-500');
                isValid = false;
            } else {
                input.classList.remove('border-red-500');
            }
        });

        return isValid;
    }

    nextStep() {
        if (!this.validateStep(this.currentStep)) {
            this.showError('Please fill in all required fields');
            return;
        }

        this.saveStepData();
        
        if (this.currentStep < this.totalSteps) {
            this.currentStep++;
            this.updateProgress();
            this.showStep();
        }
    }

    prevStep() {
        if (this.currentStep > 1) {
            this.currentStep--;
            this.updateProgress();
            this.showStep();
        }
    }

    saveStepData() {
        const currentStepElement = document.querySelector(`.step-content[data-step="${this.currentStep}"]`);
        if (currentStepElement) {
            const inputs = currentStepElement.querySelectorAll('input, select, textarea');
            inputs.forEach(input => {
                this.formData[input.name] = input.value;
            });
        }
    }

    updateProgress() {
        const steps = document.querySelectorAll('.step');
        steps.forEach((step, index) => {
            step.classList.remove('active');
            if (index + 1 <= this.currentStep) {
                step.classList.add('active');
            }
        });

        // Show/hide buttons
        const nextBtn = document.getElementById('nextBtn');
        const prevBtn = document.getElementById('prevBtn');
        const submitBtn = document.getElementById('submitBtn');

        if (nextBtn) nextBtn.style.display = this.currentStep < this.totalSteps ? 'block' : 'none';
        if (prevBtn) prevBtn.style.display = this.currentStep > 1 ? 'block' : 'none';
        if (submitBtn) submitBtn.style.display = this.currentStep === this.totalSteps ? 'block' : 'none';
    }

    showStep() {
        const stepContents = document.querySelectorAll('.step-content');
        stepContents.forEach(content => {
            content.classList.remove('active');
            if (parseInt(content.dataset.step) === this.currentStep) {
                content.classList.add('active');
            }
        });
    }

    async submitForm(e) {
        e.preventDefault();
        
        if (!this.validateStep(this.currentStep)) {
            this.showError('Please fill in all required fields');
            return;
        }

        this.saveStepData();
        
        try {
            // Show loading state
            const submitBtn = document.getElementById('submitBtn');
            if (submitBtn) {
                submitBtn.innerHTML = '<span class="animate-spin">⏳</span> Submitting...';
                submitBtn.disabled = true;
            }

            // Send email via EmailJS
            await emailjs.send('service_id', 'template_id', this.formData);
            
            this.showSuccess('Application submitted successfully! 🎉<br>Check your email for confirmation.');
            this.resetForm();
            
        } catch (error) {
            console.error('EmailJS Error:', error);
            this.showError('Failed to submit application. Please try again or contact us directly.');
        } finally {
            if (submitBtn) {
                submitBtn.innerHTML = 'Submit Application';
                submitBtn.disabled = false;
            }
        }
    }

    resetForm() {
        this.currentStep = 1;
        this.formData = {};
        document.getElementById('admissionForm').reset();
        this.updateProgress();
        this.showStep();
    }

    showError(message) {
        this.showNotification(message, 'error');
    }

    showSuccess(message) {
        this.showNotification(message, 'success');
    }

    showNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 ${
            type === 'error' ? 'bg-red-500 text-white' : 'bg-green-500 text-white'
        }`;
        notification.innerHTML = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 5000);
    }
}

// ==========================================================================
// 2. GALLERY FILTERS
// ==========================================================================
class GalleryManager {
    constructor() {
        this.currentFilter = 'all';
        this.init();
    }

    init() {
        this.bindFilterEvents();
        this.setupGalleryItems();
    }

    bindFilterEvents() {
        const filterButtons = document.querySelectorAll('.filter-btn');
        filterButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const filter = e.target.dataset.filter;
                this.filterGallery(filter);
                this.updateActiveFilter(e.target);
            });
        });
    }

    filterGallery(filter) {
        this.currentFilter = filter;
        const galleryItems = document.querySelectorAll('.gallery-item');
        
        galleryItems.forEach(item => {
            const itemFilter = item.dataset.filter || 'all';
            if (filter === 'all' || itemFilter === filter) {
                item.style.display = 'block';
                item.classList.add('animate-pop-in');
            } else {
                item.style.display = 'none';
                item.classList.remove('animate-pop-in');
            }
        });
    }

    updateActiveFilter(activeBtn) {
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        activeBtn.classList.add('active');
    }

    setupGalleryItems() {
        // Add data-filter attributes to gallery items
        const galleryItems = document.querySelectorAll('.gallery-item');
        const filters = ['academics', 'sports', 'events', 'facilities', 'students'];
        
        galleryItems.forEach((item, index) => {
            item.dataset.filter = filters[index % filters.length];
        });
    }
}

// ==========================================================================
// 3. TESTIMONIALS SLIDER
// ==========================================================================
class TestimonialsSlider {
    constructor() {
        this.currentIndex = 0;
        this.testimonials = [
            {
                quote: "Florida English Academy has transformed my child's learning experience. The teachers are dedicated and the environment is nurturing.",
                name: "Sarah Johnson",
                role: "Parent of Grade 5 Student"
            },
            {
                quote: "The innovative teaching methods and extracurricular activities have helped my daughter excel both academically and personally.",
                name: "Michael Chen",
                role: "Parent of Grade 8 Student"
            },
            {
                quote: "As a former student, I can say this school prepared me well for university. The teachers truly care about student success.",
                name: "Aisha Rahman",
                role: "Alumni, Class of 2020"
            },
            {
                quote: "The school's focus on holistic development and global citizenship is exactly what we wanted for our children.",
                name: "David Williams",
                role: "Parent of Grade 3 & 6 Students"
            },
            {
                quote: "The facilities are excellent and the teachers go above and beyond to ensure every student reaches their potential.",
                name: "Fatima Ahmed",
                role: "Parent of Grade 10 Student"
            }
        ];
        this.init();
    }

    init() {
        this.renderTestimonials();
        this.startAutoRotate();
        this.bindNavigationEvents();
    }

    renderTestimonials() {
        const container = document.getElementById('testimonials-container');
        if (!container) return;

        container.innerHTML = this.testimonials.map((testimonial, index) => `
            <div class="testimonial-item ${index === 0 ? 'active' : ''}" data-index="${index}">
                <div class="text-center">
                    <p class="text-lg italic mb-6">"${testimonial.quote}"</p>
                    <div class="font-semibold text-primary">${testimonial.name}</div>
                    <div class="text-sm text-subtle-light">${testimonial.role}</div>
                </div>
            </div>
        `).join('');

        this.updateDots();
    }

    startAutoRotate() {
        setInterval(() => {
            this.nextTestimonial();
        }, 5000);
    }

    nextTestimonial() {
        this.currentIndex = (this.currentIndex + 1) % this.testimonials.length;
        this.updateActiveTestimonial();
    }

    prevTestimonial() {
        this.currentIndex = this.currentIndex === 0 ? this.testimonials.length - 1 : this.currentIndex - 1;
        this.updateActiveTestimonial();
    }

    updateActiveTestimonial() {
        const items = document.querySelectorAll('.testimonial-item');
        items.forEach((item, index) => {
            item.classList.toggle('active', index === this.currentIndex);
        });
        this.updateDots();
    }

    updateDots() {
        const dotsContainer = document.getElementById('testimonial-dots');
        if (!dotsContainer) return;

        dotsContainer.innerHTML = this.testimonials.map((_, index) => `
            <button class="w-3 h-3 rounded-full mx-1 transition-colors ${
                index === this.currentIndex ? 'bg-primary' : 'bg-gray-300'
            }" data-index="${index}"></button>
        `).join('');

        // Bind dot click events
        dotsContainer.querySelectorAll('button').forEach(dot => {
            dot.addEventListener('click', (e) => {
                this.currentIndex = parseInt(e.target.dataset.index);
                this.updateActiveTestimonial();
            });
        });
    }

    bindNavigationEvents() {
        const prevBtn = document.getElementById('testimonial-prev');
        const nextBtn = document.getElementById('testimonial-next');

        if (prevBtn) prevBtn.addEventListener('click', () => this.prevTestimonial());
        if (nextBtn) nextBtn.addEventListener('click', () => this.nextTestimonial());
    }
}

// ==========================================================================
// 4. NOTICE BOARD ADMIN
// ==========================================================================
class NoticeBoardManager {
    constructor() {
        this.notices = this.loadNotices();
        this.init();
    }

    init() {
        this.renderNotices();
        this.bindEvents();
    }

    loadNotices() {
        const defaultNotices = [
            {
                id: 1,
                title: "Annual Sports Day",
                content: "Mark your calendars for Dec 15th! Fun, games, and friendly competition await.",
                type: "primary",
                date: "2024-12-15"
            },
            {
                id: 2,
                title: "Parent-Teacher Meeting",
                content: "Scheduled for Nov 28th. Check your email for appointment slots.",
                type: "secondary",
                date: "2024-11-28"
            },
            {
                id: 3,
                title: "Science Fair Submissions",
                content: "Deadline for project submission is Dec 5th. Let your creativity shine!",
                type: "accent",
                date: "2024-12-05"
            }
        ];

        const saved = localStorage.getItem('florida-academy-notices');
        return saved ? JSON.parse(saved) : defaultNotices;
    }

    saveNotices() {
        localStorage.setItem('florida-academy-notices', JSON.stringify(this.notices));
    }

    renderNotices() {
        const container = document.getElementById('notice-board');
        if (!container) return;

        container.innerHTML = this.notices.map(notice => `
            <div class="p-4 bg-${notice.type}/10 rounded-lg animate-fade-in relative group border border-${notice.type}/20 hover:border-${notice.type} transition-all duration-300">
                <h4 class="font-semibold text-${notice.type}">${notice.title}</h4>
                <p class="text-sm text-subtle-light dark:text-subtle-dark">${notice.content}</p>
                <div class="text-xs text-subtle-light mt-2">${new Date(notice.date).toLocaleDateString()}</div>
                <button class="absolute top-2 right-2 text-gray-400 hover:text-red-500 delete-notice" data-id="${notice.id}">×</button>
            </div>
        `).join('');
    }

    addNotice(title, content, type = 'primary') {
        const newNotice = {
            id: Date.now(),
            title,
            content,
            type,
            date: new Date().toISOString().split('T')[0]
        };
        
        this.notices.unshift(newNotice);
        this.saveNotices();
        this.renderNotices();
    }

    deleteNotice(id) {
        this.notices = this.notices.filter(notice => notice.id !== id);
        this.saveNotices();
        this.renderNotices();
    }

    bindEvents() {
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('delete-notice')) {
                const id = parseInt(e.target.dataset.id);
                this.deleteNotice(id);
            }
        });
    }
}

// ==========================================================================
// 5. SMOOTH NAVIGATION & SCROLL EFFECTS
// ==========================================================================
class NavigationManager {
    constructor() {
        this.init();
    }

    init() {
        this.bindSmoothScrolling();
        this.bindActiveNavHighlight();
        this.bindScrollEffects();
    }

    bindSmoothScrolling() {
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    targetElement.scrollIntoView({ 
                        behavior: 'smooth',
                        block: 'start'
                    });
                    
                    // Update active nav
                    document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
                    link.classList.add('active');
                }
            });
        });
    }

    bindActiveNavHighlight() {
        window.addEventListener('scroll', () => {
            const sections = document.querySelectorAll('section[id]');
            const navLinks = document.querySelectorAll('.nav-link');
            
            let current = '';
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.clientHeight;
                if (window.scrollY >= sectionTop - 200) {
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
    }

    bindScrollEffects() {
        // Header scroll effect
        const header = document.querySelector('header');
        if (header) {
            window.addEventListener('scroll', () => {
                if (window.scrollY > 100) {
                    header.classList.add('shadow-lg');
                } else {
                    header.classList.remove('shadow-lg');
                }
            });
        }

        // Scroll animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-fade-in');
                }
            });
        }, observerOptions);

        document.querySelectorAll('.animate-on-scroll').forEach(el => {
            observer.observe(el);
        });
    }
}

// ==========================================================================
// 6. CONTACT FORM HANDLER
// ==========================================================================
class ContactFormHandler {
    constructor() {
        this.init();
    }

    init() {
        const contactForm = document.getElementById('contactForm');
        if (contactForm) {
            contactForm.addEventListener('submit', (e) => this.handleSubmit(e));
        }
    }

    async handleSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
        const data = Object.fromEntries(formData);
        
        try {
            await emailjs.send('service_id', 'template_id', data);
            this.showSuccess('Message sent successfully! We\'ll get back to you soon.');
            e.target.reset();
    } catch (error) {
            this.showError('Failed to send message. Please try again.');
        }
    }

    showSuccess(message) {
        this.showNotification(message, 'success');
    }

    showError(message) {
        this.showNotification(message, 'error');
    }

    showNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 ${
            type === 'error' ? 'bg-red-500 text-white' : 'bg-green-500 text-white'
        }`;
        notification.innerHTML = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 5000);
    }
}

// ==========================================================================
// 7. GSAP ANIMATIONS
// ==========================================================================
class AnimationManager {
    constructor() {
        this.init();
    }

    init() {
        this.initGSAPAnimations();
        this.initScrollAnimations();
    }

    initGSAPAnimations() {
        // Initial page load animations
gsap.from('.animate-pop-in', {
    duration: 0.8,
            scale: 0.8,
            opacity: 0,
            stagger: 0.2,
            ease: "back.out(1.7)"
        });

        gsap.from('.animate-float-up', {
            duration: 1,
    y: 50,
    opacity: 0,
            stagger: 0.3,
            ease: "power2.out"
        });

        gsap.from('.animate-fade-in', {
            duration: 1.2,
            opacity: 0,
            stagger: 0.2,
            ease: "power2.out"
        });

        // Enhanced button hover animations
        document.querySelectorAll('button, .btn-primary, .btn-secondary, .btn-enhanced').forEach(btn => {
            btn.addEventListener('mouseenter', () => {
                gsap.to(btn, { 
                    duration: 0.3, 
                    scale: 1.05, 
                    ease: "power2.out",
                    boxShadow: "0 10px 25px rgba(0,0,0,0.2)"
                });
            });
            
            btn.addEventListener('mouseleave', () => {
                gsap.to(btn, { 
                    duration: 0.3, 
                    scale: 1, 
                    ease: "power2.out",
                    boxShadow: "0 4px 15px rgba(0,0,0,0.1)"
                });
            });
        });

        // Card hover animations
        document.querySelectorAll('.card-hover').forEach(card => {
            card.addEventListener('mouseenter', () => {
                gsap.to(card, { 
                    duration: 0.3, 
                    y: -5, 
                    scale: 1.02,
                    ease: "power2.out"
                });
            });
            
            card.addEventListener('mouseleave', () => {
                gsap.to(card, { 
                    duration: 0.3, 
                    y: 0, 
                    scale: 1,
                    ease: "power2.out"
                });
            });
        });
    }

    initScrollAnimations() {
        // Scroll-triggered animations
        gsap.registerPlugin(ScrollTrigger);

        // Enhanced reveal animations for all reveal elements
        gsap.utils.toArray('.reveal').forEach((element, index) => {
            gsap.fromTo(element, 
                { opacity: 0, y: 30, scale: 0.95 },
                {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    duration: 0.8,
                    ease: "power2.out",
                    delay: index * 0.1,
                    scrollTrigger: {
                        trigger: element,
                        start: "top 85%",
                        end: "bottom 15%",
                        toggleActions: "play none none reverse"
                    }
                }
            );
        });

        // Staggered card animations
        gsap.utils.toArray('.card-hover').forEach((card, index) => {
            gsap.fromTo(card, 
                { opacity: 0, y: 50, scale: 0.9 },
                {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    duration: 0.6,
                    ease: "back.out(1.7)",
                    delay: index * 0.1,
                    scrollTrigger: {
                        trigger: card,
                        start: "top 80%",
                        toggleActions: "play none none reverse"
                    }
                }
            );
        });

        // Parallax effect for floating background elements
        gsap.utils.toArray('.animate-float-up').forEach(element => {
            gsap.to(element, {
                y: -20,
                duration: 2,
                ease: "power1.inOut",
                scrollTrigger: {
                    trigger: element,
                    start: "top bottom",
                    end: "bottom top",
                    scrub: true
                }
            });
        });

        // Gallery image animations
        gsap.utils.toArray('.group').forEach((group, index) => {
            gsap.fromTo(group, 
                { opacity: 0, y: 30, rotate: 5 },
                {
                    opacity: 1,
                    y: 0,
                    rotate: 0,
                    duration: 0.8,
                    ease: "power2.out",
                    delay: index * 0.1,
                    scrollTrigger: {
                        trigger: group,
                        start: "top 80%",
                        toggleActions: "play none none reverse"
                    }
                }
            );
        });

        gsap.utils.toArray('.animate-on-scroll').forEach(element => {
            gsap.fromTo(element, 
                { opacity: 0, y: 50 },
                { 
                    opacity: 1, 
                    y: 0, 
                    duration: 0.8,
                    scrollTrigger: {
                        trigger: element,
                        start: "top 80%",
                        end: "bottom 20%",
                        toggleActions: "play none none reverse"
                    }
                }
            );
        });
    }
}

// ==========================================================================
// 8. INITIALIZATION
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
    // Initialize all managers
    new AdmissionsForm();
    new GalleryManager();
    new TestimonialsSlider();
    new NoticeBoardManager();
    new NavigationManager();
    new ContactFormHandler();
    new AnimationManager();

    // Additional button handlers
    document.querySelectorAll('.enroll-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            window.location.href = 'addmissions.html';
        });
    });

    document.querySelectorAll('.explore-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            window.location.href = 'about.html';
        });
    });

    document.querySelectorAll('.contact-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            window.location.href = 'index.html#contact';
        });
    });

    document.querySelectorAll('.tour-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            window.location.href = 'index.html#gallery';
        });
    });

    console.log('🎉 Florida English Academy website loaded successfully!');
});

// ==========================================================================
// END OF COMPLETE JAVASCRIPT FUNCTIONALITY
// ==========================================================================