import { ctx, canvas } from '../../main.js'
import button from "../classes/button.js";
import Button from "../classes/button.js";

export function chapter4() {
    let fullText = 'Feel the calm within you...'
    let letters = []
    let sceneStage = 1
    let globalTimer = 0

    // btn
    let buttonAppear = false
    let endButton

    // variables
    const config = {
        letter: {
            fadeIn: { duration: 0.8, delay: 0.03 },
            fadeOut: { duration: 1.5, delay: 0.02 },
            spacing: 1.05
        },
        yOffset: {
            start: 50,
            end: -30,
            duration: 2.0
        },
        glow: {
            intensity: 20,
            fadeDuration: 1.0
        }
    }

    // letters with anim
    for (let i = 0; i < fullText.length; i++) {
        letters.push({
            char: fullText[i],
            alpha: 0,
            x: 0,
            y: 0,
            yOffset: config.yOffset.start,
            fadeStart: 0,
            width: 0
        })
    }

    // spacing
    ctx.font = '60px ending'

    let totalWidth = 0
    for (let letter of letters) {
        letter.width = ctx.measureText(letter.char).width
        totalWidth += letter.width
    }

    let availableSpace = canvas.width - totalWidth
    let spacing = availableSpace / (letters.length + 50)

    let xPos = (canvas.width - totalWidth - spacing * (letters.length - 1)) / 2
    for (let letter of letters) {
        letter.x = xPos
        letter.y = canvas.height / 2
        xPos += letter.width + spacing
    }

    function easeOutQuad(t) {
        return t * (2 - t)
    }

    function easeInOutSine(t) {
        return -(Math.cos(Math.PI * t) - 1) / 2
    }

    function animate(timestamp) {
        if (!animate.startTime) animate.startTime = timestamp
        const deltaTime = (timestamp - animate.startTime) / 1000

        if (sceneStage === 1) {
            letters.forEach((letter, i) => {
                const delay = i * config.letter.fadeIn.delay
                const progress = Math.min((deltaTime - delay) / config.letter.fadeIn.duration, 1)

                if (progress > 0) {
                    letter.alpha = easeOutQuad(progress)
                    letter.yOffset = config.yOffset.start * (1 - easeInOutSine(progress))
                }
            })

            // check if all letters are faded in
            if (letters.every(l => l.alpha >= 0.99)) {
                if (!globalTimer) {
                    globalTimer = timestamp
                }
                // delay
                else if (timestamp - globalTimer > 500) {
                    sceneStage = 2
                    animate.startTime = null
                }
            }
        }
        else if (sceneStage === 2) {
            const progress = Math.min(deltaTime / config.letter.fadeOut.duration, 1)

            letters.forEach(letter => {
                letter.alpha = 1 - easeInOutSine(progress)
                letter.yOffset = config.yOffset.end * easeOutQuad(progress)
            })

            // glow fade-out
            const glowAlpha = 1 - (progress / config.glow.fadeDuration)
            ctx.shadowColor = `rgba(245, 195, 125, ${glowAlpha})`
            ctx.shadowBlur = config.glow.intensity * glowAlpha


            if (!globalTimer) {
                globalTimer = timestamp
            }
            // delay
            else if (timestamp - globalTimer > 3000) {
                if (!buttonAppear) {
                    // btn
                    endButton = new Button(
                        canvas.width / 2 - 100, canvas.height / 2, 200, 60,
                        "rgba(58, 80, 107, 1)", "rgba(136, 192, 208, 1)", "rgba(236, 239, 241, 1)", "Replay"
                    )
                    buttonAppear = true
                }
                endButton.update()
            }
        }

        // draw letters
        letters.forEach(letter => {
            ctx.save()
            ctx.font = '60px ending'
            ctx.fillStyle = `rgba(245, 241, 237, ${letter.alpha})`
            ctx.translate(letter.x, letter.y + letter.yOffset)
            ctx.shadowColor = `rgba(245, 195, 125, ${1})`
            ctx.shadowBlur = config.glow.intensity * 1
            ctx.fillText(letter.char, 0, 0)
            ctx.restore()
        })

        requestAnimationFrame(animate)
    }

    animate()
}