import {ctx, canvas} from "../main.js";
import Particle from "./classes/particle.js";

export function background() {
    const colors = [
        { r: 167, g: 199, b: 231 }, // Soft Ocean Blue
        { r: 111, g: 175, b: 152 }, // Muted Teal Green
        { r: 217, g: 167, b: 199 }, // Soft Lavender Pink
    ];

    let time = 0;

    // Function to blend two colors smoothly
    function blendColors(c1, c2, ratio) {
        return {
            r: Math.round(c1.r * (1 - ratio) + c2.r * ratio),
            g: Math.round(c1.g * (1 - ratio) + c2.g * ratio),
            b: Math.round(c1.b * (1 - ratio) + c2.b * ratio),
        };
    }

    // Particle array to hold active particles
    const particles = [];

    // Generate particles
    function generateParticles() {
        const numParticles = 5;
        for (let i = 0; i < numParticles; i++) {
            const x = Math.random() * canvas.width;
            const y = Math.random() * canvas.height;
            const speed = Math.random() * 2 + 1; // Random speed
            const direction = Math.random() * Math.PI * 2; // Random direction
            particles.push(new Particle(x, y, speed, direction));
        }
    }

    // Render loop
    function animateBackground() {
        time += 0.0005; // Controls the speed of the breathing effect

        const index1 = Math.floor(time) % colors.length;
        const index2 = (index1 + 1) % colors.length;
        const ratio = time % 1;

        const blendedColor = blendColors(colors[index1], colors[index2], ratio);

        // Create a radial gradient background
        const gradient = ctx.createRadialGradient(
            canvas.width / 2, canvas.height / 2, 100,
            canvas.width / 2, canvas.height / 2, Math.max(canvas.width, canvas.height)
        );

        gradient.addColorStop(0, `rgba(${blendedColor.r}, ${blendedColor.g}, ${blendedColor.b}, 1)`);
        gradient.addColorStop(1, `rgba(${blendedColor.r}, ${blendedColor.g}, ${blendedColor.b}, 0.6)`);

        // Draw background
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Update and draw particles
        for (let i = 0; i < particles.length; i++) {
            const particle = particles[i];
            particle.update();
            particle.draw();

            // Remove dead particles from the array
            if (!particle.isAlive()) {
                particles.splice(i, 1);
                i--; // Adjust the index after removal
            }
        }

        // Generate new particles randomly for continuous effect
        if (Math.random() < 0.05) {  // Chance of new particles appearing
            generateParticles();
        }

        requestAnimationFrame(animateBackground);
    }

    animateBackground()
}