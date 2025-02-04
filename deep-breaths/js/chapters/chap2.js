import { ctx, canvas } from "../../main.js"
import {chapter3} from "./chap3.js";

export function chapter2() {
    let baseRadius = 300
    let radius = 0
    let time = 0
    let pulseIntensity = 20 // pulse size
    let pulseSpeed = 0.02
    let isExpanding = false
    let isShrinking = false

    let maxRadius = baseRadius * 1.5
    let minRadius = baseRadius
    let targetRadius = baseRadius

    let easingFactor = 0.02
    let isBreathing = true

    let textHide = false
    let textMessage = "[↑] to Inhale"

    let textAlpha = 0

    let noInput = true
    let setupPhase = true
    let breathCounted = false
    let breathCount = 0
    let breathDone = false
    let endPhase = false

    let chapterDone = false

    function update() {
        if (setupPhase) {
            radius += (baseRadius + pulseIntensity - radius) * 0.05

            if (radius >= baseRadius + pulseIntensity - 1) {
                setupPhase = false
                textMessage = "[↑] to Inhale"
                noInput = false
            }
        }
        else if (endPhase) {
            radius += (0 - radius) * 0.05
            textHide = true

            if (radius <= 1) {
                chapterDone = true
                chapter3()
            }
        }
        else {
            if (isExpanding) {
                targetRadius = maxRadius
                isBreathing = false
            } else if (isShrinking) {
                targetRadius = minRadius
                isBreathing = false
            } else {
                isBreathing = true
            }

            // smooth transition to target size
            if (isBreathing) {
                radius = baseRadius + Math.sin(time) * pulseIntensity + 20
                time += pulseSpeed
            } else {
                radius += (targetRadius - radius) * easingFactor
            }

            // clamp radius
            radius = Math.max(minRadius, Math.min(maxRadius, radius))

            // show text when fully expanded/shrunk
            if (radius >= maxRadius - 1) {
                textMessage = "[↓] to Exhale"
                textHide = false
                if (!breathCounted) {
                    breathCounted = true
                    breathCount++
                    console.log(breathCount)
                }
            } else if (radius <= minRadius + 1) {
                textMessage = "[↑] to Inhale"

                if (breathCount === 3) {
                    textMessage = "Breathing is the core of calm and presence."
                    breathDone = true
                }
                textHide = false

                if (breathCounted) {breathCounted=false}
            }
        }

        // radial gradient for bubble
        const gradient = ctx.createRadialGradient(
            canvas.width / 2, canvas.height / 2, radius * 0.7,
            canvas.width / 2, canvas.height / 2, radius
        )

        gradient.addColorStop(0, "rgba(95,131,182,0.5)")
        gradient.addColorStop(1, "rgba(136, 192, 208, 0)")

        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(canvas.width / 2, canvas.height / 2, radius, 0, Math.PI * 2)
        ctx.fill()

        // text
        ctx.fillStyle = `rgba(236, 239, 241, ${textAlpha})`
        ctx.font = "60px ending"
        ctx.textAlign = "center"
        ctx.save()
        ctx.shadowColor = `rgba(245, 195, 125, ${textAlpha})`
        ctx.shadowBlur = 20 * textAlpha
        ctx.fillText(textMessage, canvas.width / 2, canvas.height / 2)
        ctx.restore()

        // text fading
        if (textAlpha < 1 && !textHide && !setupPhase) {
            textAlpha += 0.03
        }
        else if (textAlpha > 0 && textHide) {
            textAlpha -= 0.03
        }

        noInput = (!(textAlpha >= 1) || breathDone)

        if (chapterDone) return
        requestAnimationFrame(update)
    }

    // check for chapter done
    window.addEventListener('click', () => {
        if (breathDone) {
            endPhase = true
        }
    })

    // toggle inhale/exhale
    window.addEventListener("keydown", (e) => {
        if (e.code === "ArrowUp" && !isExpanding && !noInput) {
            isExpanding = true
            isShrinking = false
            targetRadius = maxRadius
            textHide = true
        } else if (e.code === "ArrowDown" && !isShrinking && !noInput) {
            isShrinking = true
            isExpanding = false
            targetRadius = minRadius
            textHide = true
        }
    })

    update()
}
