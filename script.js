// ===========================
//  Birthday Balloon Pop Game
// ===========================

// ---- Configuration ----
// Edit these to customize the balloons, photos, and captions!
const BALLOON_DATA = [
    {
        color: '#f472b6',       // pink
        caption: '[Caption: Describe memory 1 — replace with a real caption]',
        photo: null,            // Set to 'photos/photo1.jpg' when ready
    },
    {
        color: '#a78bfa',       // purple
        caption: '[Caption: Describe memory 2 — replace with a real caption]',
        photo: null,
    },
    {
        color: '#f6c445',       // gold
        caption: '[Caption: Describe memory 3 — replace with a real caption]',
        photo: null,
    },
    {
        color: '#60a5fa',       // blue
        caption: '[Caption: Describe memory 4 — replace with a real caption]',
        photo: null,
    },
    {
        color: '#fb7185',       // coral
        caption: '[Caption: Describe memory 5 — replace with a real caption]',
        photo: null,
    },
    {
        color: '#5eead4',       // teal
        caption: '[Caption: Describe memory 6 — replace with a real caption]',
        photo: null,
    },
];

// ---- Particle Background ----
class ParticleBackground {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.particles = [];
        this.resize();
        window.addEventListener('resize', () => this.resize());
        this.init();
        this.animate();
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    init() {
        const count = Math.min(60, Math.floor((window.innerWidth * window.innerHeight) / 15000));
        for (let i = 0; i < count; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                size: Math.random() * 2 + 0.5,
                speedX: (Math.random() - 0.5) * 0.3,
                speedY: (Math.random() - 0.5) * 0.3,
                opacity: Math.random() * 0.4 + 0.1,
                pulse: Math.random() * Math.PI * 2,
            });
        }
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        for (const p of this.particles) {
            p.x += p.speedX;
            p.y += p.speedY;
            p.pulse += 0.015;
            
            // Wrap around
            if (p.x < 0) p.x = this.canvas.width;
            if (p.x > this.canvas.width) p.x = 0;
            if (p.y < 0) p.y = this.canvas.height;
            if (p.y > this.canvas.height) p.y = 0;

            const currentOpacity = p.opacity * (0.6 + Math.sin(p.pulse) * 0.4);
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(255, 255, 255, ${currentOpacity})`;
            this.ctx.fill();
        }

        requestAnimationFrame(() => this.animate());
    }
}

// ---- Confetti System ----
class Confetti {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.pieces = [];
        this.running = false;
        this.resize();
        window.addEventListener('resize', () => this.resize());
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    burst(x, y, count = 60, spread = 12) {
        for (let i = 0; i < count; i++) {
            this.pieces.push({
                x: x,
                y: y,
                size: Math.random() * 7 + 3,
                color: ['#f6c445', '#f472b6', '#a78bfa', '#60a5fa', '#fb7185', '#5eead4', '#fbbf24'][
                    Math.floor(Math.random() * 7)
                ],
                vx: (Math.random() - 0.5) * spread,
                vy: (Math.random() - 0.5) * spread - 3,
                rotation: Math.random() * 360,
                rotSpeed: (Math.random() - 0.5) * 12,
                life: 1,
                decay: Math.random() * 0.008 + 0.005,
                shape: Math.floor(Math.random() * 3),
            });
        }
        if (!this.running) {
            this.running = true;
            this.animate();
        }
    }

    bigCelebration() {
        const w = this.canvas.width;
        const h = this.canvas.height;
        // Multiple bursts across the screen
        for (let i = 0; i < 5; i++) {
            setTimeout(() => {
                this.burst(Math.random() * w, Math.random() * h * 0.5, 80, 18);
            }, i * 300);
        }
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        for (let i = this.pieces.length - 1; i >= 0; i--) {
            const p = this.pieces[i];
            p.x += p.vx;
            p.y += p.vy;
            p.vy += 0.15; // gravity
            p.vx *= 0.99;
            p.rotation += p.rotSpeed;
            p.life -= p.decay;

            if (p.life <= 0) {
                this.pieces.splice(i, 1);
                continue;
            }

            this.ctx.save();
            this.ctx.translate(p.x, p.y);
            this.ctx.rotate((p.rotation * Math.PI) / 180);
            this.ctx.globalAlpha = p.life;
            this.ctx.fillStyle = p.color;

            if (p.shape === 0) {
                this.ctx.fillRect(-p.size / 2, -p.size / 3, p.size, p.size * 0.6);
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

        if (this.pieces.length > 0) {
            requestAnimationFrame(() => this.animate());
        } else {
            this.running = false;
        }
    }
}

// ---- Balloon Manager ----
class BalloonManager {
    constructor(arena, confetti) {
        this.arena = arena;
        this.confetti = confetti;
        this.balloons = [];
        this.popped = 0;
        this.total = BALLOON_DATA.length;
        
        document.getElementById('totalCount').textContent = this.total;
        this.createBalloons();
    }

    createBalloons() {
        const positions = this.getPositions();
        
        BALLOON_DATA.forEach((data, i) => {
            const wrapper = document.createElement('div');
            wrapper.classList.add('balloon-wrapper');
            wrapper.style.animationDuration = `${3 + Math.random() * 3}s`;
            wrapper.style.animationDelay = `${i * 0.15}s`;
            
            const pos = positions[i];
            wrapper.style.left = pos.x + 'px';
            wrapper.style.top = pos.y + 'px';

            const balloon = document.createElement('div');
            balloon.classList.add('balloon');
            balloon.style.background = `radial-gradient(circle at 35% 30%, ${this.lighten(data.color, 30)}, ${data.color} 60%, ${this.darken(data.color, 20)})`;
            balloon.style.setProperty('--balloon-color', data.color);

            const string = document.createElement('div');
            string.classList.add('balloon-string');
            string.style.animationDuration = `${3 + Math.random() * 2}s`;

            wrapper.appendChild(balloon);
            wrapper.appendChild(string);

            wrapper.addEventListener('click', (e) => this.pop(wrapper, data, e));
            wrapper.addEventListener('touchend', (e) => {
                e.preventDefault();
                this.pop(wrapper, data, e);
            });

            this.arena.appendChild(wrapper);
            this.balloons.push(wrapper);
        });
    }

    getPositions() {
        const w = this.arena.clientWidth || window.innerWidth;
        const h = this.arena.clientHeight || window.innerHeight;
        const balloonW = 80;
        const balloonH = 100;
        const padding = 30;
        const positions = [];
        const cols = Math.min(3, Math.ceil(Math.sqrt(this.total)));
        const rows = Math.ceil(this.total / cols);
        
        const areaW = w - balloonW - padding * 2;
        const areaH = h - balloonH - padding * 2 - 120; // top header space
        const cellW = areaW / cols;
        const cellH = areaH / rows;

        for (let i = 0; i < this.total; i++) {
            const col = i % cols;
            const row = Math.floor(i / cols);
            positions.push({
                x: padding + col * cellW + (cellW - balloonW) / 2 + (Math.random() - 0.5) * 30,
                y: 100 + padding + row * cellH + (cellH - balloonH) / 2 + (Math.random() - 0.5) * 20,
            });
        }
        return positions;
    }

    pop(wrapper, data, event) {
        if (wrapper.classList.contains('popping')) return;
        
        // Pop animation
        wrapper.classList.add('popping');
        
        // Spawn pop particles
        const rect = wrapper.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        
        this.spawnPopParticles(cx, cy, data.color);
        this.confetti.burst(cx, cy, 30, 8);

        // Play pop sound effect (optional - uses Web Audio)
        this.playPopSound();

        // Update counter
        this.popped++;
        document.getElementById('poppedCount').textContent = this.popped;

        // Show photo modal after small delay
        setTimeout(() => {
            showPhotoModal(data);
            wrapper.style.display = 'none';
        }, 350);

        // Show skip button after 2 balloons popped
        if (this.popped >= 2) {
            document.getElementById('skipToEnd').style.display = 'block';
        }

        // All popped?
        if (this.popped >= this.total) {
            setTimeout(() => {
                goToFinalScreen();
            }, 800);
        }
    }

    spawnPopParticles(x, y, color) {
        for (let i = 0; i < 12; i++) {
            const particle = document.createElement('div');
            particle.classList.add('pop-particle');
            const angle = (i / 12) * Math.PI * 2;
            const distance = 40 + Math.random() * 60;
            particle.style.setProperty('--tx', `${Math.cos(angle) * distance}px`);
            particle.style.setProperty('--ty', `${Math.sin(angle) * distance}px`);
            particle.style.background = color;
            particle.style.left = x + 'px';
            particle.style.top = y + 'px';
            particle.style.position = 'fixed';
            particle.style.zIndex = '100';
            document.body.appendChild(particle);
            setTimeout(() => particle.remove(), 700);
        }
    }

    playPopSound() {
        try {
            const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioCtx.createOscillator();
            const gainNode = audioCtx.createGain();
            oscillator.connect(gainNode);
            gainNode.connect(audioCtx.destination);
            oscillator.frequency.setValueAtTime(600, audioCtx.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(100, audioCtx.currentTime + 0.15);
            gainNode.gain.setValueAtTime(0.15, audioCtx.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.2);
            oscillator.start(audioCtx.currentTime);
            oscillator.stop(audioCtx.currentTime + 0.2);
        } catch (e) {
            // Audio not supported, no problem
        }
    }

    lighten(hex, percent) {
        const num = parseInt(hex.slice(1), 16);
        const r = Math.min(255, (num >> 16) + Math.floor(255 * percent / 100));
        const g = Math.min(255, ((num >> 8) & 0xff) + Math.floor(255 * percent / 100));
        const b = Math.min(255, (num & 0xff) + Math.floor(255 * percent / 100));
        return `rgb(${r},${g},${b})`;
    }

    darken(hex, percent) {
        const num = parseInt(hex.slice(1), 16);
        const r = Math.max(0, (num >> 16) - Math.floor(255 * percent / 100));
        const g = Math.max(0, ((num >> 8) & 0xff) - Math.floor(255 * percent / 100));
        const b = Math.max(0, (num & 0xff) - Math.floor(255 * percent / 100));
        return `rgb(${r},${g},${b})`;
    }
}

// ---- Screen Navigation ----
function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(screenId).classList.add('active');
    
    if (screenId === 'finalScreen') {
        document.body.classList.add('scrollable');
    } else {
        document.body.classList.remove('scrollable');
    }
}

// ---- Photo Modal ----
function showPhotoModal(data) {
    const modal = document.getElementById('photoModal');
    const photoContainer = document.getElementById('modalPhoto');
    const caption = document.getElementById('modalCaption');

    // Set content
    if (data.photo) {
        photoContainer.innerHTML = `<img src="${data.photo}" alt="${data.caption}">`;
    } else {
        photoContainer.innerHTML = `
            <span class="placeholder-icon">📷</span>
            <span class="placeholder-text">Photo Placeholder</span>
        `;
    }
    caption.textContent = data.caption;
    modal.classList.add('active');
}

function closePhotoModal() {
    document.getElementById('photoModal').classList.remove('active');
}

// ---- Final Screen Transition ----
let confettiInstance;

function goToFinalScreen() {
    closePhotoModal();
    setTimeout(() => {
        showScreen('finalScreen');
        // Big celebration confetti
        setTimeout(() => {
            confettiInstance.bigCelebration();
        }, 500);
    }, 300);
}

// ---- Initialize ----
document.addEventListener('DOMContentLoaded', () => {
    // Particle background
    const particleCanvas = document.getElementById('particleCanvas');
    new ParticleBackground(particleCanvas);

    // Confetti system
    const confettiCanvas = document.getElementById('confettiCanvas');
    confettiInstance = new Confetti(confettiCanvas);

    // Start button → Balloon screen
    document.getElementById('startBtn').addEventListener('click', () => {
        confettiInstance.burst(window.innerWidth / 2, window.innerHeight / 2, 50, 10);
        
        setTimeout(() => {
            showScreen('balloonScreen');
            // Init balloons after screen transition
            setTimeout(() => {
                const arena = document.getElementById('balloonArena');
                new BalloonManager(arena, confettiInstance);
            }, 300);
        }, 400);
    });

    // Modal close handlers
    document.getElementById('modalClose').addEventListener('click', closePhotoModal);
    document.getElementById('modalBackdrop').addEventListener('click', closePhotoModal);
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closePhotoModal();
    });

    // Skip to final screen
    document.getElementById('skipToEnd').addEventListener('click', goToFinalScreen);

    // Show intro screen
    showScreen('introScreen');
});
