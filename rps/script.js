// global variables
let playerHealth = 100
let score = 0
let damage = 20
const game = document.getElementById('game')
const optionContainer = document.getElementById('optionContainerPlayer')
const brawl = document.getElementById('brawl')
const playerChoice = document.getElementById('playerChoice')
const computerChoice = document.getElementById('computerChoice')
const countdown = document.getElementById('countdown')
const playerHealthText = document.getElementById('playerHealth')
const scoreText = document.getElementById('score')
// sound variables
const punch = new Audio('sounds/punch.mp3')
const damageSFX = new Audio('sounds/damage.mp3')
const correctSFX = new Audio('sounds/correct.mp3')
const bgMusic = new Audio('sounds/bg-music.mp3')

// start the game
document.getElementById('startGame').onclick = function() {
    document.getElementById('startOverlay').style.animation = 'fadeOut 1550ms'
    setTimeout(() => { document.getElementById('startOverlay').style.visibility = 'hidden' }, 1500)// start music (autoplay policices prevent me from starting the music on page load)
    bgMusic.play()
    bgMusic.loop = true
    bgMusic.volume = 0.1
}

// screen changing
document.getElementById('startButton').onclick = function() { 
    document.getElementById('menu').style.visibility = 'hidden'
    document.getElementById('difficulties').style.visibility = 'visible'
}

// open help menu
document.getElementById('helpButton').onclick = function() {
    document.getElementById('help').style.visibility = 'visible'
}
// close help menu
document.getElementById('closeHelp').onclick = function() {
    document.getElementById('help').style.visibility = 'hidden'
}

// difficulty options
document.getElementById('easy').onclick = function() {
    document.getElementById('difficulties').style.visibility = 'hidden'
    game.style.visibility = 'visible'
    damage = 10
    document.getElementById('difficulty').innerHTML = 'DIFFICULTY: EASY'
}
document.getElementById('normal').onclick = function() {
    document.getElementById('difficulties').style.visibility = 'hidden'
    game.style.visibility = 'visible'
    damage = 20
    document.getElementById('difficulty').innerHTML = 'DIFFICULTY: NORMAL'
}
document.getElementById('hard').onclick = function() {
    document.getElementById('difficulties').style.visibility = 'hidden'
    game.style.visibility = 'visible'
    damage = 50
    document.getElementById('difficulty').innerHTML = 'DIFFICULTY: HARD'
}

// retry button on click
document.getElementById('retry').onclick = function() {
    document.getElementById('over').style.visibility = 'hidden'
    document.getElementById('difficulties').style.visibility = 'visible'

    // reset everything
    score = 0
    playerHealth = 100
    playerHealthText.innerHTML = 'HEALTH: 100'
    scoreText.innerHTML = 'SCORE: 0'
    document.getElementById('healthbar').style.width = 20 + 'vw'
}


// choice
function play(choice) {

    // choices fade out of the screen
    optionContainer.style.animation = 'none' // remove animation
    optionContainer.style.animation = 'fadeOut 350ms'
    setTimeout(() => {
        optionContainer.style.visibility = 'hidden'
    }, 300)
    
    // animation for fading in
    setTimeout(() => {
        brawl.style.visibility = 'visible'
        brawl.style.opacity = 0
        brawl.style.animation = 'none'
        brawl.style.animation = 'fadeIn 350ms'
        setTimeout(() => {
            brawl.style.opacity = 100
        }, 300)
    }, 400)

    // images variable
    playerChoice.src = 'images/rock.png'
    computerChoice.src = 'images/rock.png'

    // bob up and down animation
    const playerInterval = setInterval(() => {
        playerChoice.style.animation = 'bobUpAndDownPlayer 300ms'
        setTimeout(() => {
            playerChoice.style.animation = 'none'
            punch.play()
        }, 300)
    }, 600)
    const computerInterval = setInterval(() => {
        computerChoice.style.animation = 'bobUpAndDownComputer 300ms'
        setTimeout(() => {
            computerChoice.style.animation = 'none'
        }, 300)
    }, 600)

    // countdown synced with the bobbing
    setTimeout(() => {
        countdown.innerHTML = 'ROCK!'
        countdown.style.animation = 'fadeIn 300ms'
        countdown.addEventListener("animationend", function restart(){countdown.style.animation = ""})
        setTimeout(() => {
            countdown.innerHTML = 'PAPER!'
            setTimeout(() => {
                countdown.innerHTML = 'SCISSORS!'
                setTimeout(() => {
                    // fade text out
                    setTimeout(() => { countdown.style.animation = 'none'; countdown.style.animation = 'fadeOut 350ms' }, 300)
                    setTimeout(() => { countdown.style.opacity = 0 }, 600)

                    // stop the animations
                    clearInterval(playerInterval)
                    clearInterval(computerInterval)

                    // generate computer's choice
                    let randomizer = Math.floor(Math.random() * 3) + 1 // 1: rock, 2: paper, 3: scissors

                    // checking if the player won the match or not
                    if (choice.classList.contains('choice') && choice.id === 'rock'){
                        playerChoice.src = 'images/rock.png'
                        rock(randomizer)
                    }
                    else if (choice.classList.contains('choice') && choice.id === 'paper'){
                        playerChoice.src = 'images/paper.png'
                        paper(randomizer)
                    }
                    else if (choice.classList.contains('choice') && choice.id === 'scissors'){
                        playerChoice.src = 'images/scissors.png'
                        scissors(randomizer)
                    }

                    // fade out the brawl animation
                    setTimeout(() => {
                        brawl.style.animation = 'none'
                        brawl.style.animation = 'fadeOut 350ms'
                        setTimeout(() => {
                            brawl.style.visibility = 'hidden'

                            // fade in the choices
                            optionContainer.style.visibility = ''
                            optionContainer.style.animation = 'none'
                            optionContainer.style.animation = 'fadeIn 350ms'
                            setTimeout(() => {
                                countdown.innerHTML = ''
                            }, 300)
                        }, 300)
                    }, 3000)
                }, 300)
            }, 600)
        }, 600)
    }, 800)
}

function rock(randomizer) {
    // rock vs rock
    if (randomizer == 1) {
        computerChoice.src = 'images/rock.png'
        tie()
    }
    // rock vs paper
    else if (randomizer == 2) {
        computerChoice.src = 'images/paper.png'
        lose()
    }
    // rock vs scissors
    else if (randomizer == 3) {
        computerChoice.src = 'images/scissors.png'
        win()
    }
}
function paper(randomizer) {
    // paper vs rock
    if (randomizer == 1) {
        computerChoice.src = 'images/rock.png'
        win()
    }
    // paper vs paper
    else if (randomizer == 2) {
        computerChoice.src = 'images/paper.png'
        tie()
    }
    // paper vs scissors
    else if (randomizer == 3) {
        computerChoice.src = 'images/scissors.png'
        lose()
    }
}
function scissors(randomizer) {
    // scissors vs rock
    if (randomizer == 1) {
        computerChoice.src = 'images/rock.png'
        lose()
    }
    // scissors vs paper
    else if (randomizer == 2) {
        computerChoice.src = 'images/paper.png'
        win()
    }
    // scissors vs scissors
    else if (randomizer == 3) {
        computerChoice.src = 'images/scissors.png'
        tie()
    }
}

function tie() {
        // fade text in
        setTimeout(() => {
            countdown.innerHTML = 'TIE!'
            countdown.style.animation = 'none'
            countdown.style.animation = 'fadeIn 350ms' 
        }, 1500)
        setTimeout(() => { countdown.style.opacity = 100 }, 1800)
}
function lose(){
    // fade text in
    setTimeout(() => {
        countdown.innerHTML = 'YOU LOSE!'
        countdown.style.animation = 'none'
        countdown.style.animation = 'fadeIn 350ms'
    }, 1500)
    setTimeout(() => {
        countdown.style.opacity = 100

        // damage sound
        damageSFX.play()

        // change the player's health status
        playerHealth -= damage
        playerHealthText.innerHTML = 'HEALTH: ' + playerHealth
        playerHealthText.style.animation = 'damage 500ms'
        playerHealthText.addEventListener("animationend", function restart(){playerHealthText.style.animation = ""})

        // change healthbar length
        const healthbar = document.getElementById('healthbar')
        let width = Math.floor(20*(playerHealth/100))
        healthbar.style.width = width + 'vw'
        healthbar.style.animation = 'damageBar 500ms'
        healthbar.addEventListener("animationend", function restart(){playerHealthText.style.animation = ""})

        // check if the player dies or not. if they do, go to deathscreen
        if (playerHealth <= 0) {
            setTimeout(() => { deathScreen() }, 1500)
        }
    }, 1800)
}
function win() {
    // fade text in
    setTimeout(() => { countdown.innerHTML = 'YOU WIN!'; countdown.style.animation = 'fadeIn 350ms' }, 1500)
    setTimeout(() => {
        countdown.style.opacity = 100

        // correct sound
        correctSFX.play()

        // change the points
        score += 10
        scoreText.innerHTML = 'SCORE: ' + score
        scoreText.style.animation = 'point 500ms'
        scoreText.addEventListener("animationend", function restart(){scoreText.style.animation = ""})
    }, 1800)
}

function deathScreen() {
    // show the final score
    document.getElementById('finalScore').innerHTML = 'SCORE: ' + score

    // fade out the game screen
    game.style.animation = 'fadeOut 350ms'
    setTimeout(() => {
        game.style.visibility = 'hidden'
        document.getElementById('over').style.visibility = 'visible'
    }, 300)
}

// sound effects
function hover(){
    const hover = new Audio('sounds/hover.mp3')
    hover.play()
}

function select(){
    const select = new Audio('sounds/select.mp3')
    select.play()
}

// mute/unmute the backgroun music
let isMuted = false
document.getElementById('sound').addEventListener('click', function() {
    const sound = document.getElementById('mute')
    isMuted = !isMuted
    if (isMuted) {
        sound.src = 'images/unmute.png';
        bgMusic.pause()
    } 
    else {
        sound.src = 'images/mute.png';
        bgMusic.play()
    }
})
