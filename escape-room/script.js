// setting it up
const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')

const zoomFactor = 1.85

const scaledCanvas = {
    width: canvas.width / zoomFactor,
    height: canvas.height / zoomFactor
}

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

//bg img
const foreground = new Sprite({
    position: {
        x: 0,
        y: 0,
    },
    imageSrc: './assets/images/lab-foreground-final.png' // this is a placeholder lol, change later
})
const background = new Sprite({
    position: {
        x: -256,
        y: 0,
    },
    imageSrc: './assets/images/lab-background-final.png' // this is a placeholder lol, change later
})

// under counter overlay
const counterOverlay = {
    position: {
        x: 0,
        y: 1344,
    },
    width: 1904,
    height: 576,
}

// beaker overlay
const beakerOverlay = new Sprite({
    position: {
        x: 1464,
        y: 1096,
    },
    imageSrc: './assets/images/beaker-overlay.png'
})
// grown plant
const grownPlant = new Sprite({
    position: {
        x: 456,
        y: 880,
    },
    imageSrc: './assets/images/plant-grown.png'
})
// open vent
const ventOpen = new Sprite({
    position: {
        x: 1688,
        y: 1736,
    },
    imageSrc: './assets/images/vent-open.png'
})

// camera
const camera = {
    position: {
        x: 1,
        y: -2560 + scaledCanvas.height + 1600, // 2560 is the height of the background image (change later)
    },

}

// the player
const player = new Player({
    position: {
        x: 1500,
        y: 1100,
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
    },

})

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
    ctx.restore()

    // zoom
    ctx.save()
    ctx.scale(zoomFactor, zoomFactor)
    ctx.translate(camera.position.x, camera.position.y)

    foreground.update()
    
    if (vineUnlocked) grownPlant.update()
    if (ventUnlocked) ventOpen.update()
    
    if (!paused && !locked) {
        drawObjects()

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

    drawCounterOverlay()

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
        player.velocity.x = 4
    }
    else if (keys.a.pressed) {
        player.velocity.x = -4
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

    if (!paused) {
        player.updateCamBox()
        player.applyYVelocity()
        player.updateAnims()
        player.checkBelow()
        vineTop.draw()

        if (player.velocity.y !== 0) Sprite.prototype.update.call(player)

        // fade the interact btn
        if (document.getElementById('interact-btn').style.opacity >= 0) 
            interactOpacity -= 0.05
        document.getElementById('interact-btn').style.opacity = interactOpacity
        
        // climbing
        if (climbing) {
            player.velocity.y = 0
            if (keys.w.pressed) {
                if ((player.position.y > vineTop.position.y - player.height && currentInteractBlock === ladderVine) || (player.position.y > counterShelf.position.y - player.height && currentInteractBlock === pipeLadder))
                    player.velocity.y = -2
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
                if ((player.position.y + player.height + 2 < groundMiddle.position.y && currentInteractBlock === ladderVine) || (player.position.y + player.height + 2 < groundBottom.position.y && currentInteractBlock === pipeLadder))
                    player.velocity.y = 2
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
                    yCamOffset = 165
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
        locked = true
        climbing = true
        if (currentInteractBlock === ladderVine) player.position.x = (ladderVine.position.x + ladderVine.size.width/2) - player.width/2
        if (currentInteractBlock === pipeLadder) player.position.x = (pipeLadder.position.x + pipeLadder.size.width/2) - player.width/2
    }
    else if (currentInteractBlock.type === 'door') {
        locked = true
        teleporting = true
        if (currentInteractBlock === ventDoor) {
            if (!ventUnlocked) {
                locked = false
                teleporting = false

                // do stuff
                ventUnlocked = true
            }
            else {
                teleportTargetX = 2458
                teleportTargetY = 499
            }
        }
        if (currentInteractBlock === ventDoorTop) {
            teleportTargetX = 1750
            teleportTargetY = 1835
        }
    }
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

// determine how the game size should be like (depending on the window size)
window.addEventListener(onload, checkresize())
$(window).resize(function() {checkresize()})

function checkresize() {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    
    scaledCanvas.width = canvas.width / zoomFactor
    scaledCanvas.height = canvas.height / zoomFactor
}

document.getElementById('btn').onclick = () => {
    vineUnlocked = true
}
document.getElementById('btn3').onclick = () => {
    ventUnlocked = true
}
document.getElementById('btn2').onclick = () => {
    if (!paused) {
        paused = true
        camFocus = true

        camFocusTargetX = 0
        camFocusTargetY = 0
    }
}