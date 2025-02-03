import {ctx} from "../../main.js";

class Ripple {
    constructor(x, y) {
        this.x = x
        this.y = y
        this.size = 0
        this.maxSize = 100
        this.alpha = 1
        this.isActive = true
    }

    update() {
        if (this.isActive) {
            this.size += 2
            this.alpha -= 0.02

            if (this.alpha <= 0) {
                this.isActive = false
            }

            ctx.save()
            ctx.strokeStyle = `rgba(136, 192, 208, ${this.alpha})`
            ctx.lineWidth = 3
            ctx.beginPath()
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
            ctx.stroke()
            ctx.restore()
        }
    }
}

export default Ripple