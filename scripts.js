 // Mobile menu toggle
        document.getElementById('mobile-menu-button').addEventListener('click', function() {
            const menu = document.getElementById('mobile-menu');
            menu.classList.toggle('hidden');
        });
        
        // Smooth scrolling for navigation links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 80,
                        behavior: 'smooth'
                    });
                    
                    // Close mobile menu if open
                    const mobileMenu = document.getElementById('mobile-menu');
                    if (!mobileMenu.classList.contains('hidden')) {
                        mobileMenu.classList.add('hidden');
                    }
                }
            });
        });
        
        // Counter animation
        function animateCounter(elementId, target, duration = 2000) {
            const element = document.getElementById(elementId);
            const start = 0;
            const increment = target / (duration / 16);
            let current = start;
            
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    clearInterval(timer);
                    current = target;
                }
                element.textContent = Math.floor(current);
            }, 16);
        }
        
        // Start counters when about section is in view
        const aboutSection = document.getElementById('about');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter('years-counter', 5);
                    animateCounter('projects-counter', 14);
                    observer.unobserve(aboutSection);
                }
            });
        }, { threshold: 0.5 });
        
        observer.observe(aboutSection);
        
        // Form submission
        const contactForm = document.querySelector('form');
        if (contactForm) {
            contactForm.addEventListener('submit', function(e) {
                e.preventDefault();
                alert('Thank you for your message! We will contact you soon.');
                this.reset();
            });
        }
        //servicios
        const toggleButton = document.getElementById("toggleServices");
        const hiddenCards = document.querySelectorAll(".service-card.hidden");

        let isExpanded = false;

        toggleButton.addEventListener("click", () => {
            isExpanded = !isExpanded;

            hiddenCards.forEach(card => {
            card.classList.toggle("hidden");
            });

            toggleButton.textContent = isExpanded ? "Mostrar menos" : "Ver todos los servicios";
        });

        //proyectos
         const toggleProjectsBtn = document.getElementById("toggleProjects");
        const hiddenProjects = document.querySelectorAll(".project-card.hidden");
        let projectsExpanded = false;

        toggleProjectsBtn.addEventListener("click", () => {
            projectsExpanded = !projectsExpanded;
            hiddenProjects.forEach(card => card.classList.toggle("hidden"));
            toggleProjectsBtn.textContent = projectsExpanded ? "Mostrar menos" : "Ver todos los proyectos";
        });
         //Botón para volver arriba
         // Mostrar el botón al hacer scroll
  window.addEventListener("scroll", () => {
    const btn = document.getElementById("scrollToTopBtn");
    if (window.scrollY > 200) {
      btn.classList.remove("hidden");
    } else {
      btn.classList.add("hidden");
    }
  });

  // Scroll suave al hacer clic
  document.getElementById("scrollToTopBtn").addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

