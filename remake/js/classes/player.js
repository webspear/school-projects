class Player {
    constructor({x, y}) {
        // position
        this.x = x
        this.y = y

        // velocity
        this.vx = 0
        this.vy = 0

        // size
        this.w = 136
        this.h = 96

        this.gravity = 0.7 // reset

        // anim
        this.spriteSheet = new Image()
        this.spriteSheet.src = game.playerSprite
        this.frameWidth = 136
        this.frameHeight = 96
        this.currentFrame = 1
        this.totalFrames = 4
        this.frameDelay = 5
        this.frameCounter = 0

        // rotation
        this.rotation = 0
        this.maxRotation = 90
        this.minRotation = -30

        // menu anim
        this.moveAmp = 15
        this.moveSpeed = 0.1
        this.moveAngle = 0
        this.baseY = this.y
    }

    draw() {
        // debugging purposes
        // ctx.fillStyle = 'blue'
        // ctx.fillRect(this.x, this.y, this.w, this.h)

        ctx.save()

        ctx.translate(this.x + this.w / 2, this.y + this.h / 2)
        ctx.rotate(this.rotation * Math.PI / 180)

        ctx.drawImage(
            this.spriteSheet,
            this.currentFrame * this.frameWidth,
            0,
            this.frameWidth,
            this.frameHeight,
            -this.w / 2,
            -this.h / 2,
            this.w,
            this.h
        );

        ctx.restore()
    }

    update() {
        this.draw()

        // animate
        this.animate()

        // apply rotation
        this.rotate()

        // check ground collision
        this.checkGroundCollision()

        // check obstacle collision
        this.checkObstacleCollision()

        // apply gravity
        this.vy += this.gravity * game.upgradeGrav
        this.y += this.vy

        // check coin
        this.checkCoin()
    }

    animate() {
        this.frameCounter++
        if (this.frameCounter >= this.frameDelay) {
            this.currentFrame = (this.currentFrame + 1) % this.totalFrames
            this.frameCounter = 0
        }
    }

    rotate() {
        if (this.vy > 7) {
            this.rotation = Math.min(this.maxRotation, this.rotation + 8)
        } else {
            this.rotation = Math.max(this.minRotation, this.rotation - 5)
        }
    }

    checkGroundCollision() {
        if (this.y + this.h >= canvas.height - game.baseA.sprite.height + 100) {
            if (!game.upgradeLife || game.wastedLife) {
                if (!game.gameEnded) {
                    game.gameEnded = true
                    game.paused = true

                    setTimeout(() => gameEnd('loss'), 300)
                }
            }
            else if (!game.triggeredLife) {
                this.vy = -20
                game.triggeredLife = true
                setTimeout(() => {
                    game.wastedLife = true
                },1000)
            }
        }
    }

    checkObstacleCollision() {
        game.obstacles.forEach((obstacle) => {
            if (this.x + this.w >= obstacle.x && this.x <= obstacle.x + obstacle.w && !(this.y > obstacle.y - obstacle.gap/2 && this.y + this.h < obstacle.y + obstacle.gap/2)) {
                if (!game.upgradeLife || game.wastedLife) {
                    if (!game.gameEnded) {
                        game.gameEnded = true
                        game.paused = true

                        setTimeout(() => gameEnd('loss'), 300)
                    }
                }
                else if (!game.triggeredLife) {
                    this.vy = -20
                    game.triggeredLife = true
                    setTimeout(() => {
                        game.wastedLife = true
                    },1000)
                }

                hit.currentTime = 0
                hit.play()
            }
        })
    }

    checkCoin() {
        game.obstacles.forEach((obstacle) => {
            if (this.x + this.w >= obstacle.x + obstacle.w/2) {
                // raise distance counter
                if (obstacle.passed) return
                game.playerDist++
                document.getElementById('distance-display').textContent = game.playerDist
                obstacle.passed = true
                if (obstacle.coin || obstacle.coinR || obstacle.coinB) {
                    coin.currentTime = 0
                    coin.play()
                }
                else {
                    point.currentTime = 0
                    point.play()
                }

                // coins
                if (obstacle.coin) {
                    game.playerCoins += 100

                    obstacle.coin = false
                }
                if (obstacle.coinR) {
                    game.playerCoins += 150

                    obstacle.coinR = false
                }
                if (obstacle.coinB) {
                    game.playerCoins += 300

                    obstacle.coinB = false
                }
            }
        })
    }

    menuAnim() {
        player.draw()

        this.y = this.baseY + Math.sin(this.moveAngle) * this.moveAmp
        this.moveAngle += this.moveSpeed
    }
}