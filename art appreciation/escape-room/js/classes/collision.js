class CollisionBlock {
    constructor({position, size}) {
        this.position = position
        this.size = size

        collisionBlocks.push(this)

        this.collideable = true // doors
    }

    draw() {
        ctx.fillStyle = 'rgba(255, 0, 0, 0.5)'
        ctx.fillRect(this.position.x, this.position.y, this.size.width, this.size.height)
    }
}

class Interactable {
    constructor({position, size}) {
        this.position = position
        this.size = size

        interactables.push(this)
    }

    draw() {
        ctx.fillStyle = 'rgba(0, 255, 0, 0.2)'
        ctx.fillRect(this.position.x, this.position.y, this.size.width, this.size.height)
    }
}