// ===== Confetti Animation =====
class ConfettiManager {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.particles = [];
        this.colors = ['#a855f7', '#c084fc', '#ec4899', '#f59e0b', '#fbbf24', '#34d399', '#60a5fa'];
        this.resize();
        window.addEventListener('resize', () => this.resize());
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    createParticle(x, y) {
        return {
            x: x || Math.random() * this.canvas.width,
            y: y || -10,
            size: Math.random() * 8 + 4,
            color: this.colors[Math.floor(Math.random() * this.colors.length)],
            speedX: (Math.random() - 0.5) * 6,
            speedY: Math.random() * 4 + 2,
            rotation: Math.random() * 360,
            rotationSpeed: (Math.random() - 0.5) * 10,
            opacity: 1,
            shape: Math.floor(Math.random() * 3), // 0=rect, 1=circle, 2=triangle
        };
    }

    burst(count = 150) {
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 3;
        for (let i = 0; i < count; i++) {
            const p = this.createParticle(centerX, centerY);
            p.speedX = (Math.random() - 0.5) * 16;
            p.speedY = (Math.random() - 0.5) * 16 - 4;
            this.particles.push(p);
        }
    }

    update() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            p.x += p.speedX;
            p.y += p.speedY;
            p.speedY += 0.12; // gravity
            p.speedX *= 0.99; // friction
            p.rotation += p.rotationSpeed;
            p.opacity -= 0.005;

            if (p.opacity <= 0 || p.y > this.canvas.height + 20) {
                this.particles.splice(i, 1);
                continue;
            }

            this.ctx.save();
            this.ctx.translate(p.x, p.y);
            this.ctx.rotate((p.rotation * Math.PI) / 180);
            this.ctx.globalAlpha = p.opacity;
            this.ctx.fillStyle = p.color;

            if (p.shape === 0) {
                this.ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
            } else if (p.shape === 1) {
                this.ctx.beginPath();
                this.ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
                this.ctx.fill();
            } else {
                this.ctx.beginPath();
                this.ctx.moveTo(0, -p.size / 2);
                this.ctx.lineTo(p.size / 2, p.size / 2);
                this.ctx.lineTo(-p.size / 2, p.size / 2);
                this.ctx.closePath();
                this.ctx.fill();
            }

            this.ctx.restore();
        }

        if (this.particles.length > 0) {
            requestAnimationFrame(() => this.update());
        }
    }

    launch() {
        this.burst();
        this.update();
    }
}

// ===== Floating Background Bubbles =====
function createBgBubbles() {
    const container = document.getElementById('bgElements');
    if (!container) return;

    const emojis = ['🎈', '🎊', '🎁', '⭐', '🎀', '✨', '🎉', '💫'];

    for (let i = 0; i < 20; i++) {
        const bubble = document.createElement('div');
        bubble.classList.add('bg-bubble');
        
        const size = Math.random() * 60 + 20;
        const isEmoji = Math.random() > 0.5;
        
        if (isEmoji) {
            bubble.textContent = emojis[Math.floor(Math.random() * emojis.length)];
            bubble.style.fontSize = `${size * 0.6}px`;
            bubble.style.opacity = '0.12';
            bubble.style.display = 'flex';
            bubble.style.alignItems = 'center';
            bubble.style.justifyContent = 'center';
        } else {
            const colors = ['var(--clr-primary)', 'var(--clr-secondary)', 'var(--clr-accent)'];
            bubble.style.background = colors[Math.floor(Math.random() * colors.length)];
        }
        
        bubble.style.width = `${size}px`;
        bubble.style.height = `${size}px`;
        bubble.style.left = `${Math.random() * 100}%`;
        bubble.style.animationDuration = `${Math.random() * 15 + 12}s`;
        bubble.style.animationDelay = `${Math.random() * 10}s`;
        
        container.appendChild(bubble);
    }
}

// ===== Scroll-triggered Animations =====
function initScrollAnimations() {
    const elementsToAnimate = document.querySelectorAll(
        '.letter-card, .photo-card, .quality-card, .wish-card, .section-header, .footer'
    );

    elementsToAnimate.forEach(el => el.classList.add('animate-on-scroll'));

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    // Stagger animation for grid items
                    const siblings = entry.target.parentElement?.querySelectorAll('.animate-on-scroll');
                    if (siblings) {
                        const siblingIndex = Array.from(siblings).indexOf(entry.target);
                        entry.target.style.transitionDelay = `${siblingIndex * 0.1}s`;
                    }
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        },
        {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px',
        }
    );

    elementsToAnimate.forEach(el => observer.observe(el));
}

// ===== Smooth parallax on hero =====
function initHeroParallax() {
    const hero = document.querySelector('.hero-content');
    if (!hero) return;

    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY;
        const rate = scrolled * 0.3;
        hero.style.transform = `translateY(${rate}px)`;
        hero.style.opacity = 1 - scrolled / 700;
    }, { passive: true });
}

// ===== Twinkling star effect on hero =====
function createStars() {
    const hero = document.querySelector('.hero');
    if (!hero) return;

    for (let i = 0; i < 50; i++) {
        const star = document.createElement('div');
        star.style.cssText = `
            position: absolute;
            width: 2px;
            height: 2px;
            background: white;
            border-radius: 50%;
            top: ${Math.random() * 100}%;
            left: ${Math.random() * 100}%;
            opacity: ${Math.random() * 0.5 + 0.1};
            animation: twinkle ${Math.random() * 3 + 2}s ease-in-out infinite;
            animation-delay: ${Math.random() * 3}s;
            pointer-events: none;
        `;
        hero.appendChild(star);
    }

    // Add twinkle keyframes
    const style = document.createElement('style');
    style.textContent = `
        @keyframes twinkle {
            0%, 100% { opacity: 0.1; transform: scale(1); }
            50% { opacity: 0.7; transform: scale(1.5); }
        }
    `;
    document.head.appendChild(style);
}

// ===== Initialize Everything =====
document.addEventListener('DOMContentLoaded', () => {
    // Background elements
    createBgBubbles();
    createStars();

    // Scroll animations
    initScrollAnimations();
    initHeroParallax();

    // Confetti burst on page load
    const canvas = document.getElementById('confettiCanvas');
    if (canvas) {
        const confetti = new ConfettiManager(canvas);
        
        // Initial burst after a small delay
        setTimeout(() => confetti.launch(), 800);
        
        // Burst again when user clicks the CTA or reaches the footer
        const cta = document.querySelector('.cta-btn');
        if (cta) {
            cta.addEventListener('click', (e) => {
                confetti.burst(80);
                confetti.update();
            });
        }

        // Burst when footer comes into view
        const footer = document.querySelector('.footer');
        if (footer) {
            const footerObserver = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting) {
                    confetti.burst(100);
                    confetti.update();
                    footerObserver.unobserve(footer);
                }
            }, { threshold: 0.5 });
            footerObserver.observe(footer);
        }
    }

    // Add smooth hover tilt to cards
    document.querySelectorAll('.glass-card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
        });
    });
});
