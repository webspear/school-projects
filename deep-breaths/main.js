import {chapter1} from "./chapters/chap1.js";

const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')

canvas.width = window.innerWidth
canvas.height = window.innerHeight

// animate cursor
let cursorX = null
let cursorY = null
let trailX = cursorX
let trailY = cursorY
let cursorInner = 4
let cursorOuter = 10
let cursorMouseDown = false
const lerp = 0.3;

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

function drawCursor() {
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
            if (cursorOuter < 16) {cursorOuter += 1}
        }
        else {
            if (cursorInner < 4) {cursorInner += 0.4}
            if (cursorOuter > 10) {cursorOuter -= 2}
        }
    }
}

// animation function
function animate() {
    requestAnimationFrame(animate)

    // clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // draw cursor
    drawCursor()
}

animate()