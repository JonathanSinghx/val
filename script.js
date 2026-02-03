document.addEventListener('DOMContentLoaded', () => {
    const yesBtn = document.getElementById('yesBtn');
    const noBtn = document.getElementById('noBtn');
    const mainContainer = document.getElementById('mainContainer');
    const successContainer = document.getElementById('successContainer');
    const mainImage = document.querySelector('.main-image');
    const scaredText = document.querySelector('.scared-text');
    const questionText = document.querySelector('.question-text');

    // Initial Scale for Yes Button
    let currentScale = 1;
    const MAX_SCALE = 5;

    // State to track if we've switched to absolute positioning
    let isAbsolute = false;

    // Target position for smooth trailing
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;

    // Logic for "No" button running away
    document.addEventListener('mousemove', (e) => {
        const mouseX = e.clientX;
        const mouseY = e.clientY;

        // Logic for Yes Button growing (with limit to not cover question)
        if (currentScale < MAX_SCALE) {
            const yesBtnRect = yesBtn.getBoundingClientRect();
            const questionRect = questionText.getBoundingClientRect();

            // Calculate if next growth would overlap with question text
            const nextScale = currentScale + 0.004;
            const potentialSize = yesBtn.offsetWidth * nextScale;
            const distanceToQuestion = Math.abs(yesBtnRect.bottom - questionRect.top);

            // Only grow if there's at least 10px clearance to question text
            if (distanceToQuestion > 10 && potentialSize < window.innerHeight * 0.4) {
                currentScale = nextScale;
                yesBtn.style.transform = `scale(${currentScale})`;
            }
        }

        // Logic for No Button running away
        const noRect = noBtn.getBoundingClientRect();
        const noCenterX = noRect.left + noRect.width / 2;
        const noCenterY = noRect.top + noRect.height / 2;

        const distanceToNo = Math.hypot(mouseX - noCenterX, mouseY - noCenterY);
        const escapeRadius = 150;

        if (distanceToNo < escapeRadius) {
            // First time it runs away, lock it to fixed position and calculate bounds
            if (!isAbsolute) {
                noBtn.style.position = 'fixed';
                noBtn.style.left = `${noRect.left}px`;
                noBtn.style.top = `${noRect.top}px`;
                noBtn.style.transform = 'none';
                isAbsolute = true;

                // Set initial current position
                currentX = noRect.left;
                currentY = noRect.top;
            }

            // Calculate bounds based on image and scared text positions
            const imageRect = mainImage.getBoundingClientRect();
            const scaredRect = scaredText.getBoundingClientRect();

            // Define the allowed area for the button to move within
            const minY = imageRect.bottom + 20; // 20px below image
            const maxY = scaredRect.top - noRect.height - 20; // 20px above scared text
            const minX = 50; // padding from left edge
            const maxX = window.innerWidth - noRect.width - 50; // padding from right edge

            // Calculate vector from mouse to button center
            const dx = noCenterX - mouseX;
            const dy = noCenterY - mouseY;

            const angle = Math.atan2(dy, dx);
            const moveDistance = 80;

            // Calculate target position
            targetX = noRect.left + Math.cos(angle) * moveDistance;
            targetY = noRect.top + Math.sin(angle) * moveDistance;

            // Clamp to bounds
            targetX = Math.max(minX, Math.min(maxX, targetX));
            targetY = Math.max(minY, Math.min(maxY, targetY));
        }
    });

    // Smooth trailing animation
    function updateButtonPosition() {
        if (isAbsolute) {
            // Smooth interpolation (lerp) for trailing effect
            const lerpFactor = 0.15; // Lower = smoother/slower trailing
            currentX += (targetX - currentX) * lerpFactor;
            currentY += (targetY - currentY) * lerpFactor;

            noBtn.style.left = `${currentX}px`;
            noBtn.style.top = `${currentY}px`;
        }

        requestAnimationFrame(updateButtonPosition);
    }

    // Start the animation loop
    updateButtonPosition();

    // Confetti function
    function createConfetti() {
        const colors = ['#ff4d6d', '#ff758f', '#ffb3c1', '#ffc2d1', '#ffe5ec', '#c9184a'];
        const confettiCount = 100;

        for (let i = 0; i < confettiCount; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.left = Math.random() * 100 + '%';
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.animationDelay = Math.random() * 0.5 + 's';
            confetti.style.animationDuration = (Math.random() * 2 + 2) + 's';

            document.body.appendChild(confetti);

            // Remove confetti after animation
            setTimeout(() => {
                confetti.remove();
            }, 4000);
        }
    }

    // Yes Button Click
    yesBtn.addEventListener('click', () => {
        createConfetti();

        // Small delay before showing success screen to let confetti start
        setTimeout(() => {
            mainContainer.style.display = 'none';
            successContainer.style.display = 'flex';
        }, 300);
    });
});
