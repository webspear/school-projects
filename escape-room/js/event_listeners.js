// key events
window.addEventListener('keydown', (event) => {
    switch (event.key) {
        case 'w':
            if (!keys.jump.inAir) keys.jump.inAir = true
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
        case 'e':
            if (canInteract) {
                interact()
            }
            break
    }
})

window.addEventListener('keyup', (event) => {
    switch (event.key) {
        case 'd':
            keys.d.pressed = false
            break
        case 'a':
            keys.a.pressed = false
            break
    }
})
