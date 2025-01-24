import {ctx, buttons} from "../../main.js";

class Button {
    constructor({position, radius, color}) {
        this.position = position
        this.radius = radius
        this.color = color

        buttons.push(this)
    }

    draw() {
        // draw circle
        ctx.save()
        ctx.fillStyle = this.color
        ctx.globalAlpha = 0.3
        ctx.arc(this.position.x, this.position.y, this.radius*1.3, 0, Math.PI*2, true)
        ctx.fill()
        ctx.restore()

        ctx.beginPath()
        ctx.fillStyle = this.color
        ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI*2, true)
        ctx.fill()
    }

    update() {
        this.draw()
    }
}

export default Button