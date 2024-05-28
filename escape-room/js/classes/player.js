class Player extends Sprite{
    constructor({position, gravity, collisionBlocks, interactables, imageSrc, frameRate, type, animations}) {
        super({imageSrc, frameRate, type})
        this.position = position
        this.velocity= {
            x: 0,
            y: 0,
        }
        this.width = 70
        this.height = 85
        this.gravity = gravity

        this.speedMultiplier = 1
        this.pushing = false

        this.flip = false

        this.collisionBlocks = collisionBlocks
        this.interactables = interactables

        this.animations = animations

        for (let key in this.animations) {
            const image = new Image()
            image.src = this.animations[key].imageSrc

            this.animations[key].image = image
        }
    }

    drawHitbox() {
        // ctx.fillStyle = 'rgba(255, 0, 0, 0.2)'
        // ctx.fillRect(this.position.x, this.position.y, this.width, this.height)
    }

    // move with player
    updateCamBox() {
        const targetX = this.position.x + this.width/2 - scaledCanvas.width/2
        const targetY = this.position.y + this.height/2 - scaledCanvas.height/2 - yCamOffset
        
        // smoothly interpolate the camera position towards the target position
        const smoothness = 0.1 // adjust to control smoothness of the panning
        if (camera.position.x - (targetX + camera.position.x) * smoothness > 0) 
            camera.position.x = 0
        else if (camera.position.x - (targetX + camera.position.x) * smoothness < -2525 - this.width/2 + scaledCanvas.width) // ??? the hell
            camera.position.x = -2525 - this.width/2 + scaledCanvas.width
        else camera.position.x -= (targetX + camera.position.x) * smoothness
        if (camera.position.y - (targetY + camera.position.y) * smoothness > 0)
            camera.position.y = 0
        else camera.position.y -= (targetY + camera.position.y) * smoothness
    }

    applyYVelocity() {
        this.position.y += this.velocity.y
    }

    update() {
        // camera
        this.updateCamBox()

        // update animations
        this.updateAnims()
        this.updateFrames()

        this.drawHitbox()
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

        // manage collisions with the box
        this.checkForBoxVerticalCollisions()
        this.pushBox()

        // check if the player is in the area below, change y camera offset if true
        this.checkBelow()

        // check if exiting beaker
        this.checkOutsideBeaker()

        // check if the player is under the counter
        this.checkUnderCounter()
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

    checkForInteractablesCollisions() { // same thing as collision blocks, but no collision
        let willInteract = false
        for (let i = 0; i < interactables.length; i++) {
            const interactable = this.interactables[i]

            if (this.position.x <= interactable.position.x + interactable.size.width &&
                this.position.x + this.width >= interactable.position.x &&
                this.position.y + this.height >= interactable.position.y &&
                this.position.y <= interactable.position.y + interactable.size.height
            ) {
                willInteract = true
                currentInteractBlock = interactable
                if (
                    (currentInteractBlock === wirePickup && wireUnlocked) || 
                    (currentInteractBlock === ladderWire && !wireUnlockedDeployed) || 
                    (currentInteractBlock === deployWire && (!wireUnlocked || wireUnlockedDeployed)) ||
                    (currentInteractBlock === fusePickup && fuseUnlocked) ||
                    (currentInteractBlock === flowerPickup && flowerUnlocked) ||
                    (currentInteractBlock === vaultKeypad && (cryptexDone || !powerUnlocked))
                ) 
                    willInteract = false
            }
        }
        if (willInteract) canInteract = true
        else canInteract = false
    }

    checkForBoxVerticalCollisions() {
        // check if collision exists 
        if (this.position.x <= box.position.x + box.width &&
            this.position.x + this.width >= box.position.x &&
            this.position.y + this.height >= box.position.y &&
            this.position.y <= box.position.y + box.height
        ) {
            if (this.velocity.y > 0) {
                this.velocity.y = 0 // reset gravity
                this.position.y = box.position.y - this.height - 0.01
                keys.jump.jumped = false
                this.pushing = false
            }
        }
    }

    pushBox() {
        if (this.position.x <= box.position.x + box.width &&
            this.position.x + this.width >= box.position.x &&
            this.position.y + this.height >= box.position.y &&
            this.position.y <= box.position.y + box.height
        ) {
            if (this.position.x - box.width < plantTop.position.x + plantTop.size.width && this.velocity.x < 0) {
                box.position.x = plantTop.position.x + plantTop.size.width
                this.position.x = box.position.x + box.width + 0.01
                this.pushing = false
                footsteps.buffer = 20
            }
            else if (this.velocity.x < 0) {
                this.speedMultiplier = 0.4
                box.position.x = this.position.x - box.width
                this.pushing = true
                footsteps.buffer = 40
            }
            else if (this.velocity.x > 0) {
                this.speedMultiplier = 0.4
                box.position.x = this.position.x + this.width
                this.pushing = true
                footsteps.buffer = 40
            }
        }
        else {
            this.speedMultiplier = 1
            this.pushing = false
        }
    }

    updateAnims() {
        if (!climbing) {
            if (this.velocity.x !== 0) {
                this.switchSprite('Walk')
                if (this.velocity.y === 0 && !locked) footsteps.play()
                if (this.pushing) this.switchSprite('Push')
                if (this.velocity.y <= 0 && keys.jump.jumped) this.switchSprite('Jump_Walk')
                else if (this.velocity.y > 0) this.switchSprite('Fall_Walk')
            }
            else {
                this.switchSprite('Idle')
                if (this.velocity.y <= 0 && keys.jump.jumped) this.switchSprite('Jump_Idle')
                else if (this.velocity.y > 0) this.switchSprite('Fall_Idle')
            }
        }
        
        if (climbing && this.velocity.y !== 0) {
            this.switchSprite('Climb')
        }
    }

    switchSprite(key) {
        if (this.image === this.animations[key].image) return
        this.image = this.animations[key].image
        this.frameBuffer = this.animations[key].frameBuffer
        this.frameRate = this.animations[key].frameRate
    }

    checkOutsideBeaker() {
        if (this.position.x + this.width < beakerLeft.position.x || this.position.x > beakerRight.position.x + beakerRight.size.width) outsideBeaker = true
        if (outsideBeaker) {
            beakerLeft.collideable = false
            beakerBottom.collideable = false
            beakerRight.collideable = false

            // start the game theme
            gameTheme.play()
            gameTheme.loop = true

            // start a dialogue
            setTimeout(() => {
                if (!dialoguingBeakerExit) {
                    locked = true
                    dialoguing = true
                    dialoguingBeakerExit = true
                    dialogueBeaker.startFromOrigin()
                }
            }, 1000);

            if (!outsideBeakerVignetteToggle) {
                if (visionRadius <= 900) visionRadius += 20
                if (vignetteOpacity >= 0.6) vignetteOpacity -= 0.01
            }
            if (visionRadius >= 900 && vignetteOpacity <= 0.6) outsideBeakerVignetteToggle = true
        }
    }
    
    checkUnderCounter() {
        if (outsideBeaker && outsideBeakerVignetteToggle) {
            if (this.position.x < 1904 && this.position.y > 1344) {
                if (visionRadius >= 350) visionRadius -= 20
                if (vignetteOpacity <= 0.9) vignetteOpacity += 0.01
                if (overlayOpacity <= 0.3) overlayOpacity += 0.02
                if (counterOverlayOpacity > 0) counterOverlayOpacity -= 0.01
            }
            else if (this.position.y > 1344) {
                if (visionRadius <= 900) visionRadius += 20
                if (vignetteOpacity >= 0.6) vignetteOpacity -= 0.01
                if (overlayOpacity >= 0) overlayOpacity -= 0.01
                if (counterOverlayOpacity < 0.8) counterOverlayOpacity += 0.1
            }
        }
    }

    checkBelow() {
        if (this.position.y > 1664) yCamOffset = 150
        else if (this.position.y > 584) yCamOffset = 70
    }
}