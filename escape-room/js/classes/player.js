class Player {
    constructor({position, gravity, collisionBlocks, interactables}) {
        this.position = position
        this.velocity= {
            x: 0,
            y: 0,
        }
        this.width = 50
        this.height = 50
        this.gravity = gravity

        this.collisionBlocks = collisionBlocks
        this.interactables = interactables
    }

    draw() {
        ctx.fillStyle = 'red'
        ctx.fillRect(this.position.x, this.position.y, this.width, this.height)
    }

    // move with player
    updateCamBox() {
        const targetX = this.position.x + this.width/2 - scaledCanvas.width/2
        const targetY = this.position.y + this.height/2 - scaledCanvas.height/2 - 70
        
        // smoothly interpolate the camera position towards the target position
        const smoothness = 0.1 // adjust to control smoothness of the panning
        if (camera.position.x - (targetX + camera.position.x) * smoothness > 0) 
            camera.position.x = 0
        else if (camera.position.x - (targetX + camera.position.x) * smoothness < -1629 - this.width/2 + scaledCanvas.width) // ??? the hell
            camera.position.x = -1629 - this.width/2 + scaledCanvas.width
        else camera.position.x -= (targetX + camera.position.x) * smoothness
        camera.position.y -= (targetY + camera.position.y) * smoothness
    }

    applyYVelocity() {
        this.position.y += this.velocity.y
    }

    update() {
        // camera
        this.updateCamBox()

        this.draw()

        // movement
        this.position.x += this.velocity.x

        // check for horizontal collision
        this.checkHorizontalCollisions()

        // apply gravity
        this.velocity.y += this.gravity
        this.applyYVelocity()

        // check for vertcial collisions
        this.checkVerticalCollisions()

        // check for collisions with interact blocks
        this.checkForInteractablesCollisions()
    }

    checkHorizontalCollisions() {
        for (let i = 0; i < this.collisionBlocks.length; i++) {
            const collisionBlock = this.collisionBlocks[i]

            // check if player has to collide or not
            if (collisionBlock.collideable) {
                // check if a collision exists 
                if (this.position.x <= collisionBlock.position.x + collisionBlock.size.width &&
                    this.position.x + this.width >= collisionBlock.position.x &&
                    this.position.y + this.height >= collisionBlock.position.y &&
                    this.position.y <= collisionBlock.position.y + collisionBlock.size.height
                ) {
                    // collision on left
                    if (this.velocity.x < 0) {
                        this.position.x = collisionBlock.position.x + collisionBlock.size.width + 0.01
                        break
                    }
                    // right
                    if (this.velocity.x > 0) {
                        this.position.x = collisionBlock.position.x - this.width - 0.01
                        break
                    }

                }
            }
        }
    }

    checkVerticalCollisions() {
        for (let i = 0; i < this.collisionBlocks.length; i++) {
            const collisionBlock = this.collisionBlocks[i]

            if (collisionBlock.collideable) {
                // check if collision exists 
                if (this.position.x <= collisionBlock.position.x + collisionBlock.size.width &&
                    this.position.x + this.width >= collisionBlock.position.x &&
                    this.position.y + this.height >= collisionBlock.position.y &&
                    this.position.y <= collisionBlock.position.y + collisionBlock.size.height
                ) {
                    if (this.velocity.y < 0) {
                        this.velocity.y = 0 // reset gravity
                        this.position.y = collisionBlock.position.y + collisionBlock.size.height + 0.01
                        break
                    }
                    if (this.velocity.y > 0) {
                        this.velocity.y = 0
                        this.position.y = collisionBlock.position.y - this.height - 0.01
                        keys.jump.jumped = false
                        break
                    }
                }
            }
        }
    }

    checkForInteractablesCollisions() {
        for (let i = 0; i < interactables.length; i++) {
            const interactable = this.interactables[i]

            if (this.position.x <= interactable.position.x + interactable.size.width &&
                this.position.x + this.width >= interactable.position.x &&
                this.position.y + this.height >= interactable.position.y &&
                this.position.y <= interactable.position.y + interactable.size.height
            ) {
                canInteract = true
                currentInteractBlock = interactable
            }
            else canInteract = false
        }
    }
}