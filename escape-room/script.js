// setting it up
const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')

const zoomFactor = 1.75

let paused = false

let camFocus = false
let camFocusTargetX
let camFocusTargetY

let canInteract = false
let interactOpacity = 0
let currentInteractBlock
let locked = false
let climbing = false

// unlocks
let vineUnlocked = false

const scaledCanvas = {
    width: canvas.width / zoomFactor,
    height: canvas.height / zoomFactor
}

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
const background = new Sprite({
    position: {
        x: 0,
        y: 0,
    },
    imageSrc: './assets/images/main-bg.png' // this is a placeholder lol, change later
})

// grown plant
const grownPlant = new Sprite({
    position: {
        x: 456,
        y: 880,
    },
    imageSrc: './assets/images/plant-grown.png'
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
    ctx.fillStyle = 'white'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // zoom
    ctx.save()
    ctx.scale(zoomFactor, zoomFactor)
    ctx.translate(camera.position.x, camera.position.y)
    
    background.update()

    if (vineUnlocked) grownPlant.update()
    
    if (!paused && !locked) {
        drawObjects()

        player.update()

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
                if (player.position.y > vineTop.position.y - player.height)
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
                if (player.position.y + player.height + 2 < groundMiddle.position.y)
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
    }
}

function interact() {
    if (currentInteractBlock.tag = 'ladder' && vineUnlocked) {
        player.position.x = (ladderVine.position.x + ladderVine.size.width/2) - player.width/2
        locked = true
        climbing = true
    }
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
document.getElementById('btn2').onclick = () => {
    if (!paused) {
        paused = true
        camFocus = true

        camFocusTargetX = 0
        camFocusTargetY = 0
    }
}