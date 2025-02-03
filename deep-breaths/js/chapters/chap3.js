import { ctx, canvas, ripples } from "../../main.js"
import Ripple from "../classes/ripple.js";
import {chapter4} from "./chap4.js";

export function chapter3() {
    let textIndex = 0
    let textAlpha = 0
    let textMessage = "A single breath can..."
    let textX = -canvas.width / 2
    let textYOffset = 0
    let textGlow = 0
    let isGlowing = false
    let pulseTime = 0
    let pulseStrength = 0
    let rotationAngle = 0
    let orbX = canvas.width / 2
    let orbY = canvas.height / 2
    let orbVelocityX = 0
    let orbVelocityY = 0
    let sceneState = "intro"

    let noInput = true
    let textHide = false

    const targetTextYOffset = -200

    // platform variables
    let platformAngle = Math.random()*0.08 - 0.04
    const platformWidth = 200
    const platformHeight = 20
    const platformY = canvas.height/2 + 100

    // orb variables
    const gravity = 0.5
    const friction = 0.95
    const orbRadius = 15

    // minigame
    let balanceStartTime = null
    const balanceDuration = 5000
    let platforming = false
    let waitForReveal = true

    let centerStartTime = null
    const centerDuration = 1500

    // sub text
    let alpha = 0
    const fadeSpeed = 0.01 // speed of fade-in
    let text = "Balance the orb on the platform with [←] and [→]"
    const fontSize = 40
    let yOffset = 50 // initial offset upwards
    let yLerpSpeed = 2 // speed of upward movement

    let chapterDone = false

    function drawSubText() {
        ctx.font = `${fontSize}px ending`
        ctx.textAlign = "center"
        ctx.save()
        ctx.textBaseline = "middle"
        ctx.fillStyle = `rgba(236, 239, 241, ${alpha})`
        ctx.shadowColor = `rgba(245, 195, 125, ${alpha})`
        ctx.shadowBlur = 20 * alpha
        ctx.fillText(text, canvas.width / 2, canvas.height / 2.5 + yOffset)
        ctx.restore()


        if (alpha < 1 && !textHide) {
            alpha += fadeSpeed
        }
        else if (alpha > 0 && textHide) {
            alpha -= 0.03
        }
        if (yOffset > 0) {
            yOffset -= yLerpSpeed
            yLerpSpeed *= 0.95
        }
        if (yOffset < 11) platforming = true
    }

    function createRipple(x, y) {
        ripples.push(new Ripple(x, y))
    }

    // text fade-in and fade-out
    function transitionText() {
        if (textAlpha < 1 && !textHide) {
            textAlpha += 0.03
        } else if (textAlpha > 0 && textHide) {
            textAlpha -= 0.03
        }
    }

    function lerp(start, end, t) {
        return start + (end - start) * t
    }

    // complicated stuff
    function resolveOrbPlatformCollision() {
        const platCenterX = canvas.width / 2
        const platCenterY = platformY

        // translate orb position relative to platform center
        const dx = orbX - platCenterX
        const dy = orbY - platCenterY

        // get local coordinates
        const cos = Math.cos(-platformAngle)
        const sin = Math.sin(-platformAngle)
        const localX = dx * cos - dy * sin
        const localY = dx * sin + dy * cos

        if (Math.abs(localX) <= platformWidth / 2 + orbRadius) {
            if (localY + orbRadius > -platformHeight / 2) {
                const correctedLocalY = -platformHeight / 2 - orbRadius

                const cosP = Math.cos(platformAngle)
                const sinP = Math.sin(platformAngle)
                const worldX = localX * cosP - correctedLocalY * sinP
                const worldY = localX * sinP + correctedLocalY * cosP

                orbX = worldX + platCenterX
                orbY = worldY + platCenterY

                return true // collision
            }
        }
        return false // no collision
    }

    function update() {
        // text animations
        if (sceneState === "intro") {
            textX += (canvas.width / 2 - textX) * 0.05
            textGlow = Math.min(textGlow + 0.02, 1)
            if (textX >= canvas.width / 2 - 1) {
                noInput = false
            }
        }
        if (sceneState === "calm") {
            // hm
        }
        if (sceneState === "heart") {
            pulseTime += 0.05
            pulseStrength = Math.sin(pulseTime) * 5
        }
        if (sceneState === "center") {
            if (centerStartTime === null) {
                centerStartTime = performance.now()
            }
            else {
                const currentTime = performance.now()
                if (currentTime - centerStartTime >= centerDuration) {
                    textYOffset = lerp(textYOffset, targetTextYOffset, 0.05)
                }
            }

            if (textYOffset < -199) waitForReveal = false

            if (!waitForReveal) {
                drawSubText()
            }

            if (platforming) {
                // platform angle
                if (platformAngle > -0.5 && platformAngle < 0.5) {
                    if (keys.ArrowLeft) platformAngle -= 0.02
                    if (keys.ArrowRight) platformAngle += 0.02
                }
                else if (platformAngle < -0.5) {
                    platformAngle += 0.02
                }
                else if (platformAngle > 0.5) {
                    platformAngle -= 0.02
                }

                // gravity
                orbVelocityY += gravity

                orbX += orbVelocityX
                orbY += orbVelocityY

                const collided = resolveOrbPlatformCollision()

                if (collided) {
                    orbVelocityY = 0

                    // horizontal velocity based on platform tilt
                    orbVelocityX += platformAngle * 3
                    orbVelocityX *= friction

                    // balance timer
                    if (balanceStartTime === null) {
                        balanceStartTime = performance.now()
                    }
                    else {
                        const currentTime2 = performance.now()
                        if (currentTime2 - balanceStartTime >= balanceDuration) {
                            sceneState = "win"
                            text = "You balanced the orb! Click to proceed"
                        }
                    }
                } else {
                    // reset balance timer if orb is not on platform.
                    balanceStartTime = null

                    if (orbY > canvas.height + 500) {
                        orbY = canvas.height/2
                        orbX = canvas.width/2
                        orbVelocityX = 0
                        orbVelocityY = 0
                    }
                }
            }
        }
        if (sceneState === 'win') {
            drawSubText()
        }

        transitionText()

        // text
        ctx.fillStyle = `rgba(236, 239, 241, ${textAlpha})`
        ctx.font = "60px ending"
        ctx.textAlign = "center"
        ctx.shadowColor = `rgba(245, 195, 125, ${textAlpha})`
        ctx.shadowBlur = 20 * textAlpha

        if (sceneState === "heart") {
            ctx.save()
            ctx.translate(canvas.width / 2, canvas.height / 2)

            // rhythm
            let heartbeatScale = 1

            // first pulse
            if (Math.sin(pulseTime * 1.5) > 0) {
                heartbeatScale = 1 + Math.abs(Math.sin(pulseTime * 1.5)) * 0.1
            }

            // second pulse
            if (Math.sin(pulseTime * 1.5) > 0.7) {
                heartbeatScale = 1 + Math.abs(Math.sin(pulseTime * 3)) * 0.15
            }

            ctx.scale(heartbeatScale, heartbeatScale)
            ctx.fillText(textMessage, 0, 0)
            ctx.restore()
        } else {
            ctx.fillText(textMessage, textX, canvas.height / 2 + textYOffset)
        }

        ctx.shadowBlur = 0

        // platform
        if (sceneState === "center" || sceneState === "win") {
            ctx.save()
            ctx.translate(canvas.width / 2, platformY)
            ctx.rotate(platformAngle)
            ctx.fillStyle = `rgba(74, 99, 125, ${alpha})`
            ctx.fillRect(-platformWidth / 2, -platformHeight / 2, platformWidth, platformHeight)
            ctx.restore()
        }

        // orb
        if (sceneState === "center" || sceneState === "win") {
            ctx.fillStyle = `rgba(245, 195, 125, ${alpha})`
            ctx.beginPath()
            ctx.arc(orbX, orbY, orbRadius, 0, Math.PI * 2)
            ctx.fill()
        }


        if (chapterDone) return
        requestAnimationFrame(update)
    }

    const keys = {
        ArrowLeft: false,
        ArrowRight: false
    }

    window.addEventListener("keydown", (e) => {
        if (e.code === "ArrowLeft") keys.ArrowLeft = true
        if (e.code === "ArrowRight") keys.ArrowRight = true
    })
    window.addEventListener("keyup", (e) => {
        if (e.code === "ArrowLeft") keys.ArrowLeft = false
        if (e.code === "ArrowRight") keys.ArrowRight = false
    })


    window.addEventListener("click", (e) => {
        if (!noInput) {
            if (sceneState === "intro") {
                // fade anims
                textHide = true
                setTimeout(() => {
                    sceneState = "calm"
                    textMessage = "Calm the mind"
                    textHide = false
                }, 500)
            }
            else if (sceneState === "calm") {
                textHide = true
                setTimeout(() => {
                    sceneState = "heart"
                    textMessage = "Slow the heart"
                    textHide = false
                }, 500)
            }
            else if (sceneState === "heart") {
                textHide = true
                setTimeout(() => {
                    sceneState = "center"
                    textMessage = "Center the soul"
                    textHide = false
                }, 500)
            }
            else if (sceneState === 'win') {
                textHide = true
                setTimeout(() => {
                    chapterDone = true

                    // to next chapter
                    setTimeout(() => {
                        chapter4()
                    }, 1000)
                }, 500)
            }
        }

        // createRipple(e.clientX, e.clientY)
    })

    // hover interaction
    window.addEventListener("mousemove", (e) => {
        if (!noInput) {
            if (sceneState === "calm") {
                createRipple(e.clientX, e.clientY)
            }
        }
    })

    update()
}
