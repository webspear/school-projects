import Button from "../classes/button.js"
import {buttons, ctx, canvas} from '../../main.js'
import {chapter2} from "./chap2.js";
import {options} from "../options.js";
import {cursor} from "../cursor.js";

export function chapter1() {
    let alpha = 0
    const fadeSpeed = 0.01 // speed of fade-in
    const text = "Deep Breaths"
    const fontSize = 100
    const glowIntensity = 20
    let yOffset = 50 // initial offset upwards
    let yLerpSpeed = 2 // speed of upward movement

    // btn
    let buttonToggle = false
    let buttonAppear = false
    let buttonToggle2 = false
    let buttonAppear2 = false

    let chapterDone = false
    let chapter2Triggered = false

    let noInput = false

    function drawText() {
        ctx.font = `${fontSize}px ending`
        ctx.textAlign = "center"
        ctx.textBaseline = "middle"
        ctx.fillStyle = `rgba(236, 239, 241, ${alpha})`
        ctx.save()
        ctx.shadowColor = `rgba(245, 195, 125, ${alpha})`
        ctx.shadowBlur = glowIntensity * alpha
        ctx.fillText(text, canvas.width / 2, canvas.height / 3 + yOffset)
        ctx.restore()

        if (alpha < 1) {
            alpha += fadeSpeed
        }
        if (yOffset > 0) {
            yOffset -= yLerpSpeed
            yLerpSpeed *= 0.95
        }

        if (yOffset < 11.5) buttonToggle = true
        if (yOffset < 10.5) buttonToggle2 = true
    }

    let startButton
    let helpButton

    function animate() {
        if (chapterDone) return
        requestAnimationFrame(animate)

        if (buttonToggle) {
            if (!buttonAppear) {
                // btn
                startButton = new Button(
                    canvas.width / 2 - 100, canvas.height / 2, 200, 60,
                    "rgba(58, 80, 107, 1)", "rgba(136, 192, 208, 1)", "rgba(236, 239, 241, 1)", "Start"
                )
                buttonAppear = true
            }
            startButton.update()

            if (startButton.clicked) {
                if (alpha > 0) {
                    alpha -= 0.03
                }
                if (startButton.alpha > 0) {
                    startButton.alpha -= 0.03
                }
                if (startButton.alpha > 0) {
                    helpButton.alpha -= 0.03
                }
                setTimeout(() => {
                    chapterDone = true

                    // to next chapter
                    setTimeout(() => {
                        if (chapter2Triggered) return
                        chapter2Triggered = true
                        chapter2()
                    }, 1000)
                }, 500)
            }
        }
        if (buttonToggle2) {
            if (!buttonAppear2) {
                // btn
                helpButton = new Button(
                    canvas.width / 2 - 100, canvas.height / 2 + 75, 200, 60,
                    "rgba(58, 80, 107, 1)", "rgba(136, 192, 208, 1)", "rgba(236, 239, 241, 1)", "Options"
                )
                buttonAppear2 = true
            }
            helpButton.update()

            if (helpButton.clicked) {
                if (alpha > 0) {
                    alpha -= 0.03
                }
                if (startButton.alpha > 0) {
                    startButton.alpha -= 0.03
                }
                if (startButton.alpha > 0) {
                    helpButton.alpha -= 0.03
                }
                setTimeout(() => {
                    chapterDone = true

                    if (chapter2Triggered) return
                    chapter2Triggered = true
                    options()
                }, 500)
            }
        }

        drawText()
    }

    animate()
}