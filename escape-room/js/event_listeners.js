// key events
window.addEventListener('keydown', (event) => {
    switch (event.key) {
        case 'w':
            keys.w.pressed = true
            if (!keys.jump.inAir && !keys.w.climbCD) keys.jump.inAir = true
            break
        case ' ':
            if (!keys.jump.inAir) keys.jump.inAir = true
            break
        case 'a':
            keys.a.pressed = true
            break
        case 'd':
            keys.d.pressed = true
            break
        case 's':
            keys.s.pressed = true
            break
        case 'e':
            if (canInteract) {
                interact()
            }
            break
        case 'Escape':
            if (!paused) paused = true
            else paused = false
            break
    }
})

window.addEventListener('keyup', (event) => {
    switch (event.key) {
        case 'w':
            keys.w.pressed = false
            break
        case 'd':
            keys.d.pressed = false
            break
        case 'a':
            keys.a.pressed = false
            break
        case 's':
            keys.s.pressed = false
            break
    }
})
