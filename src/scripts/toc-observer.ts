document.addEventListener('DOMContentLoaded', () => {
    const tocLinks = document.querySelectorAll('[data-toc-link]') as NodeListOf<HTMLAnchorElement>;
    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6') as NodeListOf<HTMLElement>;
    
    if (!tocLinks.length || !headings.length) return;

    // Configurar Intersection Observer para detectar en la parte superior
    const observerOptions = {
        root: null,
        rootMargin: '-10px 0px -90% 0px', // Detecta cuando el heading está cerca del top
        threshold: 0
    };

    let currentActiveLink: HTMLAnchorElement | null = null;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const id = entry.target.id;
            const tocLink = document.querySelector(`[data-toc-link="${id}"]`) as HTMLAnchorElement;
            
            if (!tocLink) return;

            if (entry.isIntersecting) {
                // Remover clase active de todos los links
                tocLinks.forEach(link => link.classList.remove('active'));
                
                // Añadir clase active al link actual
                tocLink.classList.add('active');
                currentActiveLink = tocLink;
            }
        });
    }, observerOptions);

    // Observar todos los headings que tienen id
    headings.forEach(heading => {
        if (heading.id) {
            observer.observe(heading);
        }
    });

    // Manejar clicks en el TOC para smooth scroll
    tocLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('data-toc-link');
            const targetElement = document.getElementById(targetId!);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});