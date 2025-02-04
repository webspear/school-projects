import { canvas, ctx, buttons, ripples} from "../main.js";
import Button from "./classes/button.js";

export function options() {
    let alpha = 0;
    const fadeSpeed = 0.03;
    let yOffset = 50;
    let yLerpSpeed = 2;

    // Settings values
    let volumeValue = 100;
    let musicValue = 50;
    let isFullscreen = false;

    // UI elements
    let backButton;
    let buttonAppear = false;
    let menuActive = true;

    // Slider dimensions
    const sliderWidth = 300;
    const sliderHeight = 8;
    const thumbRadius = 10;
    let sliderDrawn1 = false
    let sliderDrawn2 = false

    // Colors
    const primaryColor = 'rgba(58, 80, 107, 1)';
    const accentColor = 'rgba(136, 192, 208, 1)';
    const textColor = 'rgba(236, 239, 241, 1)';
    const goldGlow = 'rgba(245, 195, 125, 1)';

    function drawText(text, yPos, size, alphaVal) {
        ctx.font = `${size}px ending`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = `rgba(236, 239, 241, ${alphaVal})`;
        ctx.save();
        ctx.shadowColor = `rgba(245, 195, 125, ${alphaVal})`;
        ctx.shadowBlur = 20 * alphaVal;
        ctx.fillText(text, canvas.width / 2, yPos + yOffset);
        ctx.restore();
    }

    function drawSlider(label, value, yPos) {
        const sliderX = canvas.width/2 - sliderWidth/2;
        const thumbX = sliderX + (value/100 * sliderWidth);

        // Label
        ctx.fillStyle = textColor;
        ctx.font = '30px ending';
        ctx.textAlign = 'left';
        ctx.fillText(label, sliderX, yPos + yOffset - 15);

        // Value
        ctx.textAlign = 'right';
        ctx.fillText(`${Math.round(value)}%`, sliderX + sliderWidth, yPos + yOffset - 15);

        // Track
        ctx.beginPath();
        ctx.roundRect(sliderX, yPos + yOffset, sliderWidth, sliderHeight, 5);
        ctx.fillStyle = primaryColor;
        ctx.fill();


        // Thumb
        ctx.beginPath();
        ctx.arc(thumbX, yPos + yOffset + sliderHeight/2, thumbRadius, 0, Math.PI*2);
        ctx.fillStyle = accentColor;
        ctx.fill();
    }

    function handleClick(e) {
        if (!menuActive) return;

        const rect = canvas.getBoundingClientRect();
        const mouseX = e.clientX
        const mouseY = e.clientY

        // Check back button
        if (backButton && backButton.isHovered) {
            menuActive = false;
            // hm
        }
    }
    function handleDown(e) {
        if (!menuActive) return;

        const rect = canvas.getBoundingClientRect();
        const mouseX = e.clientX
        const mouseY = e.clientY

        // Check slider interactions
        const sliderYPositions = {
            volume: canvas.height/2 - 60,
            music: canvas.height/2
        };

        Object.entries(sliderYPositions).forEach(([key, yPos]) => {
            const sliderX = canvas.width/2 - sliderWidth/2;
            if (mouseY > yPos + yOffset - 20 && mouseY < yPos + yOffset + 30 && mouseX > canvas.width/2 - sliderWidth/2 && mouseX < canvas.width/2 + sliderWidth/2) {
                const newValue = ((mouseX - sliderX) / sliderWidth) * 100;
                if (key === 'volume') volumeValue = Math.min(100, Math.max(0, newValue));
                else musicValue = Math.min(100, Math.max(0, newValue));
            }
        });
    }

    function animate() {
        if (alpha < 1) alpha += fadeSpeed;
        if (yOffset > 0) {
            yOffset -= yLerpSpeed;
            yLerpSpeed *= 0.95;
        }

        // Clear canvas
        ctx.fillStyle = `rgba(0, 0, 0, ${alpha * 0.8})`;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw title
        drawText("Options", canvas.height/3, 60, alpha);

        // Draw sliders
        ctx.globalAlpha = alpha
        drawSlider("Volume", volumeValue, canvas.height/2 - 60);
        drawSlider("Music", musicValue, canvas.height/2);

        // Draw fullscreen toggle
        ctx.fillStyle = textColor;
        ctx.font = '30px ending';
        ctx.textAlign = 'left';
        ctx.fillText("Fullscreen:", canvas.width/2 - sliderWidth/2, canvas.height/2 + 60 + yOffset);
        ctx.strokeStyle = accentColor;
        ctx.lineWidth = 2;
        ctx.strokeRect(
            canvas.width/2 + sliderWidth/2 - 30,
            canvas.height/2 + 45 + yOffset,
            30, 30
        );
        if (isFullscreen) {
            ctx.fillStyle = accentColor;
            ctx.fillRect(
                canvas.width/2 + sliderWidth/2 - 27,
                canvas.height/2 + 48 + yOffset,
                24, 24
            );
        }
        ctx.globalAlpha = 1

        // Back button
        if (!buttonAppear) {
            backButton = new Button(
                canvas.width/2 - 100,
                canvas.height/2 + 120 + yOffset,
                200, 50,
                primaryColor,
                accentColor,
                textColor,
                "BACK"
            );
            buttonAppear = true;
        }
        if (backButton) {
            backButton.bgAlpha = alpha;
            backButton.update();
        }

        // Fade out
        if (!menuActive) {
            if (alpha <= 0) return;
            alpha -= fadeSpeed;
            yOffset += yLerpSpeed;
        }
        requestAnimationFrame(animate);
    }

    canvas.addEventListener('click', handleClick);
    canvas.addEventListener('mousedown', handleDown);
    animate();
}