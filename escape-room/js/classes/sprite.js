class Sprite {
    constructor({position, imageSrc, frameRate = 1, frameBuffer = 20, type}) {
        this.position = position
        this.image = new Image()
        this.image.onload = () => {
            this.width = this.image.width / this.frameRate
            this.height = this.image.height
        }
        this.image.src = imageSrc
        this.frameRate = frameRate
        this.currentFrame = 0
        this.frameBuffer = frameBuffer
        this.elapsedFrames = 0

        this.type = type
    }

    draw() {
        if (!this.image) return

        // crop the img for the player animations
        const cropbox = {
            position: {
                x: this.currentFrame * (this.image.width / this.frameRate),
                y: 0,
            },
            width: this.image.width / this.frameRate,
            height: this.image.height,
        }

        if (this.type === 'player') {
            // direction of the sprite
            if (this.velocity.x != 0) {
                if (this.velocity.x > 0) this.flip = false
                else if (this.velocity.x < 0) this.flip = true
            }
    
            const scaleH = this.flip ? -1 : 1
            const posX = this.flip ? -this.position.x - this.width : this.position.x
    
            ctx.save()
            ctx.scale(scaleH, 1)
            if (!this.image) return
            ctx.drawImage(this.image, cropbox.position.x, cropbox.position.y, cropbox.width, cropbox.height, posX, this.position.y, this.width, this.height)
            ctx.restore()
        }
        else ctx.drawImage(this.image, this.position.x, this.position.y, this.width, this.height)
    }

    update() {
        this.draw()
        this.updateFrames()
    }

    updateFrames() {
        this.elapsedFrames++

        if (this.elapsedFrames % this.frameBuffer === 0) {
            if (this.currentFrame < this.frameRate - 1) this.currentFrame++
            else this.currentFrame = 0
        }
    }
}
