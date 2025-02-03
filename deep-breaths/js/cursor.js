import {canvas, ctx, buttons, ripples} from "../main.js";
import Ripple from "./classes/ripple.js";

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

    canvas.addEventListener('mousedown', (e) => {
        cursorMouseDown = true

        // ripples
        ripples.push(new Ripple(e.clientX, e.clientY))
    })
    canvas.addEventListener('mouseup', () => {
        cursorMouseDown = false
    })

    function animate() {
        requestAnimationFrame(animate)

        if (cursorX !== null && cursorY !== null) {
            // update ripples
            ripples.forEach((ripple, index) => {
                ripple.update()
                if (!ripple.isActive) {
                    ripples.splice(index, 1)
                }
            })

            ctx.beginPath()
            ctx.fillStyle = 'rgba(236, 239, 241,1)'
            ctx.arc(cursorX, cursorY, cursorInner, 0, Math.PI * 2, true)
            ctx.fill()
            // ctx.stroke()

            trailX += (cursorX - trailX) * lerp
            trailY += (cursorY - trailY) * lerp

            // draw the circle
            ctx.beginPath()
            ctx.strokeStyle = 'rgba(236, 239, 241,1)'
            ctx.arc(trailX, trailY, cursorOuter, 0, Math.PI * 2, true)
            ctx.stroke()

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
                if (button.isHovered) {
                    if (cursorOuter < 16) {
                        cursorOuter += 2
                        hovering = true
                    }
                }
                else if (cursorOuter >= 16) {
                    hovering = false
                }
            })
        }
    }

    animate()
}