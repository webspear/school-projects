import {canvas, ctx, buttons, ripples, music, click1, click2, volumes, isFullscreen} from "../main.js";
import Button from "./classes/button.js";
import {chapter1} from "./chapters/chap1.js";

export function options() {
    let alpha = 0
    const fadeSpeed = 0.03
    let yOffset = 50
    let yLerpSpeed = 2

    let backButton
    let buttonAppear = false
    let menuActive = true

    // slider
    const sliderWidth = 300
    const sliderHeight = 8
    const thumbRadius = 10

    const primaryColor = 'rgba(58, 80, 107, 1)'
    const accentColor = 'rgba(136, 192, 208, 1)'
    const textColor = 'rgba(236, 239, 241, 1)'
    const goldGlow = 'rgba(245, 195, 125, 1)'

    let chapterDone = false

    function drawText(text, yPos, size, alphaVal) {
        ctx.font = `${size}px ending`
        ctx.textAlign = "center"
        ctx.textBaseline = "middle"
        ctx.fillStyle = `rgba(236, 239, 241, ${alphaVal})`
        ctx.save()
        ctx.shadowColor = `rgba(245, 195, 125, ${alphaVal})`
        ctx.shadowBlur = 20 * alphaVal
        ctx.fillText(text, canvas.width / 2, yPos + yOffset)
        ctx.restore()
    }

    function drawSlider(label, value, yPos) {
        const sliderX = canvas.width/2 - sliderWidth/2
        const thumbX = sliderX + (value/100 * sliderWidth)

        ctx.fillStyle = textColor
        ctx.font = '30px ending'
        ctx.textAlign = 'left'
        ctx.fillText(label, sliderX, yPos + yOffset - 15)

        // value
        ctx.textAlign = 'right'
        ctx.fillText(`${Math.round(value)}%`, sliderX + sliderWidth, yPos + yOffset - 15)

        ctx.beginPath()
        ctx.roundRect(sliderX, yPos + yOffset, sliderWidth, sliderHeight, 5)
        ctx.fillStyle = primaryColor
        ctx.fill()

        ctx.beginPath()
        ctx.arc(thumbX, yPos + yOffset + sliderHeight/2, thumbRadius, 0, Math.PI*2)
        ctx.fillStyle = accentColor
        ctx.fill()
    }

    function handleClick(e) {
        if (!menuActive) return

        const rect = canvas.getBoundingClientRect()
        const mouseX = e.clientX
        const mouseY = e.clientY

        // back button
        if (backButton && backButton.isHovered) {
            menuActive = false
            // hm
        }
    }

    let isDragging = null
    const checkboxSize = 30
    let backPath = new Path2D()

    function getSliderValue(mouseX, sliderX) {
        return Math.max(0, Math.min(100, ((mouseX - sliderX) / sliderWidth) * 100))
    }

    function handleMouseDown(e) {
        if (!menuActive) return

        const rect = canvas.getBoundingClientRect()
        const mouseX = e.clientX - rect.left
        const mouseY = e.clientY - rect.top

        // if (ctx.isPointInPath(backPath, mouseX, mouseY)) {
        //     menuActive = false
        //     return
        // }

        const sliderAreas = {
            volume: canvas.height/2 - 60 + yOffset,
            music: canvas.height/2 + yOffset
        }

        Object.entries(sliderAreas).forEach(([key, yPos]) => {
            const sliderX = canvas.width/2 - sliderWidth/2
            const thumbX = sliderX + ((key === 'volume' ? volumes[0] : volumes[1])/100 * sliderWidth)

            if (mouseY > yPos - 20 && mouseY < yPos + 20) {
                if (Math.abs(mouseX - thumbX) < thumbRadius*2) {
                    isDragging = key
                }
                else if (mouseX > sliderX && mouseX < sliderX + sliderWidth) {
                    const value = getSliderValue(mouseX, sliderX)

                    if (key === 'volume') {
                        volumes[0] = value
                        click1.volume = volumes[0] / 100
                        click2.volume = volumes[0] / 100
                    }
                    else {
                        volumes[1] = value
                        music.volume = volumes[1] / 100
                    }
                    isDragging = key
                }
            }
        })

        const fsX = canvas.width/2 + sliderWidth/2 - 30
        const fsY = canvas.height/2 + 45 + yOffset
        if (mouseX > fsX && mouseX < fsX + checkboxSize &&
            mouseY > fsY && mouseY < fsY + checkboxSize) {
            isFullscreen[0] = !isFullscreen[0]

            if (window.innerHeight == screen.height) {
                document.exitFullscreen()
            }
            else {
                document.documentElement.requestFullscreen()
            }
        }
    }

    function handleMouseMove(e) {
        if (!isDragging || !menuActive) return

        const rect = canvas.getBoundingClientRect()
        const mouseX = e.clientX - rect.left
        const sliderX = canvas.width/2 - sliderWidth/2

        const value = getSliderValue(mouseX, sliderX)

        if (isDragging === "volume") {
            volumes[0] = value
            click1.volume = volumes[0] / 100
            click2.volume = volumes[0] / 100
        }
        else if (isDragging === "music") {
            volumes[1] = value
            music.volume = volumes[1] / 100
        }
    }

    function handleMouseUp() {
        isDragging = null
    }

    canvas.addEventListener('mousedown', handleMouseDown)
    canvas.addEventListener('mousemove', handleMouseMove)
    canvas.addEventListener('mouseup', handleMouseUp)

    function animate() {
        if (alpha < 1 && menuActive) alpha += fadeSpeed
        if (yOffset > 0 && menuActive) {
            yOffset -= yLerpSpeed
            yLerpSpeed *= 0.95
        }

        ctx.fillStyle = `rgba(0, 0, 0, ${alpha * 0.8})`
        ctx.fillRect(0, 0, canvas.width, canvas.height)

        // title
        drawText("Options", canvas.height/3, 60, alpha)

        // sliders
        ctx.globalAlpha = alpha
        drawSlider("Volume", volumes[0], canvas.height/2 - 60)
        drawSlider("Music", volumes[1], canvas.height/2)

        // fs toggle
        ctx.save()
        ctx.fillStyle = textColor
        ctx.font = '30px ending'
        ctx.textAlign = 'left'
        ctx.fillText("Fullscreen:", canvas.width/2 - sliderWidth/2, canvas.height/2 + 60 + yOffset)
        ctx.strokeStyle = accentColor
        ctx.lineWidth = 2
        ctx.strokeRect(
            canvas.width/2 + sliderWidth/2 - 30,
            canvas.height/2 + 45 + yOffset,
            30, 30
        )
        if (isFullscreen[0]) {
            ctx.fillStyle = accentColor
            ctx.fillRect(
                canvas.width/2 + sliderWidth/2 - 27,
                canvas.height/2 + 48 + yOffset,
                24, 24
            )
        }
        ctx.restore()
        ctx.globalAlpha = 1

        // back button
        if (!buttonAppear) {
            backButton = new Button(
                canvas.width/2 - 100,
                canvas.height/2 + 120 + yOffset,
                200, 50,
                primaryColor,
                accentColor,
                textColor,
                "Back"
            )
            buttonAppear = true
        }
        if (backButton) {
            backButton.bgAlpha = alpha
            backButton.update()
        }

        // fade out
        if (!menuActive) {
            if (alpha <= 0.03) {
                chapterDone = true
                chapter1()
            }
            else {
                alpha -= fadeSpeed
                backButton.alpha = alpha
                yOffset += yLerpSpeed
            }
        }

        if (chapterDone) return
        requestAnimationFrame(animate)
    }

    canvas.addEventListener('click', handleClick)
    animate()
}