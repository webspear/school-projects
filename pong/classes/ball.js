class Ball{
    constructor({position}) {
        this.position = position
        this.previousY = position.y
        this.radius = 15
        this.velocity = {
            x: 0,
            y: 0
        }
        this.speed = 0.50
        this.direction = 45
        this.playerCollisionCD = false
    }

    draw() {
        // draw circle
        ctx.beginPath()
        ctx.fillStyle = color
        ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI*2, true)
        ctx.fill()
        ctx.stroke()
    }

    update() {
        this.draw()

        if (this.direction >= 360) {
            this.direction -= 360
        }

        // ball direction of movement
        this.velocity.x = Math.cos(this.direction/(180/Math.PI)) * this.radius
        this.velocity.y = Math.sin(this.direction/(180/Math.PI)) * this.radius
        
        this.previousY = this.position.y
        this.position.x += this.velocity.x * this.speed
        this.position.y += this.velocity.y * this.speed

        this.checkCollisiions()
    }

    // handle collisions
    checkCollisiions() {
        // point wins
        if (this.position.x - this.radius <= 0) {
            player2Score++
            gameStatus.textContent = 'PLAYER 2 SCORED'
            lastPlayerScore = 2
            point.currentTime = 0
            point.play()
            game.roundEnd()
        }
        else if (this.position.x + this.radius >= canvas.width) {
            player1Score++
            gameStatus.textContent = 'PLAYER 1 SCORED'
            lastPlayerScore = 1
            point.currentTime = 0
            point.play()
            game.roundEnd()
        }

        // collisions with wall
        if (
            this.position.y + this.radius >= canvas.height || 
            this.position.y - this.radius <= 0
            ) {
            this.direction = 360 - this.direction
            bounce.currentTime = 0
            bounce.play()
        }

        // collisions with players
        players.forEach(e => {
            if (
                this.position.x - this.radius <= e.position.x + e.width &&
                this.position.x + this.radius >= e.position.x &&
                this.position.y + this.radius >= e.position.y &&
                this.position.y - this.radius <= e.position.y + e.height &&
                !this.playerCollisionCD
            ) {
                this.playerCollisionCD = true
                setTimeout(() => {
                    this.playerCollisionCD = false
                }, 500)

                // check if collision happens at the top and bottom or left and right of the paddle
                if (this.position.x < e.position.x || this.position.x > e.position.x + e.width) {
                    // reflect horizontally
                    this.direction = 180 - this.direction;
                    this.position.x = e.position.x + (this.position.x < e.position.x ? -this.radius : e.width + this.radius);
                } 
                else if (this.position.y < e.position.y && this.position.y < e.previousY) {
                    // reflect vertically (top of paddle)
                    this.direction = 360 - this.direction;
                    this.position.y = e.position.y - this.radius;
                } 
                else if (this.position.y > e.position.y + e.height && this.position.y > e.previousY) {
                    // reflect vertically (bottom of paddle)
                    this.direction = 360 - this.direction;
                    this.position.y = e.position.y + e.height + this.radius;
                }

                // increase speed as the game goes on
                if (difficulty != difficulties.survival && gradualSpeedIncrease) {
                    this.speed += 0.01
                }

                // detect last player hit
                if (e == game.player1)
                    lastPlayerHit = game.player1
                else 
                    lastPlayerHit = game.player2
                lastPlayerHitToggle = true

                bounce.currentTime = 0
                bounce.play()
            }
        })
    }
}