const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')

const keys = {
    w: false,
    s: false,
    up: false,
    down: false,
}

let players = []

const difficulties = {
    easy: {marginOfError: 100},
    medium: {marginOfError: 70},
    hard: {marginOfError: 50},
    survival: {marginOfError: 0}
}

// game settings
let updateToggle = false
let paused = false
let preventPause = true
let playerCount = 1
let player1Score = 0
let player2Score = 0
let lastPlayerScore = 1
let gradualSpeedIncrease = false
let color = 'white'
let paddleSize = 100

// ball settings
let CPUTarget = canvas.height/2
let lastPlayerHit = null // placeholder!
let lastPlayerHitToggle = false
let targetFound = false

// difficulties
let difficulty = difficulties.hard

// html elements
const gameStatus = document.getElementById('game-status')
const endScreen = document.getElementById('end-screen')
const endTitle = document.getElementById('end-title')
const endDesc1 = document.getElementById('end-desc-1')
const endDesc2 = document.getElementById('end-desc-2')

// sound elements
const bounce = new Audio()
bounce.src = 'assets/sounds/bounce.mp3'
const hover = new Audio()
hover.src = 'assets/sounds/hover.mp3'
const lose = new Audio()
lose.src = 'assets/sounds/lose.mp3'
const point = new Audio()
point.src = 'assets/sounds/point.mp3'
const select = new Audio()
select.src = 'assets/sounds/select.mp3'
const win = new Audio()
win.src = 'assets/sounds/win.mp3'
const tick = new Audio()
tick.src = 'assets/sounds/tick.mp3'
const go = new Audio()
go.src = 'assets/sounds/go.mp3'

const sounds = [bounce, hover, lose, point, select, win, tick, go]

// background music
const music = new Audio()
music.src = 'assets/sounds/music.mp3'
music.volume = 0.5
music.loop = true

const game = {
    // instances
    player1: new Player({
        position: {
            x: 50,
            y: canvas.height/2 - 50,
        },
    }),
    player2: new Player({
        position: {
            x: canvas.width - 70,
            y: canvas.height/2 - 50,
        },
    }),
    ball: new Ball({
        position:{
            x: canvas.width/2,
            y: canvas.height/2
        },
    }),
    ghostBall: new GhostBall({
        position:{
            x: 0,
            y: 0
        },
    }),

    update() {
        // update
        window.requestAnimationFrame(game.update)

        // redraw canvas
        ctx.fillStyle = 'black'
        ctx.fillRect(0, 0, canvas.width, canvas.height)

        // draw middle line
        ctx.save()
        ctx.beginPath()
        ctx.setLineDash([50, 20])
        ctx.moveTo(canvas.width/2, 10)
        ctx.lineTo(canvas.width/2, canvas.height)
        ctx.strokeStyle = color
        ctx.lineWidth = '20'
        ctx.stroke()
        ctx.restore()

        // draw points
        ctx.font = '100px ending'
        ctx.fillStyle = color
        ctx.fillText(player1Score, canvas.width/4, 100)

        if (difficulty != difficulties.survival) {
            let player2ScoreWidth = ctx.measureText(player2Score)
            ctx.fillText(player2Score, ((canvas.width/4)*3) - (player2ScoreWidth.width), 100)
        }

        // update game objects
        game.player1.update()
        game.player2.update()
        game.ball.draw()

        if (paused) return

        // player 1 movement
        if (keys.w && keys.s) game.player1.velocity = 0
        else if (game.player1.position.y < 0 + 10 || game.player1.position.y + game.player1.height > canvas.height - 10) {
            game.player1.velocity = 0
            game.player1.position.y = game.player1.position.y <= 0 + 10 ? game.player1.position.y = 0 + 10 : game.player1.position.y = canvas.height - 10 - game.player1.height
        }
        else if (keys.w) game.player1.velocity = -(game.player1.speed)
        else if (keys.s) game.player1.velocity = game.player1.speed

        // player 2 movement
        if (playerCount > 1) {
            if (keys.up && keys.down) game.player2.velocity = 0
            else if (game.player2.position.y < 0 + 10 || game.player2.position.y + game.player2.height > canvas.height - 10) {
                game.player2.velocity = 0
                game.player2.position.y = game.player2.position.y <= 0 + 10 ? game.player2.position.y = 0 + 10 : game.player2.position.y = canvas.height - 10 - game.player2.height
            }
            else if (keys.up) game.player2.velocity = -(game.player2.speed)
            else if (keys.down) game.player2.velocity = game.player2.speed
        }

        // cpu
        else {
            game.handleCPU()
        }
        
        // update ball
        game.ball.update()
    },

    handleCPU() {
        // predict ball location
        if (lastPlayerHit == game.player1 && lastPlayerHitToggle) {
            lastPlayerHitToggle = false
            targetFound = false

            game.ghostBall.position.x = game.ball.position.x
            game.ghostBall.position.y = game.ball.position.y
            game.ghostBall.direction = game.ball.direction
            game.ghostBall.speed = game.ball.speed + 1.5
        }

        if (game.ghostBall.position.x >= game.player2.position.x - game.ball.radius && !targetFound) {
            targetFound = true

            // have a random offset for the CPUTarget
            const margin = difficulty.marginOfError
            const randomOffset = (Math.random() - 0.5) * 2 * margin  // random value
            CPUTarget = game.ghostBall.position.y + randomOffset
        }
        else {
            game.ghostBall.update()
        }

        // debug
        // ctx.beginPath()
        // ctx.fillStyle = 'grey'
        // ctx.arc(game.player2.position.x - 15, CPUTarget, 15, 0, Math.PI*2, true)
        // ctx.fill()
        // ctx.stroke()

        let distanceForCPU = CPUTarget - (game.player2.position.y + game.player2.height / 2)
        let stopThreshold = 2  // stop if within this distance to avoid overshooting

        // only move if player2 is not close enough to the target
        if (lastPlayerHit == game.player1 && !lastPlayerHitToggle && Math.abs(distanceForCPU) > stopThreshold) {
            if (game.player2.position.y < 0 + 10 || game.player2.position.y + game.player2.height > canvas.height - 10) {
                game.player2.velocity = 0
                game.player2.position.y = game.player2.position.y <= 0 + 10 ? game.player2.position.y = 0 + 10 : game.player2.position.y = canvas.height - 10 - game.player2.height
            }
            else if (distanceForCPU < 0) {
                game.player2.velocity = Math.max(-game.player2.speed, distanceForCPU)
            } else {
                game.player2.velocity = Math.min(game.player2.speed, distanceForCPU)
            }
        } 
        else {
            game.player2.velocity = 0
        }
    },

    // start a round
    roundStart(e) {
        paused = true
        preventPause = true

        // countdown
        gameStatus.style.visibility = 'visible'
        gameStatus.textContent = '3'
        tick.play()
        setTimeout(() => {
            gameStatus.textContent = '2'
            tick.play()
            setTimeout(() => {
                gameStatus.textContent = '1'
                tick.play()
                setTimeout(() => {
                    gameStatus.textContent = 'GO!'
                    go.play()
                    paused = false

                    // start survival countdown
                    if (difficulty == difficulties.survival) survivalScore()

                    setTimeout(() => {
                        preventPause = false
                        gameStatus.style.visibility = 'hidden'
                    }, 1000);
                }, 1000);
            }, 1000);
        }, 1000);

        // set ball y position
        const randomY = (Math.random() * 500) + 100
        game.ball.position.y = randomY

        // set ball position
        if (e == 2) {
            game.ball.position.x = canvas.width - 200
        } else {
            game.ball.position.x = 200
            lastPlayerHit = game.player1
            lastPlayerHitToggle = true
        }

        // reset ball speed
        game.ball.speed = 0.50

        // set paddle position
        game.player1.position.y = canvas.height/2 - 50
        game.player2.position.y = canvas.height/2 - 50

        // reset CPUTarget
        CPUTarget = canvas.height/2
    },

    roundEnd() {
        // pause the game
        paused = true
        preventPause = true

        gameStatus.style.visibility = 'visible'

        setTimeout(() => {
            gameStatus.style.visibility = 'hidden'

            if (player1Score != 3 && player2Score != 3 && difficulty != difficulties.survival) {
                game.roundStart(lastPlayerScore)
            }

            // survival gamemode
            else if (player2Score > 0 && difficulty == difficulties.survival) {
                endTitle.textContent = 'ROUND END'
                endDesc1.textContent = 'SCORE: ' + player1Score
                endDesc2.textContent = ' '
                document.getElementById('end-screen').style.visibility = 'visible'
                lose.play()
            }

            // end game
            else {
                if (playerCount == 1) {
                    if (difficulty != difficulties.survival && player1Score == 3) {
                        endTitle.textContent = 'PLAYER 1 VICTORY'
                        endDesc1.textContent = 'PLAYER SCORE: ' + player1Score
                        endDesc2.textContent = 'CPU SCORE: ' + player2Score
                        win.play()
                    }
                    else if (difficulty != difficulties.survival && player2Score == 3) {
                        endTitle.textContent = 'CPU VICTORY'
                        endDesc1.textContent = 'PLAYER SCORE: ' + player1Score
                        endDesc2.textContent = 'CPU SCORE: ' + player2Score
                        lose.play()
                    }
                }
                else {
                    if (player1Score == 3) {
                        endTitle.textContent = 'PLAYER 1 VICTORY'
                        endDesc1.textContent = 'PLAYER 1 SCORE: ' + player1Score
                        endDesc2.textContent = 'PLAYER 2 SCORE: ' + player2Score
                        win.play()
                    }
                    else if (player2Score == 3) {
                        endTitle.textContent = 'PLAYER 2 VICTORY'
                        endDesc1.textContent = 'PLAYER 1 SCORE: ' + player1Score
                        endDesc2.textContent = 'PLAYER 2 SCORE: ' + player2Score
                        win.play()
                    }
                }
                document.getElementById('end-screen').style.visibility = 'visible'
            }
        }, 3000);
    }
}

function survivalScore() {
    setTimeout(() => {
        if (!paused) player1Score++
        if (player2Score == 0) survivalScore()
    }, 1000);
}

function mouseOver(e) {
    e.style.textDecoration = 'underline'
}
function mouseOut(e) {
    e.style.textDecoration = 'none'
}

// game.update()
// game.roundStart()