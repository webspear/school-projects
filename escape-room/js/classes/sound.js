class Sound {
    constructor({src, buffer, frameRate}) {
        this.soundSrc = src // array
        this.buffer = buffer
        this.lastSound = 0
        this.elapsedFrames = 0
        this.currentFrame = 0
        this.frameRate = frameRate
        this.pause = false
    }

    play() {
        if (!this.pause) {
            const audio = new Audio()
            audio.src = this.soundSrc[this.currentFrame]

            audio.play()
            this.pause = true
        }
        if (this.lastSound + 1 === this.currentFrame || this.lastSound - this.frameRate + 1 === this.currentFrame) {
            this.lastSound = this.currentFrame
            this.pause = false
        }

        this.updateFrames()
    }

    updateFrames() {
        this.elapsedFrames++

        if (this.elapsedFrames % this.buffer === 0) {
            if (this.currentFrame < this.frameRate - 1) this.currentFrame++
            else {this.currentFrame = 0}
        }
    }
}