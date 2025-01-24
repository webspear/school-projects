import {canvas, ctx, buttons} from "../main.js";

export function cursor() {
    // animate cursor
    let cursorX = null
    let cursorY = null
    let trailX = cursorX
    let trailY = cursorY
    let cursorInner = 4
    let cursorOuter = 10
    let cursorMouseDown = false
    const lerp = 0.3
    let hovering = false

    canvas.addEventListener('mousemove', (event) => {
        const rect = canvas.getBoundingClientRect()
        cursorX = event.clientX - rect.left
        cursorY = event.clientY - rect.top
    })

    canvas.addEventListener('mousedown', () => {
        cursorMouseDown = true
    })
    canvas.addEventListener('mouseup', () => {
        cursorMouseDown = false
    })

    function animate() {
        requestAnimationFrame(animate)

        if (cursorX !== null && cursorY !== null) {
            ctx.beginPath()
            ctx.fillStyle = 'rgba(0, 0, 0, 0.5)'
            ctx.arc(cursorX, cursorY, cursorInner, 0, Math.PI * 2, true)
            ctx.fill()
            // ctx.stroke()

            trailX += (cursorX - trailX) * lerp;
            trailY += (cursorY - trailY) * lerp;

            // draw the circle
            ctx.beginPath();
            ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
            ctx.arc(trailX, trailY, cursorOuter, 0, Math.PI * 2, true);
            ctx.stroke();

            // click animation
            if (cursorMouseDown) {
                if (cursorInner > 2.8) {cursorInner -= 0.2}
                if (cursorOuter < 22) {cursorOuter += 2}
            }
            else {
                if (cursorInner < 4) {cursorInner += 0.2}
                if (cursorOuter > 10 && !hovering) {cursorOuter -= 2}
            }

            // detect hover
            buttons.forEach((button) => {
                if (Math.sqrt((button.position.x - cursorX)**2 + (button.position.y - cursorY)**2) <= button.radius && cursorOuter <= 16) {
                    if (cursorOuter < 16) {
                        cursorOuter += 2
                        hovering = true
                    }
                }
                else {hovering = false}
            })
        }
    }

    animate()
}