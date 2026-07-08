// ===========================
//  Birthday Balloon Pop Game
// ===========================

// ---- Configuration ----
// Each balloon holds a photo or video (or both).
// Balloons float around the screen with physics-based motion.
// Tap/click to pop and reveal the memory!

const BALLOON_DATA = [
    // --- Photos ---
    { color: '#f472b6', caption: '[Caption for photo 1]', photo: 'photos/photo1.jpeg', video: null, emoji: '📸' },
    { color: '#a78bfa', caption: '[Caption for photo 2]', photo: 'photos/photo2.jpeg', video: null, emoji: '📸' },
    { color: '#f6c445', caption: '[Caption for photo 3]', photo: 'photos/photo3.jpeg', video: null, emoji: '📸' },
    { color: '#60a5fa', caption: '[Caption for photo 4]', photo: 'photos/photo4.jpeg', video: null, emoji: '📸' },
    { color: '#fb7185', caption: '[Caption for photo 5]', photo: 'photos/photo5.jpeg', video: null, emoji: '📸' },
    { color: '#5eead4', caption: '[Caption for photo 6]', photo: 'photos/photo6.jpeg', video: null, emoji: '📸' },
    { color: '#c084fc', caption: '[Caption for photo 7]', photo: 'photos/photo7.jpeg', video: null, emoji: '📸' },
    { color: '#fbbf24', caption: '[Caption for photo 8]', photo: 'photos/photo8.jpeg', video: null, emoji: '📸' },
    { color: '#f0abfc', caption: '[Caption for photo 9]', photo: 'photos/photo9.jpeg', video: null, emoji: '📸' },
    // --- Videos ---
    { color: '#f472b6', caption: '[Caption for video 1]',  photo: null, video: 'videos/video1.mp4',  emoji: '🎬' },
    { color: '#a78bfa', caption: '[Caption for video 2]',  photo: null, video: 'videos/video2.mp4',  emoji: '🎬' },
    { color: '#f6c445', caption: '[Caption for video 3]',  photo: null, video: 'videos/video3.mp4',  emoji: '🎬' },
    { color: '#60a5fa', caption: '[Caption for video 4]',  photo: null, video: 'videos/video4.mp4',  emoji: '🎬' },
    { color: '#fb7185', caption: '[Caption for video 5]',  photo: null, video: 'videos/video5.mp4',  emoji: '🎬' },
    { color: '#5eead4', caption: '[Caption for video 6]',  photo: null, video: 'videos/video6.mp4',  emoji: '🎬' },
    { color: '#c084fc', caption: '[Caption for video 7]',  photo: null, video: 'videos/video7.mp4',  emoji: '🎬' },
    { color: '#fbbf24', caption: '[Caption for video 8]',  photo: null, video: 'videos/video8.mp4',  emoji: '🎬' },
    { color: '#f0abfc', caption: '[Caption for video 9]',  photo: null, video: 'videos/video9.mp4',  emoji: '🎬' },
    { color: '#34d399', caption: '[Caption for video 10]', photo: null, video: 'videos/video10.mp4', emoji: '🎬' },
    { color: '#fb923c', caption: '[Caption for video 11]', photo: null, video: 'videos/video11.mp4', emoji: '🎬' },
    { color: '#818cf8', caption: '[Caption for video 12]', photo: null, video: 'videos/video12.mp4', emoji: '🎬' },
    { color: '#e879f9', caption: '[Caption for video 13]', photo: null, video: 'videos/video13.mp4', emoji: '🎬' },
    { color: '#2dd4bf', caption: '[Caption for video 14]', photo: null, video: 'videos/video14.mp4', emoji: '🎬' },
];

// Shuffle array so photos and videos are mixed randomly
function shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

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
        const count = Math.min(50, Math.floor((window.innerWidth * window.innerHeight) / 18000));
        for (let i = 0; i < count; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                size: Math.random() * 2 + 0.5,
                speedX: (Math.random() - 0.5) * 0.3,
                speedY: (Math.random() - 0.5) * 0.3,
                opacity: Math.random() * 0.3 + 0.1,
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
            if (p.x < 0) p.x = this.canvas.width;
            if (p.x > this.canvas.width) p.x = 0;
            if (p.y < 0) p.y = this.canvas.height;
            if (p.y > this.canvas.height) p.y = 0;
            const alpha = p.opacity * (0.6 + Math.sin(p.pulse) * 0.4);
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(255,255,255,${alpha})`;
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

    burst(x, y, count = 40, spread = 10) {
        const colors = ['#f6c445', '#f472b6', '#a78bfa', '#60a5fa', '#fb7185', '#5eead4', '#fbbf24'];
        for (let i = 0; i < count; i++) {
            this.pieces.push({
                x, y,
                size: Math.random() * 7 + 3,
                color: colors[Math.floor(Math.random() * colors.length)],
                vx: (Math.random() - 0.5) * spread,
                vy: (Math.random() - 0.5) * spread - 4,
                rotation: Math.random() * 360,
                rotSpeed: (Math.random() - 0.5) * 12,
                life: 1,
                decay: Math.random() * 0.008 + 0.005,
                shape: Math.floor(Math.random() * 3),
            });
        }
        if (!this.running) { this.running = true; this.animate(); }
    }

    bigCelebration() {
        const w = this.canvas.width, h = this.canvas.height;
        for (let i = 0; i < 6; i++) {
            setTimeout(() => this.burst(Math.random() * w, Math.random() * h * 0.5, 80, 18), i * 250);
        }
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        for (let i = this.pieces.length - 1; i >= 0; i--) {
            const p = this.pieces[i];
            p.x += p.vx; p.y += p.vy;
            p.vy += 0.15; p.vx *= 0.99;
            p.rotation += p.rotSpeed;
            p.life -= p.decay;
            if (p.life <= 0) { this.pieces.splice(i, 1); continue; }
            this.ctx.save();
            this.ctx.translate(p.x, p.y);
            this.ctx.rotate(p.rotation * Math.PI / 180);
            this.ctx.globalAlpha = p.life;
            this.ctx.fillStyle = p.color;
            if (p.shape === 0) this.ctx.fillRect(-p.size/2, -p.size/3, p.size, p.size*0.6);
            else if (p.shape === 1) { this.ctx.beginPath(); this.ctx.arc(0,0,p.size/2,0,Math.PI*2); this.ctx.fill(); }
            else { this.ctx.beginPath(); this.ctx.moveTo(0,-p.size/2); this.ctx.lineTo(p.size/2,p.size/2); this.ctx.lineTo(-p.size/2,p.size/2); this.ctx.closePath(); this.ctx.fill(); }
            this.ctx.restore();
        }
        if (this.pieces.length > 0) requestAnimationFrame(() => this.animate());
        else this.running = false;
    }
}

// ---- Physics-Based Balloon Manager ----
class BalloonManager {
    constructor(arena, confetti) {
        this.arena = arena;
        this.confetti = confetti;
        this.items = shuffle(BALLOON_DATA);
        this.balloonState = []; // physics state for each balloon
        this.popped = 0;
        this.total = this.items.length;
        this.animating = true;
        this.modalOpen = false;

        document.getElementById('totalCount').textContent = this.total;
        this.createBalloons();
        this.startPhysicsLoop();
    }

    createBalloons() {
        const w = this.arena.clientWidth || window.innerWidth;
        const h = this.arena.clientHeight || window.innerHeight;

        this.items.forEach((data, i) => {
            const wrapper = document.createElement('div');
            wrapper.classList.add('balloon-wrapper');

            const balloon = document.createElement('div');
            balloon.classList.add('balloon');
            const light = this.lighten(data.color, 30);
            const dark = this.darken(data.color, 20);
            balloon.style.background = `radial-gradient(circle at 35% 30%, ${light}, ${data.color} 60%, ${dark})`;
            balloon.style.setProperty('--balloon-color', data.color);

            const label = document.createElement('div');
            label.classList.add('balloon-label');
            label.textContent = data.emoji || '🎈';

            const string = document.createElement('div');
            string.classList.add('balloon-string');

            wrapper.appendChild(balloon);
            wrapper.appendChild(label);
            wrapper.appendChild(string);

            wrapper.addEventListener('click', () => this.pop(i));
            wrapper.addEventListener('touchend', (e) => { e.preventDefault(); this.pop(i); });

            this.arena.appendChild(wrapper);

            // Physics state — random position and velocity
            const bw = 72, bh = 90;
            this.balloonState.push({
                el: wrapper,
                x: Math.random() * (w - bw - 40) + 20,
                y: Math.random() * (h - bh - 160) + 100,
                vx: (Math.random() - 0.5) * 1.2,
                vy: (Math.random() - 0.5) * 0.8 - 0.3, // slight upward bias
                width: bw,
                height: bh,
                alive: true,
                wobble: Math.random() * Math.PI * 2, // for gentle sway
                wobbleSpeed: 0.01 + Math.random() * 0.015,
                wobbleAmp: 8 + Math.random() * 12,
            });
        });
    }

    startPhysicsLoop() {
        const loop = () => {
            if (!this.animating) return;
            this.updatePhysics();
            requestAnimationFrame(loop);
        };
        requestAnimationFrame(loop);
    }

    updatePhysics() {
        const w = this.arena.clientWidth || window.innerWidth;
        const h = this.arena.clientHeight || window.innerHeight;
        const padding = 10;
        const topBound = 80; // below header

        for (const b of this.balloonState) {
            if (!b.alive) continue;

            // Update wobble
            b.wobble += b.wobbleSpeed;
            const wobbleX = Math.sin(b.wobble) * b.wobbleAmp * 0.05;

            // Move
            b.x += b.vx + wobbleX;
            b.y += b.vy;

            // Bounce off walls
            if (b.x < padding) { b.x = padding; b.vx = Math.abs(b.vx) * 0.8; }
            if (b.x > w - b.width - padding) { b.x = w - b.width - padding; b.vx = -Math.abs(b.vx) * 0.8; }
            if (b.y < topBound) { b.y = topBound; b.vy = Math.abs(b.vy) * 0.8; }
            if (b.y > h - b.height - 60) { b.y = h - b.height - 60; b.vy = -Math.abs(b.vy) * 0.8; }

            // Gentle random force (wind-like)
            b.vx += (Math.random() - 0.5) * 0.04;
            b.vy += (Math.random() - 0.5) * 0.03 - 0.005; // slight float up

            // Speed limit
            const maxSpeed = 1.5;
            b.vx = Math.max(-maxSpeed, Math.min(maxSpeed, b.vx));
            b.vy = Math.max(-maxSpeed, Math.min(maxSpeed, b.vy));

            // Gentle drag
            b.vx *= 0.998;
            b.vy *= 0.998;

            // Apply position + gentle rotation from velocity
            const rotate = b.vx * 3;
            b.el.style.transform = `translate(${b.x}px, ${b.y}px) rotate(${rotate}deg)`;
        }

        // Simple collision avoidance between balloons
        for (let i = 0; i < this.balloonState.length; i++) {
            for (let j = i + 1; j < this.balloonState.length; j++) {
                const a = this.balloonState[i];
                const bObj = this.balloonState[j];
                if (!a.alive || !bObj.alive) continue;

                const dx = (a.x + a.width/2) - (bObj.x + bObj.width/2);
                const dy = (a.y + a.height/2) - (bObj.y + bObj.height/2);
                const dist = Math.sqrt(dx*dx + dy*dy);
                const minDist = 70;

                if (dist < minDist && dist > 0) {
                    const pushX = (dx / dist) * 0.3;
                    const pushY = (dy / dist) * 0.3;
                    a.vx += pushX; a.vy += pushY;
                    bObj.vx -= pushX; bObj.vy -= pushY;
                }
            }
        }
    }

    pop(index) {
        const state = this.balloonState[index];
        if (!state.alive || state.el.classList.contains('popping')) return;

        state.alive = false;
        state.el.classList.add('popping');

        // Particles + confetti
        const rect = state.el.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        this.spawnPopParticles(cx, cy, this.items[index].color);
        this.confetti.burst(cx, cy, 25, 8);
        this.playPopSound();

        this.popped++;
        document.getElementById('poppedCount').textContent = this.popped;
        document.getElementById('progressBar').style.width = `${(this.popped / this.total) * 100}%`;

        // Fun instruction updates
        if (this.popped === 1) {
            document.getElementById('balloonInstruction').textContent = '🎉 Great! Keep popping!';
        } else if (this.popped === Math.floor(this.total / 2)) {
            document.getElementById('balloonInstruction').textContent = '🔥 Halfway there! So many memories!';
        } else if (this.popped === this.total - 1) {
            document.getElementById('balloonInstruction').textContent = '✨ Last one!';
        }

        setTimeout(() => {
            state.el.style.display = 'none';
            showMediaModal(this.items[index]);
        }, 350);

        if (this.popped >= 3) {
            document.getElementById('skipToEnd').style.display = 'block';
        }

        if (this.popped >= this.total) {
            setTimeout(() => goToFinalScreen(), 800);
        }
    }

    spawnPopParticles(x, y, color) {
        for (let i = 0; i < 14; i++) {
            const p = document.createElement('div');
            p.classList.add('pop-particle');
            const angle = (i / 14) * Math.PI * 2;
            const dist = 50 + Math.random() * 70;
            p.style.setProperty('--tx', `${Math.cos(angle) * dist}px`);
            p.style.setProperty('--ty', `${Math.sin(angle) * dist}px`);
            p.style.background = color;
            p.style.left = x + 'px';
            p.style.top = y + 'px';
            document.body.appendChild(p);
            setTimeout(() => p.remove(), 700);
        }
    }

    playPopSound() {
        try {
            const ctx = new (window.AudioContext || window.webkitAudioContext)();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain); gain.connect(ctx.destination);
            osc.frequency.setValueAtTime(600, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.15);
            gain.gain.setValueAtTime(0.12, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
            osc.start(ctx.currentTime); osc.stop(ctx.currentTime + 0.2);
        } catch(e) {}
    }

    lighten(hex, pct) {
        const n = parseInt(hex.slice(1), 16);
        const r = Math.min(255, (n >> 16) + Math.floor(255 * pct / 100));
        const g = Math.min(255, ((n >> 8) & 0xff) + Math.floor(255 * pct / 100));
        const b = Math.min(255, (n & 0xff) + Math.floor(255 * pct / 100));
        return `rgb(${r},${g},${b})`;
    }

    darken(hex, pct) {
        const n = parseInt(hex.slice(1), 16);
        const r = Math.max(0, (n >> 16) - Math.floor(255 * pct / 100));
        const g = Math.max(0, ((n >> 8) & 0xff) - Math.floor(255 * pct / 100));
        const b = Math.max(0, (n & 0xff) - Math.floor(255 * pct / 100));
        return `rgb(${r},${g},${b})`;
    }
}

// ---- Screen Navigation ----
function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(screenId).classList.add('active');
    if (screenId === 'finalScreen') document.body.classList.add('scrollable');
    else document.body.classList.remove('scrollable');
}

// ---- Media Modal ----
function showMediaModal(data) {
    const modal = document.getElementById('photoModal');
    const container = document.getElementById('modalPhoto');
    const caption = document.getElementById('modalCaption');

    if (data.video) {
        container.innerHTML = `
            <video src="${data.video}" playsinline autoplay controls
                   poster="${data.photo || ''}"
                   style="width:100%;height:100%;object-fit:cover;border-radius:16px;background:#000;">
                Your browser does not support video.
            </video>`;
    } else if (data.photo) {
        container.innerHTML = `<img src="${data.photo}" alt="${data.caption}"
            style="width:100%;height:100%;object-fit:cover;border-radius:16px;">`;
    } else {
        container.innerHTML = '<span class="placeholder-icon">📷</span>';
    }

    caption.textContent = data.caption;
    modal.classList.add('active');
}

function closeMediaModal() {
    const modal = document.getElementById('photoModal');
    const video = modal.querySelector('video');
    if (video) video.pause();
    modal.classList.remove('active');
}

// ---- Final Screen ----
let confettiInstance;

function goToFinalScreen() {
    closeMediaModal();
    setTimeout(() => {
        showScreen('finalScreen');
        setTimeout(() => confettiInstance.bigCelebration(), 400);
    }, 300);
}

// ---- Init ----
document.addEventListener('DOMContentLoaded', () => {
    new ParticleBackground(document.getElementById('particleCanvas'));
    confettiInstance = new Confetti(document.getElementById('confettiCanvas'));

    document.getElementById('startBtn').addEventListener('click', () => {
        confettiInstance.burst(window.innerWidth / 2, window.innerHeight / 2, 50, 10);
        setTimeout(() => {
            showScreen('balloonScreen');
            setTimeout(() => {
                new BalloonManager(document.getElementById('balloonArena'), confettiInstance);
            }, 300);
        }, 400);
    });

    document.getElementById('modalClose').addEventListener('click', closeMediaModal);
    document.getElementById('modalBackdrop').addEventListener('click', closeMediaModal);
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeMediaModal(); });
    document.getElementById('skipToEnd').addEventListener('click', goToFinalScreen);

    showScreen('introScreen');
});
