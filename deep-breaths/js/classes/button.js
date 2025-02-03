import { ctx, buttons } from "../../main.js"

class Button {
    constructor(x, y, width, height, baseColor, hoverColor, textColor, text) {
        this.x = x
        this.y = y
        this.width = width
        this.height = height
        this.baseColor = baseColor
        this.hoverColor = hoverColor
        this.textColor = textColor
        this.text = text
        this.glowIntensity = 0
        this.isHovered = false
        this.clicked = false
        this.glowColor = `rgba(245, 195, 125, 1)`

        // anim
        this.alpha = 0
        this.fadeSpeed = 0.01
        this.yOffset = 50
        this.yLerpSpeed = 2

        // mouse tracking
        this.mouse = { x: 0, y: 0, clicked: false }
        canvas.addEventListener("mousemove", (e) => this.updateMouse(e))
        canvas.addEventListener("click", () => this.handleClick())

        this.update()
        buttons.push(this)
    }

    appear() {
        if (this.alpha < 1) {
            this.alpha += this.fadeSpeed
        }
        if (this.yOffset > 0) {
            this.yOffset -= this.yLerpSpeed
            this.yLerpSpeed *= 0.95
        }
    }

    updateMouse(e) {
        this.mouse.x = e.clientX
        this.mouse.y = e.clientY
    }

    handleClick() {
        if (this.isHovered) {
            this.clicked = true
            if (this.text === 'Start') {
                return true
            }
            else if (this.text === 'Options') {

            }
            else if (this.text === 'Replay') {
                location.reload()
            }
        }
    }

    isMouseOver() {
        return this.mouse.x >= this.x && this.mouse.x <= this.x + this.width && this.mouse.y >= this.y - this.yOffset && this.mouse.y <= this.y + this.height - this.yOffset/2
    }

    lerp(a, b, t) {
        return a + (b - a) * t
    }

    updateGlow() {
        const targetGlow = !this.isHovered ? 1 : 0
        this.glowIntensity = this.lerp(this.glowIntensity, targetGlow, 0.1)

        const r = Math.round(this.lerp(64, 245, this.glowIntensity))
        const g = Math.round(this.lerp(134, 195, this.glowIntensity))
        const b = Math.round(this.lerp(196, 125, this.glowIntensity))

        this.glowColor = `rgba(${r}, ${g}, ${b}, ${this.alpha})`
    }

    draw() {
        // fade in
        ctx.globalAlpha = this.alpha

        // ctx.fillStyle = `rgba(58, 80, 107, ${this.alpha})`
        // ctx.fillRect(this.x, this.y - this.yOffset, this.width, this.height)

        // text
        ctx.fillStyle = this.textColor
        ctx.font = "40px ending"
        ctx.textAlign = "center"
        ctx.textBaseline = "middle"
        ctx.save()
        ctx.shadowColor = this.glowColor
        ctx.shadowBlur = 20 * this.alpha
        ctx.fillText(this.text, this.x + this.width / 2, this.y + this.height / 2 - this.yOffset)
        ctx.restore()

        ctx.globalAlpha = 1
    }

    update() {
        this.isHovered = this.isMouseOver()
        this.updateGlow()
        this.appear()
        this.draw()
    }
}

export default Button
