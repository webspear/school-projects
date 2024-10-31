class GhostBall{
    constructor({position}) {
        this.position = position
        this.radius = 15
        this.velocity = {
            x: 0,
            y: 0
        }
        this.speed = 0
        this.direction = 135
    }

    draw() {
        // draw circle
        ctx.beginPath()
        ctx.fillStyle = 'grey'
        ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI*2, true)
        ctx.fill()
        ctx.stroke()
    }

    update() {
        // this.draw()

        if (this.direction >= 360) {
            this.direction -= 360
        }

        // ball direction of movement
        this.velocity.x = Math.cos(this.direction/(180/Math.PI)) * this.radius
        this.velocity.y = Math.sin(this.direction/(180/Math.PI)) * this.radius

        this.position.x += this.velocity.x * this.speed
        this.position.y += this.velocity.y * this.speed

        this.checkCollisiions()
    }

    // handle collisions
    checkCollisiions() {
        // collisions with wall
        if (
            this.position.y + this.radius >= canvas.height || 
            this.position.y - this.radius <= 0
            ) {
            this.direction = 360 - this.direction
        }
    }
}