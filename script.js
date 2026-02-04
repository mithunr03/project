document.addEventListener('DOMContentLoaded', () => {
    /* --- Background Particle System --- */
    const canvas = document.getElementById('heart-canvas');
    const ctx = canvas.getContext('2d');

    let width, height;
    let particles = [];

    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }

    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.size = Math.random() * 3 + 1;
            this.speedX = Math.random() * 0.5 - 0.25;
            this.speedY = Math.random() * -0.5 - 0.25;
            this.opacity = Math.random() * 0.5 + 0.1;
            this.color = `rgba(255, ${Math.floor(Math.random() * 100)}, 100, ${this.opacity})`;
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            if (this.y < 0) {
                this.y = height;
                this.x = Math.random() * width;
            }
        }

        draw() {
            ctx.fillStyle = this.color;
            // Draw Heart Shape
            ctx.beginPath();
            const topCurveHeight = this.size * 0.3;
            ctx.moveTo(this.x, this.y + topCurveHeight);
            // top left curve
            ctx.bezierCurveTo(
                this.x, this.y,
                this.x - this.size / 2, this.y,
                this.x - this.size / 2, this.y + topCurveHeight
            );
            // bottom left curve
            ctx.bezierCurveTo(
                this.x - this.size / 2, this.y + (this.size + topCurveHeight) / 2,
                this.x, this.y + (this.size + topCurveHeight) / 1.5,
                this.x, this.y + this.size
            );
            // bottom right curve
            ctx.bezierCurveTo(
                this.x, this.y + (this.size + topCurveHeight) / 1.5,
                this.x + this.size / 2, this.y + (this.size + topCurveHeight) / 2,
                this.x + this.size / 2, this.y + topCurveHeight
            );
            // top right curve
            ctx.bezierCurveTo(
                this.x + this.size / 2, this.y,
                this.x, this.y,
                this.x, this.y + topCurveHeight
            );
            ctx.closePath();
            ctx.fill();
        }
    }

    function initParticles() {
        resize();
        particles = [];
        for (let i = 0; i < 100; i++) {
            particles.push(new Particle());
        }
    }

    function animateParticles() {
        ctx.clearRect(0, 0, width, height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        requestAnimationFrame(animateParticles);
    }

    window.addEventListener('resize', () => {
        resize();
        initParticles();
    });
    initParticles();
    animateParticles();

    /* --- Interaction Logic --- */
    const yesBtn = document.getElementById('yes-btn');
    const noBtn = document.getElementById('no-btn');
    const questionContent = document.getElementById('question-content');
    const celebrationContent = document.getElementById('celebration-content');
    const bgMusic = document.getElementById('bg-music');

    // Repulsion Logic for 'No' Button
    function moveButton() {
        // Calculate safe zone (padding)
        const padding = 50;
        const maxWidth = window.innerWidth - noBtn.offsetWidth - padding;
        const maxHeight = window.innerHeight - noBtn.offsetHeight - padding;

        // Random position
        const randomX = Math.max(padding, Math.random() * maxWidth);
        const randomY = Math.max(padding, Math.random() * maxHeight);

        noBtn.style.position = 'fixed'; // Use fixed to break out of layout
        noBtn.style.left = randomX + 'px';
        noBtn.style.top = randomY + 'px';

        // Add random rotation for organic feel
        const angle = (Math.random() - 0.5) * 20;
        noBtn.style.transform = `rotate(${angle}deg)`;
    }

    noBtn.addEventListener('mouseover', moveButton);
    // Touch support: if they try to tap it, it moves before click registers (mostly)
    noBtn.addEventListener('touchstart', (e) => {
        e.preventDefault();
        moveButton();
    });

    yesBtn.addEventListener('click', () => {
        // Play Music
        bgMusic.play().then(() => {
            bgMusic.volume = 0.5;
        }).catch(err => {
            console.warn("Autoplay block or missing file:", err);
            // We don't alert anymore, it interrupts the romance. 
            // Just let the visuals carry it if audio fails.
        });

        // 1. Fade out question
        questionContent.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        questionContent.style.opacity = '0';
        questionContent.style.transform = 'scale(0.9)';

        // 2. Wait, then show celebration
        setTimeout(() => {
            questionContent.style.display = 'none';
            celebrationContent.classList.remove('hidden');

            // Initial state for animation
            celebrationContent.style.opacity = '0';
            celebrationContent.style.transform = 'scale(1.1)';

            // Trigger reflow
            void celebrationContent.offsetWidth;

            // Animate in
            celebrationContent.style.transition = 'all 1s cubic-bezier(0.2, 0.8, 0.2, 1)';
            celebrationContent.style.opacity = '1';
            celebrationContent.style.transform = 'scale(1)';

            // 3. Heart Burst with FontAwesome Icons
            createHeartBurst();
        }, 500);
    });

    function createHeartBurst() {
        const colors = ['#a4161a', '#e5383b', '#ba181b', '#ffb703', '#ffffff'];

        for (let i = 0; i < 80; i++) {
            const heart = document.createElement('i');
            heart.classList.add('fa-solid', 'fa-heart');

            // Random styling
            const color = colors[Math.floor(Math.random() * colors.length)];
            const size = Math.random() * 25 + 10;

            heart.style.color = color;
            heart.style.fontSize = size + 'px';
            heart.style.position = 'fixed';
            heart.style.left = '50%';
            heart.style.top = '50%';
            heart.style.zIndex = '1000';
            heart.style.pointerEvents = 'none';
            heart.style.transition = 'all 1.5s cubic-bezier(0.1, 0.9, 0.2, 1)';
            heart.style.opacity = '1';

            document.body.appendChild(heart);

            // Animate outward
            requestAnimationFrame(() => {
                const angle = Math.random() * Math.PI * 2;
                // Spread hearts across the whole screen
                const distance = Math.random() * Math.max(window.innerWidth, window.innerHeight) * 0.6;

                const tx = Math.cos(angle) * distance;
                const ty = Math.sin(angle) * distance;
                const rot = (Math.random() - 0.5) * 720;

                heart.style.transform = `translate(${tx}px, ${ty}px) rotate(${rot}deg) scale(0)`;
                heart.style.opacity = '0';
            });

            // Cleanup
            setTimeout(() => {
                heart.remove();
            }, 1500);
        }
    }
});
