import {ctx} from "../../main.js";

class Particle {
    constructor(x, y, speed, direction) {
        this.x = x
        this.y = y
        this.speed = speed
        this.direction = direction
        this.size = Math.random() * 5 + 1
        this.life = 100
    }

    update() {
        this.x += this.speed * Math.cos(this.direction)
        this.y += this.speed * Math.sin(this.direction)
        this.life--
    }

    draw() {
        ctx.fillStyle = `rgba(136, 192, 208, ${this.life / 100})`
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx.fill()
    }

    // check if particle still alive
    isAlive() {
        return this.life > 0
    }
}

export default Particle