// setting it up
const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')

const zoomFactor = 2.5

let paused = false

let camFocus = false
let camFocusTargetX = 0
let camFocusTargetY = 0

let canInteract = false
let interactOpacity = 0
let currentInteractBlock = null

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
    d: {
        pressed: false,
    },
    a: {
        pressed: false,
    },
}

//bg img
const background = new Sprite({
    position: {
        x: 0,
        y: 0,
    },
    imageSrc: './assets/images/background.png' // this is a placeholder lol, change later
})

// camera
const camera = {
    position: {
        x: 1,
        y: -1260 + scaledCanvas.height + 900, // 1260 is the height of the background image (change later)
    },

}

// the player
const player = new Player({
    position: {
        x: 600,
        y: 600,
    },
    gravity: 1, // change gravity as see fit

    collisionBlocks: collisionBlocks,
    interactables: interactables,
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
    if (!paused) {
        collisionBlocks.forEach(block => {
            block.draw()
        })
        interactables.forEach(block => {
            block.draw()
        })

        player.update()

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
            if (!keys.jump.jumped) {
                player.velocity.y = -12
                keys.jump.jumped = true
            }
            keys.jump.inAir = false
        }
        
        // if (player.velocity.y < 0) 
        // else if (player.velocity.y > 0) 

        // interact text 
        if (canInteract && document.getElementById('interact-btn').style.opacity <= 1) 
            interactOpacity += 0.05
        else if (!canInteract && document.getElementById('interact-btn').style.opacity >= 0) 
            interactOpacity -= 0.05
        document.getElementById('interact-btn').style.opacity = interactOpacity
    }
    else if (camFocus) {
        const smoothness = 0.1
        camera.position.x -= (camFocusTargetX + camera.position.x) * smoothness
        camera.position.y -= (camFocusTargetY + camera.position.y) * smoothness

        setTimeout(() => {
            camFocus = false
            paused = false
        }, 2000);
    }
    else {
        player.draw()
    }

    ctx.restore()
}

animate()

function interact() {
    if (currentInteractBlock.tag = 'ladder') {
        player.position.x = interact1.position.x - player.width/2
        paused = true
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
    if (!paused) paused = true
    else paused = false
}

document.getElementById('btn2').onclick = () => {
    if (!paused) {
        paused = true
        camFocus = true

        camFocusTargetX = 0
        camFocusTargetY = 0
    }
}