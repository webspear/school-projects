class Obstacle {
    constructor({x, y, move}) {
        // position
        this.x = x
        this.y = y

        // velocity
        this.vx = 0
        this.vy = 0 // only used for third level and above

        // size
        this.w = 208
        this.h = 1000
        this.gap = game.obstacleGap * game.upgradeGap

        // game logic
        this.vary = false
        this.limit = 350
        this.dispose = false
        this.passed = false
        this.moving = false
        this.moveAmp = 100
        this.moveSpeed = Math.random()*0.025 + 0.02
        this.moveAngle = 0
        this.coin = false
        this.coinR = false
        this.coinB = false

        this.y = canvas.height/2 + Math.random()*this.limit - this.limit/2 - 62
        this.baseY = this.y

        if (Math.random() <= game.moveObsChance) {
            this.moving = true
        }

        // sprite
        this.sprite = new Image()
        this.sprite.src = game.pipeSprite
        this.sprite2 = new Image()
        this.sprite2.src = game.pipeSprite2

        this.spriteCoin = new Image()
        this.spriteCoin.src = './assets/images/coin.png'
        this.spriteCoinR = new Image()
        this.spriteCoinR.src = './assets/images/coinR.png'
        this.spriteCoinB = new Image()
        this.spriteCoinB.src = './assets/images/coinB.png'
    }

    draw() {
        // debugging purposes
        // ctx.fillStyle = 'red'
        // ctx.fillRect(this.x, this.y - this.h - this.gap/2, this.w, this.h) // pay attention to the hitbox!
        // ctx.fillRect(this.x, this.y + this.gap/2, this.w, this.h)

        ctx.drawImage(this.sprite2, this.x,  this.y - this.sprite.height - this.gap/2)
        ctx.drawImage(this.sprite, this.x, this.y + this.gap/2)

        if (this.coin) {
            ctx.drawImage(this.spriteCoin, this.x + this.w/2 - this.spriteCoin.width/2, this.y - this.spriteCoin.height/2)
        }
        if (this.coinR) {
            ctx.drawImage(this.spriteCoinR, this.x + this.w/2 - this.spriteCoinR.width/2, this.y - this.spriteCoinR.height/2)
        }
        if (this.coinB) {
            ctx.drawImage(this.spriteCoinB, this.x + this.w/2 - this.spriteCoinB.width/2, this.y - this.spriteCoinB.height/2)
        }
    }

    update() {
        this.draw()

        // movement
        this.vx = -5

        if (this.moving) this.moveY()

        this.x += this.vx * game.upgradeSlow
        this.y += this.vy

        // check if in need of disposing
        if (this.x + this.w <= -1000) this.dispose = true
    }

    moveY() {
        this.y = this.baseY + Math.sin(this.moveAngle) * this.moveAmp
        this.moveAngle += this.moveSpeed
    }
}