class Player{
    constructor({position}) {
        this.position = position
        this.width = 20
        this.height = 100
        this.velocity = 0
        this.speed = 10
        players.push(this)
    }

    draw() {
        ctx.fillStyle = color
        ctx.fillRect(this.position.x, this.position.y, this.width, this.height)
    }

    update() {
        this.draw()
        this.position.y += this.velocity
    }
}