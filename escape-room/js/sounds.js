const footsteps = new Sound({
    src: [
        './assets/sounds/steps/step-1.mp3',
        './assets/sounds/steps/step-2.mp3',
        './assets/sounds/steps/step-3.mp3',
        './assets/sounds/steps/step-4.mp3',
    ],
    buffer: 20,
    frameRate: 4,
})
const climbingFootsteps = new Sound({
    src: [
        './assets/sounds/steps/step-1.mp3',
        './assets/sounds/steps/step-2.mp3',
    ],
    buffer: 15,
    frameRate: 2,
})

// interactions
const interaction = new Audio()
interaction.src = './assets/sounds/interaction.mp3'

const paper = new Audio()
paper.src = './assets/sounds/paper.mp3'

const panel = new Audio()
panel.src = './assets/sounds/panel.mp3'

const menuButton = new Audio()
menuButton.src = './assets/sounds/menu-button.mp3'

const pickup = new Audio()
pickup.src = './assets/sounds/pickup.mp3'

function wireSound() {
    const selector = Math.floor(Math.random() * 2)
    const wire = new Audio()
    if (selector === 0) wire.src = './assets/sounds/wire-1.mp3'
    else wire.src = './assets/sounds/wire-2.mp3'
    wire.play()
}

// theme for when you are playing
const gameTheme = new Audio()
gameTheme.src = './assets/sounds/game-theme.mp3'

// theme for the menu
const menuTheme = new Audio()
menuTheme.src = './assets/sounds/menu-theme.mp3'

// theme for the end screen
const endTheme = new Audio()
endTheme.src = './assets/sounds/end-theme.mp3'
