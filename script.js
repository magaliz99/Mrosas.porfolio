// ============================================
// AUTO-SCROLL Y CONTROL DE USUARIO
// ============================================

let autoScrollInterval;
let isUserInteracting = false;
let autoScrollSpeed = 2; // píxeles por frame
let pauseTime = 10000; // 10 segundos de pausa

// Iniciar auto-scroll cuando se carga la página
document.addEventListener('DOMContentLoaded', () => {
    startAutoScroll();
    setupUserInteractionListeners();
});

/**
 * Inicia el auto-scroll automático
 */
function startAutoScroll() {
    if (autoScrollInterval) clearInterval(autoScrollInterval);
    
    autoScrollInterval = setInterval(() => {
        if (!isUserInteracting) {
            window.scrollBy({
                top: autoScrollSpeed,
                behavior: 'auto'
            });

            // Detener al llegar al final de la página
            if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100) {
                clearInterval(autoScrollInterval);
            }
        }
    }, 16); // ~60fps
}

/**
 * Configura los listeners para detectar interacción del usuario
 */
function setupUserInteractionListeners() {
    // Al hacer scroll manual
    window.addEventListener('wheel', handleUserInteraction, { passive: true });
    
    // Al tocar la pantalla (móvil)
    window.addEventListener('touchstart', handleUserInteraction, { passive: true });
    window.addEventListener('touchmove', handleUserInteraction, { passive: true });
    
    // Al usar teclado
    window.addEventListener('keydown', (e) => {
        if (['ArrowUp', 'ArrowDown', 'Home', 'End', ' '].includes(e.key)) {
            handleUserInteraction();
        }
    });
}

/**
 * Maneja la interacción del usuario
 */
function handleUserInteraction() {
    isUserInteracting = true;
    
    // Detener el auto-scroll
    if (autoScrollInterval) {
        clearInterval(autoScrollInterval);
    }
    
    // Reanudar después de que el usuario deje de interactuar
    clearTimeout(window.pauseAutoScrollTimer);
    window.pauseAutoScrollTimer = setTimeout(() => {
        isUserInteracting = false;
        startAutoScroll();
    }, pauseTime);
}

// ============================================
// NAVEGACIÓN SUAVE
// ============================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
            handleUserInteraction(); // Detener auto-scroll
            
            targetSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ============================================
// EFECTO DE FADE-IN AL ENTRAR EN VIEWPORT
// ============================================

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observar elementos con animación
document.querySelectorAll('.skill-card, .contact-item, .about-content p').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// ============================================
// DETECCIÓN DE SCROLL PARA NAVBAR
// ============================================

let lastScrollTop = 0;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    if (scrollTop > 100) {
        navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
    }
    
    lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
});

// ============================================
// ACTUALIZAR LINK ACTIVO EN NAVBAR
// ============================================

window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let currentSection = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        if (window.pageYOffset >= sectionTop - 200) {
            currentSection = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === currentSection) {
            link.classList.add('active');
            link.style.color = 'var(--color-accent)';
        } else {
            link.style.color = 'var(--color-text)';
        }
    });
});

// ============================================
// SOPORTE PARA PREFETCH DE RECURSOS
// ============================================

// Precargar fuentes y recursos para mejor rendimiento
if ('requestIdleCallback' in window) {
    requestIdleCallback(() => {
        const link = document.createElement('link');
        link.rel = 'prefetch';
        link.href = 'https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&display=swap';
        document.head.appendChild(link);
    });
}

// ============================================
// LOGEAR INFORMACIÓN (OPCIONAL - para debugging)
// ============================================

console.log('🎨 Portafolio de Magali Rosas cargado correctamente');
console.log('📱 Auto-scroll habilitado - desaparecerá al interactuar');
console.log('✨ Todas las animaciones y efectos activos');
