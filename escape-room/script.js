// setting it up
const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')

const parent = document.getElementById('inventory');
const inv = new Inventory(parent, {}, 12);
inv.hide()

const zoomFactor = 1.85

const scaledCanvas = {
    width: canvas.width / zoomFactor,
    height: canvas.height / zoomFactor
}

// determine how the game size should be like (depending on the window size)
window.addEventListener(onload, checkresize())
$(window).resize(function() {checkresize()})

function checkresize() {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    
    scaledCanvas.width = canvas.width / zoomFactor
    scaledCanvas.height = canvas.height / zoomFactor
}

let titleSequence = false
let endSequence = false

let paused = false

let outsideBeaker = false
let outsideBeakerVignetteToggle = false

let camFocus = false
let camFocusTargetX
let camFocusTargetY
let yCamOffset = 70

let canInteract = false
let interactOpacity = 0
let currentInteractBlock
let locked = false
let climbing = false

let teleporting = false
let teleportTargetX
let teleportTargetY

let blackoutOpacity = 0

let counterOverlayOpacity = 0.8

let visionRadius = 200
let overlayOpacity = 0
let vignetteOpacity = 0.9

// unlocks
let wireUnlocked = false
let wireUnlockedDeployed = false
let vineUnlocked = false
let ventUnlocked = false

// check if keys need to be released and stuff
const keys = {
    jump: {
        inAir: false,
        jumped: false,
    },
    w: {
        pressed: false,
        climbCD: false,
    },
    d: {
        pressed: false,
    },
    a: {
        pressed: false,
    },
    s: {
        pressed: false,
    },
}

// under counter overlay
const counterOverlay = {
    position: {
        x: 0,
        y: 1344,
    },
    width: 1904,
    height: 576,
}

// camera
const camera = {
    position: {
        x: -1350 + (scaledCanvas.width/2),
        y: -1030 + (scaledCanvas.height/2), // 2560 is the height of the background image (change later)
    },
}

// the player
const player = new Player({
    position: {
        x: 1510,
        y: 1091,
    },
    gravity: 1, // change gravity as see fit

    collisionBlocks: collisionBlocks,
    interactables: interactables,

    imageSrc: './assets/images/anims/idle.png',
    frameRate: 4,

    type: 'player',

    // all different animations
    animations: {
        Idle: {
            imageSrc: './assets/images/anims/idle.png',
            frameRate: 4,
            frameBuffer: 20,
        },
        Walk: {
            imageSrc: './assets/images/anims/walk.png',
            frameRate: 4,
            frameBuffer: 10,
        },
        Climb: {
            imageSrc: './assets/images/anims/climb.png',
            frameRate: 2,
            frameBuffer: 10,
        },
        Jump_Idle: {
            imageSrc: './assets/images/anims/jump-idle.png',
            frameRate: 1,
            frameBuffer: 1,
        },
        Jump_Walk: {
            imageSrc: './assets/images/anims/jump-walk.png',
            frameRate: 1,
            frameBuffer: 1,
        },
        Fall_Idle: {
            imageSrc: './assets/images/anims/fall-idle.png',
            frameRate: 1,
            frameBuffer: 1,
        },
        Fall_Walk: {
            imageSrc: './assets/images/anims/fall-walk.png',
            frameRate: 1,
            frameBuffer: 1,
        },
        Push: {
            imageSrc: './assets/images/anims/push.png',
            frameRate: 2,
            frameBuffer: 20,
        },
    },

})

// items
const item = {
    wire: new Item({url: './assets/images/items/wire.png'}, 'wire', 'desc', inv, 1)
}

// screen changing
// document.getElementById('start-overlay').onclick = () => {
//             console.log(document.getElementById('start-overlay').style.opacity)
//     function fade() {
//         if (document.getElementById('start-overlay').style.opacity > 0) {
//             document.getElementById('start-overlay').style.opacity -= 0.01
//             setTimeout(() => {fade()}, 10);
//         }
//     }
//     fade()

//     setTimeout(() => {
//         // bg music
//         menuTheme.play()
//         menuTheme.loop = true

//         document.getElementById('start-overlay').style.visibility = 'hidden'
//     }, 0)
// }

// make the game work
function animate() {
    window.requestAnimationFrame(animate)
    // redraw canvas
    ctx.fillStyle = 'black'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // slower background to add depth
    ctx.save()
    ctx.scale(zoomFactor, zoomFactor)
    ctx.translate(camera.position.x * 0.8, camera.position.y * 1)
    background.update()

    showHoverBack()

    ctx.restore()

    // zoom
    ctx.save()
    ctx.scale(zoomFactor, zoomFactor)
    ctx.translate(camera.position.x, camera.position.y)

    foreground.update()
    
    if (!wireUnlocked) wireItem.update()
    if (wireUnlockedDeployed) wireDeployed.update()
    if (vineUnlocked) grownPlant.update()
    if (ventUnlocked) ventOpen.update()

    drawBox()
    
    drawCounterOverlay()

    showHover()
    
    if (!paused && !locked) {
        // drawObjects()

        if (outsideBeaker) beakerOverlay.update()

        player.update()

        if (!outsideBeaker) beakerOverlay.update()

        playerMovement()

        interactTxtAnim()
    }
    else if (camFocus) {
        animateCam()
    }
    else if (locked) {
        lockPlayer()
    }
    else {
        player.draw()
    }

    drawVignette()

    ctx.restore()
}

animate()

// for debugging
function drawObjects() {
    collisionBlocks.forEach(block => {
        block.draw()
    })
    interactables.forEach(block => {
        block.draw()
    })
}

function playerMovement() {
    // player movement
    player.velocity.x = 0
    if (keys.d.pressed && keys.a.pressed) player.velocity.x = 0
    else if (keys.d.pressed) {
        player.velocity.x = 4 * player.speedMultiplier
    }
    else if (keys.a.pressed) {
        player.velocity.x = -4 * player.speedMultiplier
    }
    if (keys.jump.inAir) {
        if (!keys.jump.jumped && !keys.w.climbCD) {
            player.velocity.y = -15
            keys.jump.jumped = true
        }
        keys.jump.inAir = false
    }
}

function interactTxtAnim() {
    // interact text 
    if (canInteract && document.getElementById('interact-btn').style.opacity <= 1) 
        interactOpacity += 0.05
    else if (!canInteract && document.getElementById('interact-btn').style.opacity >= 0) 
        interactOpacity -= 0.05
    document.getElementById('interact-btn').style.opacity = interactOpacity
}

function animateCam() {
    const smoothness = 0.1
    camera.position.x -= (camFocusTargetX + camera.position.x) * smoothness
    camera.position.y -= (camFocusTargetY + camera.position.y) * smoothness

    setTimeout(() => {
        camFocus = false
        paused = false
    }, 2000)
}

function lockPlayer() {
    player.draw()

    if (titleSequence) {
        beakerOverlay.update()

    }

    else if (!paused) {
        player.updateCamBox()
        player.applyYVelocity()
        player.updateAnims()
        player.checkBelow()
        player.checkUnderCounter()
        beakerOverlay.update()
        
        canInteract = false

        if (player.velocity.y !== 0) Sprite.prototype.update.call(player)

        // fade the interact btn
        if (document.getElementById('interact-btn').style.opacity >= 0) 
            interactOpacity -= 0.05
        document.getElementById('interact-btn').style.opacity = interactOpacity
        
        // climbing
        if (climbing) {
            player.velocity.y = 0
            if (keys.w.pressed) {
                climbingFootsteps.play()

                if ((player.position.y > groundMiddle.position.y - player.height && currentInteractBlock === ladderWire) || (player.position.y > vineTop.position.y - player.height && currentInteractBlock === ladderVine) || (player.position.y > counterShelf.position.y - player.height && currentInteractBlock === pipeLadder))
                    player.velocity.y = -3
                else { // top of the ladder
                    keys.w.climbCD = true
                    locked = false
                    climbing = false

                    // update player
                    player.velocity.x = 0

                    setTimeout(() => {
                        keys.w.climbCD = false
                    }, 700);
                }
            }
            else if (keys.s.pressed) {
                climbingFootsteps.play()

                if ((player.position.y + player.height + 3 < groundBottom.position.y && currentInteractBlock === ladderWire) || (player.position.y + player.height + 3 < groundMiddle.position.y && currentInteractBlock === ladderVine) || (player.position.y + player.height + 3 < groundBottom.position.y && currentInteractBlock === pipeLadder))
                    player.velocity.y = 3
                else { // bottom of the ladder
                    keys.w.climbCD = true
                    locked = false
                    climbing = false

                    // update player
                    player.velocity.x = 0

                    setTimeout(() => {
                        keys.w.climbCD = false
                    }, 700);
                }
            }
        }

        // teleporting
        if (teleporting) {
            player.updateCamBox()
            player.updateAnims()
            vineTop.draw()
            Sprite.prototype.update.call(player)

            player.velocity.x = 0
            player.velocity.y = 0

            canInteract = false

            if (blackoutOpacity <= 1 && player.position.x !== teleportTargetX) blackoutOpacity += 0.02
            else {
                player.position.x = teleportTargetX
                player.position.y = teleportTargetY
                player.flip = true

                if (currentInteractBlock === ventDoor) {
                    yCamOffset = 165
                    visionRadius = 900
                    vignetteOpacity = 0.3
                    overlayOpacity = 0
                }
                if (currentInteractBlock === ventDoorTop) {
                    yCamOffset = 150
                    visionRadius = 350
                    vignetteOpacity = 0.9
                    overlayOpacity = 0.5
                }

                setTimeout(() => {
                    if (blackoutOpacity > 0) blackoutOpacity -= 0.03
                    else {
                        locked = false 
                        teleporting = false
                    }
                }, 500)
            }
            document.getElementById('blackout-screen').style.opacity = blackoutOpacity
        }
    }
}

function interact() {
    if (currentInteractBlock.type === 'ladder') {
        if ((currentInteractBlock === ladderVine && vineUnlocked) || (currentInteractBlock === pipeLadder) || (currentInteractBlock === ladderWire)) {
            player.position.x = (currentInteractBlock.position.x + currentInteractBlock.size.width/2) - player.width/2
            locked = true
            climbing = true
        }
        if (currentInteractBlock === ladderVine && !vineUnlocked) {
            interaction.play()
            
        }
    }
    else if (currentInteractBlock.type === 'door') {
        locked = true
        teleporting = true
        if (currentInteractBlock === ventDoor) {
            if (!ventUnlocked) {
                interaction.play()
                locked = false
                teleporting = false

                // do stuff
                ventUnlocked = true
            }
            else {
                panel.play()
                teleportTargetX = 2458
                teleportTargetY = 499
            }
        }
        if (currentInteractBlock === ventDoorTop) {
            panel.play()
            teleportTargetX = 1750
            teleportTargetY = 1835
        }
    }
    else if (currentInteractBlock.type === 'puzzle') {
        if (currentInteractBlock === wirePickup) {
            pickup.play()
            wireUnlocked = true
            inv.addItem(item.wire)
        }
        if (currentInteractBlock === deployWire) {
            interaction.play()
            wireUnlockedDeployed = true
            inv.removeItem(item.wire)
        }
        if (currentInteractBlock === fuseBox) {
            panel.play()
            console.log('fuse box')
        }
        if (currentInteractBlock === vaultDoor) {
            interaction.play()
            console.log('vault door')
        }
        if (currentInteractBlock === vaultKeypad) {
            interaction.play()
            console.log('vault keypad')
        }
        if (currentInteractBlock === booksBelow) {
            interaction.play()
            console.log('books below')
        }
        if (currentInteractBlock === noteBottom) {
            paper.play()
            console.log('note bottom')
        }
        if (currentInteractBlock === noteTop) {
            paper.play()
            console.log('note top')
        }
        if (currentInteractBlock === noteMiddle) {
            paper.play()
            console.log('note middle')
        }
        if (currentInteractBlock === binderTop) {
            interaction.play()
            console.log('binder top')
        }
        if (currentInteractBlock === telescope) {
            interaction.play()
            console.log('telescope')
        }
        if (currentInteractBlock === boiler) {
            interaction.play()
            console.log('boiler')
        }
    }
}

// draw hover effect
function showHover() {
    if (!canInteract) return
    if ((currentInteractBlock === fuseBox || currentInteractBlock === vaultDoor || currentInteractBlock === binderTop)) 
        hoverLayer1.update()
    if ((currentInteractBlock === vaultKeypad || currentInteractBlock === booksBelow || currentInteractBlock === boiler)) 
        hoverLayer2.update()
    if (((currentInteractBlock === ladderVine && !vineUnlocked) || currentInteractBlock === wirePickup || currentInteractBlock === ventDoor || currentInteractBlock === ventDoorTop || currentInteractBlock === noteBottom || currentInteractBlock === telescope)) 
        hoverLayer3.update()
    if ((currentInteractBlock === deployWire))
        hoverLayer4.update()

    // change text

}
function showHoverBack() {
    if (canInteract && (currentInteractBlock === noteMiddle || currentInteractBlock === noteTop)) 
        hoverLayerBack.update()
}

// vignette
function drawVignette() {
    const gradient = ctx.createRadialGradient(
        player.position.x + player.width / 2, player.position.y + player.height / 2, player.width / 2, 
        player.position.x + player.width / 2, player.position.y + player.height / 2, visionRadius
    )

    gradient.addColorStop(0, `rgba(0, 0, 0, ${overlayOpacity})`)
    gradient.addColorStop(1, `rgba(0, 0, 0, ${vignetteOpacity})`)

    // Fill the canvas with the gradient
    ctx.fillStyle = gradient

    const targetX = Math.abs(camera.position.x)
    const targetY = Math.abs(camera.position.y)
    ctx.fillRect(targetX - 200, targetY - 200, scaledCanvas.width + 400, scaledCanvas.height + 400)
}

// draw counter overlay
function drawCounterOverlay() {
    ctx.fillStyle = `rgba(0, 0, 0, ${counterOverlayOpacity})`
    ctx.fillRect(counterOverlay.position.x, counterOverlay.position.y, counterOverlay.width, counterOverlay.height)
}

// draw pushable box
function drawBox() {
    const image = new Image()
    image.src = box.imageSrc
    if (!image) return
    ctx.drawImage(image, box.position.x, box.position.y, box.width, box.height)
    ctx.drawImage(image, box.position.x, box.position.y, box.width, box.height)
}

document.getElementById('btn').onclick = () => {
    vineUnlocked = true
    locked = true
}
document.getElementById('btn2').onclick = () => {
    if (!paused) {
        paused = true
        camFocus = true

        camFocusTargetX = 0
        camFocusTargetY = 0
    }
}