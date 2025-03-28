class Base {
    constructor({x}) {
        // velocity
        this.vx = 0

        this.sprite = new Image()
        this.sprite.src = game.base

        // position
        this.x = x
        this.y = canvas.height - this.sprite.height + 100

        this.done = false

        game.bases.push(this)
    }

    draw() {
        ctx.drawImage(this.sprite, this.x, this.y)
    }

    update() {
        this.draw()

        // same movement as the obstacles
        this.vx = -5
        this.x += this.vx * game.upgradeSlow

        // check if in need of creating new
        this.check()
    }

    check() {
        if (this.x + this.sprite.width <= -this.sprite.width) {
            console.log(this.sprite.width)
            this.done = true
        }
    }
}