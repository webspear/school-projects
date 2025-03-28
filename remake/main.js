canvas = document.getElementById('canvas')
ctx = canvas.getContext('2d')

ctx.imageSmoothingEnabled = false

canvas.width = window.innerWidth
canvas.height = window.innerHeight

// init
const game = {
    started: false, // reset
    paused: false,
    spawnStart: null,
    pauseStart: 0,
    pauseDuration: 0,
    spawnCD: 2000,
    spawnCDInit: 2000,
    obstacles: [],
    obstacleCount: 0, // reset
    obstacleGap: 300,
    coinChance: 0.1,
    moveObsChance: 0,
    gameEnded: false,
    lvlDisplayed: false,
    obstaclePerLvl: 25, // reset
    wastedLife: false,
    triggeredLife: false,
    bases: [],
    baseA: null,
    baseB: null,
    baseC: null,
    gameLevel: 1, // reset
    gameLevelInit: 1,

    // image sources
    playerSprite: './assets/images/yellowbird.png',
    pipeSprite: './assets/images/pipe-green-export.png',
    pipeSprite2: './assets/images/pipe-green-export-2.png',
    background: './assets/images/background-day.png',
    base: './assets/images/base.png',


    // player stats
    playerDist: 0, // reset
    playerCoins: 0,
    playerPoint: 0,
    playerTotalCoins: 0, // reset
    playerLevel: 1,
    playerExp: 0,
    playerUnlock: 1, // reset

    // upgrades
    upgradeSlow: 1, // default is 1, lower
    upgradeCoin: 1, // default is 1, raise
    upgradeGap: 1, // default is 1, raise
    upgradeLife: false, // default is false
    upgradeGrav: 1, // default is 1, lower
}

const player = new Player({x: 300, y: canvas.height/4})

const backgroundSprite = new Image()
backgroundSprite.src = game.background

// sounds
const die = new Audio()
die.src = './assets/audio/die.wav'
const hit = new Audio()
hit.src = './assets/audio/hit.wav'
const point = new Audio()
point.src = './assets/audio/point.wav'
const swoosh = new Audio()
swoosh.src = './assets/audio/swoosh.wav'
const wing = new Audio()
wing.src = './assets/audio/wing.wav'
const coin = new Audio()
coin.src = './assets/audio/coin.mp3'
const win = new Audio()
win.src = './assets/audio/win.mp3'

const sounds = [die, hit, point, swoosh, wing, coin, win]

const music = new Audio('./assets/audio/music.mp3')
music.volume = 0.5
music.loop = true

function spawnObstacle() {
    if (game.spawnStart === null) {
        game.spawnStart = performance.now()
    }
    else if (!game.paused && game.obstacleCount < game.obstaclePerLvl && !game.gameEnded) {
        const currentTime = performance.now()
        if (currentTime - game.spawnStart >= game.spawnCD / game.upgradeSlow) {
            // reset cd
            game.spawnCD = game.spawnCDInit

            const obstacle = new Obstacle({x: canvas.width, y: 0})
            game.obstacles.push(obstacle)

            // coin chance
            const random = Math.random()
            if (random <= game.coinChance * game.upgradeCoin) {
                if (random <= game.coinChance/10 * game.upgradeCoin) obstacle.coinB = true
                else if (random <= game.coinChance/3 * game.upgradeCoin) obstacle.coinR = true
                else obstacle.coin = true
            }

            // update obstacle count
            game.obstacleCount++

            // reset timer
            game.spawnStart = null
        }
    }
}

// change levels
function changeLevel() {
    // if (game.gameLevel === 1) {
    //     setTimeout(() => {
    //         document.getElementById('lvl-txt').textContent = 'LEVEL ' + game.gameLevel
    //         document.getElementById('lvl-announcer').style.width = `500px`
    //         setTimeout(() => {
    //             document.getElementById('lvl-announcer').style.width = '0px'
    //         }, 2000)
    //     }, 300)
    // }
    if (game.gameLevel === 2) {
        game.spawnCD = 1750
        game.spawnCDInit = game.spawnCD
        game.obstacleGap = 250
    }
    if (game.gameLevel === 3) {
        game.spawnCD = 1750
        game.spawnCDInit = game.spawnCD
        game.obstacleGap = 250
        game.moveObsChance = 0.2
    }
    if (game.gameLevel === 4) {
        game.spawnCD = 1750
        game.spawnCDInit = game.spawnCD
        game.obstacleGap = 250
        game.moveObsChance = 1
    }
}

function displayLvl() {
    // console.log(game.obstaclePerLvl*(game.gameLevel - game.gameLevelInit))
    if (!game.lvlDisplayed && game.playerDist >= game.obstaclePerLvl*(game.gameLevel - game.gameLevelInit)) {
        setTimeout(() => {
            document.getElementById('lvl-txt').textContent = 'STAGE ' + game.gameLevel
            document.getElementById('lvl-announcer').style.width = `500px`
            setTimeout(() => {
                document.getElementById('lvl-announcer').style.width = '0px'
            }, 2000)
        }, 1000)
        game.lvlDisplayed = true
    }
}

// update level
function updateLevel() {
    if (game.obstacleCount >= game.obstaclePerLvl) {
        // check if game ended
        if (game.gameLevel >= 4) {
            if (game.playerDist >= game.obstaclePerLvl*(game.gameLevel + 1 - game.gameLevelInit) && !game.gameEnded) {
                game.gameEnded = true

                setTimeout(() => gameEnd('win'), 1000)
            }

            return
        }

        game.gameLevel++
        game.obstacleCount = 0

        changeLevel()

        game.lvlDisplayed = false

        // transition time
        game.spawnCD = 6000
    }
}

// end game
function gameEnd(state) {
    game.paused = true
    game.started = false

    game.playerUnlock = game.gameLevel

    document.getElementById('end').style.transition = '300ms'
    document.getElementById('end-exp-bar').style.transition = '100ms'

    if (state === 'win') {
        document.getElementById('end-title').textContent = 'Victory'
        document.getElementById('end-subtitle').textContent = '...and beyond!'

        win.currentTime = 0
        win.play()
    }
    else if (state === 'loss') {
        document.getElementById('end-title').textContent = 'Defeat'
        document.getElementById('end-subtitle').textContent = '...and redemption.'

        die.currentTime = 0
        die.play()
    }
    else { // fallback
        document.getElementById('end-title').textContent = 'Broken?'
        document.getElementById('end-subtitle').textContent = 'Well this is interesting.'
    }

    document.getElementById('end').style.visibility = 'visible'
    document.getElementById('end').style.top = '50%'
    document.getElementById('end').style.opacity = '1'

    document.getElementById("end-coins").innerHTML = `Coins Collected: <span style="color: #c9940c">+</span>${game.playerCoins}`
    document.getElementById("end-dist").textContent = 'Distance: ' + game.playerDist

    if (game.playerPoint !== 0) document.getElementById('end-exp-skill').style.visibility = 'visible'
    else document.getElementById('end-exp-skill').style.visibility = 'hidden'

    document.getElementById('end-btn-1').style.visibility = 'hidden'
    document.getElementById('end-btn-2').style.visibility = 'hidden'

    // update coins
    game.playerTotalCoins += game.playerCoins

    // update stats
    setTimeout(() => {
        // coins
        let countedCoins = false

        function countCoins() {
            if (!countedCoins) {
                window.requestAnimationFrame(countCoins)

                game.playerCoins -= 8

                if (game.playerCoins <= 0) {
                    countedCoins = true
                    game.playerCoins = 0
                }

                document.getElementById("end-coins").innerHTML = `Coins Collected: <span style="color: #c9940c">+</span>${game.playerCoins}`
            }
            else {
                setTimeout(() => {
                    // exp
                    let countedDist = false

                    function countDist() {
                        if (countedDist) {
                            setTimeout(() => {
                                document.getElementById('end-btn-1').style.visibility = 'visible'
                                document.getElementById('end-btn-2').style.visibility = 'visible'
                            }, 500)
                            return
                        }

                        window.requestAnimationFrame(countDist)

                        if (game.playerDist <= 0) {
                            countedDist = true
                            game.playerDist = 0
                        } else {
                            game.playerDist--
                            game.playerExp++
                        }

                        document.getElementById("end-dist").textContent = 'Distance: ' + game.playerDist

                        // update exp bar
                        if (game.playerExp >= 100) {
                            game.playerExp = 0
                            game.playerLevel++
                            document.getElementById('end-prev-lvl').textContent = 'Lvl ' + game.playerLevel
                            document.getElementById('end-next-lvl').textContent = 'Lvl ' + (game.playerLevel + 1)

                            // show skill
                            game.playerPoint++
                            document.getElementById('end-exp-skill').textContent = `+${game.playerPoint} new skill point`
                            document.getElementById('end-exp-skill').style.visibility = 'visible'
                        }

                        document.getElementById('end-exp-bar').style.background = `linear-gradient(to right, #d51b1b ${game.playerExp}%, rgba(194, 194, 194, 1) 0%)`
                    }
                    countDist()
                }, 500)
            }
        }
        countCoins()
    }, 1000)
}

function updateBases() {
    game.bases.forEach((base) => {
        base.update()

        if (base.done) {
            game.bases.splice(base, 1)

            game.baseA = game.baseB
            game.baseB = game.baseC

            game.baseC = new Base({x: game.baseB.sprite.width + game.baseB.x})
        }
    })
}

function gameLoop() {
    if (game.gameEnded) return
    window.requestAnimationFrame(gameLoop)

    if (game.paused) return

    // clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // spawn enemies
    spawnObstacle()

    // update level
    updateLevel()
    displayLvl()

    // draw background
    ctx.drawImage(backgroundSprite, 0, 0, canvas.height/(backgroundSprite.height / backgroundSprite.width), canvas.height)

    // update objects
    game.obstacles.forEach((obstacle) => {
        obstacle.update()

        if (obstacle.dispose) {
            game.obstacles.splice(obstacle, 1)
        }
    })
    player.update()

    // draw base
    updateBases()
}

// preload bases
const baseImage = new Image()
baseImage.src = game.base
baseImage.onload = () => {
    game.baseA = new Base({ x: 0 })
    game.baseB = new Base({ x: baseImage.width })
    game.baseC = new Base({ x: baseImage.width * 2 })
}

// menu
let inMenu = true
function menu() {
    if (!inMenu) return

    window.requestAnimationFrame(menu)

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // draw background
    ctx.drawImage(backgroundSprite, 0, 0, canvas.height/(backgroundSprite.height / backgroundSprite.width), canvas.height)

    player.menuAnim()

    updateBases()
}
menu()

function start() {
    game.started = true // reset
    game.paused = false
    game.spawnStart = null
    game.pauseStart = 0
    game.pauseDuration = 0
    game.spawnCD = 2000
    game.spawnCDInit = 2000
    game.obstacles = []
    game.obstacleCount = 0 // reset
    game.obstacleGap = 300
    game.coinChance = 0.1
    game.moveObsChance = 0
    game.gameEnded = false
    game.lvlDisplayed = false
    game.obstaclePerLvl = 25 // reset
    game.wastedLife = false
    game.triggeredLife = false

    player.x = 300
    player.y = canvas.height/4

    player.vx = 0
    player.vy = 0

    inMenu = false

    document.getElementById('distance-display').style.visibility = 'visible'
    document.getElementById('distance-display').textContent = game.playerDist

    changeLevel()
    gameLoop()
}
// start()


// store
const skinItems = [
    {name: 'Green Pipes', price: 'Owned', img: './assets/images/pipe-green-skin.png', prompt: 'Equipped'},
    {name: 'Red Pipes', price: '500 Coins', img: './assets/images/pipe-red-skin.png', prompt: 'Buy'},
    {name: 'Daytime', price: 'Owned', img: './assets/images/background-day-skin.png', prompt: 'Equipped'},
    {name: 'Nighttime', price: '500 Coins', img: './assets/images/background-night-skin.png', prompt: 'Buy'},
    {name: 'Yellow Bird', price: 'Owned', img: './assets/images/yellowbird-skin.png', prompt: 'Equipped'},
    {name: 'Red Bird', price: '200 Coins', img: './assets/images/redbird-skin.png', prompt: 'Buy'},
    {name: 'Blue Bird', price: '1000 Coins', img: './assets/images/bluebird-skin.png', prompt: 'Buy'},
]

const skinContainer = document.getElementById('skins')

skinItems.forEach((item, index) => {
    const itemDiv = document.createElement('div')
    itemDiv.classList.add('skin-item')

    itemDiv.innerHTML = `
        <img src='${item.img}' alt='${item.name}'>
        <h3>${item.name}</h3>
        <p class="skin-price">${item.price}</p>
        <button class="skin-btn" data-index="${index}">${item.prompt}</button>
    `

    skinContainer.appendChild(itemDiv)
})