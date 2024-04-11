let typeLock = true
const enemy1 = document.getElementById('enemy1')
const enemy2 = document.getElementById('enemy2')
const enemy3 = document.getElementById('enemy3')
const enemy4 = document.getElementById('enemy4')
const text1 = document.getElementById('text1')
const text2 = document.getElementById('text2')
const text3 = document.getElementById('text3')
const text4 = document.getElementById('text4')
const waveAnnouncer = document.getElementById('wave-announcer')
const waveTitle = document.getElementById('wave-title')
const waveComment = document.getElementById('wave-comment')
const peaceTimer = document.getElementById('peace-timer')
const menuMusic = new Audio('assets/sounds/menu.mp3')
const peaceMusic = new Audio('assets/sounds/peace-time.mp3')
const warMusic = new Audio('assets/sounds/war.mp3')
const upgrade = new Audio('assets/sounds/upgrade.mp3')
const denied = new Audio('assets/sounds/denied.mp3')
const horn = new Audio('assets/sounds/horn.mp3')

// handle all the game events
const gameInfo = {
    wave: 1,
    frequency: 0,
    enemyCounter: 0,
    enemySpeed: 1,
    speedMod: 1,
    speedModCounter: 0,
    enemyCD: 0,
    points: 0,
    health: 100,
    maxHealth: 100,
    maxHealthCounter: 0,
    spawning: false,
    enemy1Killed: false,
    enemy2Killed: false,
    enemy3Killed: false,
    enemy4Killed: false,
}

// reset enemy
function resetPos(a) {
    a.style.transition = '0ms'
    a.style.transform = 'translate(-50%, -50%)'
}

const blackOverlay = document.getElementById('black-overlay')
// screen changing
document.getElementById('start-overlay').onclick = () => {
    blackOverlay.style.visibility = 'visible'
    blackOverlay.style.animation = 'fadeToBlack 2000ms ease-in-out'
        
    // bg music
    menuMusic.play()
    menuMusic.loop = true

    setTimeout(() => {
        document.getElementById('start-overlay').style.visibility = 'hidden'
        setTimeout(() => {
            blackOverlay.style.animation = ''
            blackOverlay.style.visibility = 'hidden'
        }, 950)
    }, 1000)
}

document.getElementById('start-button').onclick = () => {
    select()
    blackOverlay.style.visibility = 'visible'
    blackOverlay.style.animation = 'fadeToBlack 2000ms ease-in-out'
    setTimeout(() => {
        document.getElementById('menu').style.visibility = 'hidden'
        document.getElementById('game').style.visibility = 'visible'
        document.getElementById('background-alt').style.visibility = 'visible'

        function lowerVolume() {
            if (menuMusic.volume <= 0.1) {
                // volume already 0
                menuMusic.pause()
                menuMusic.currentTime = 0
            } 
            else {
                menuMusic.volume -= 0.1
                setTimeout(lowerVolume, 50)
            }
        }
        lowerVolume()

        setTimeout(() => {
            blackOverlay.style.animation = ''
            blackOverlay.style.visibility = 'hidden'
        }, 950)
    }, 1000)

    setTimeout(() => {
        gameHandler()
        typeLock = false
    }, 2500);

}
document.getElementById('start-button').onmouseover = () => {
    hover()
    document.getElementById('start-button').textContent = '> START'
}
document.getElementById('start-button').onmouseout = () => {
    document.getElementById('start-button').textContent = 'START'
}

const helpBtn = document.getElementById('help-button')
let helpMenuOpen = false
helpBtn.onmouseover = () => {
    hover()
    if (!helpMenuOpen) {
        helpBtn.textContent = '> HOW TO PLAY'
    }
    else {
        helpBtn.textContent = '> CLOSE'
    }
}
helpBtn.onmouseout = () => {
    if (!helpMenuOpen) {
        helpBtn.textContent = 'HOW TO PLAY'
    }
    else {
        helpBtn.textContent = '< CLOSE'
    }
}
helpBtn.onclick = () => {
    select()
    if (!helpMenuOpen) {
        document.getElementById('help').style.visibility = 'visible'
        document.getElementById('help').style.opacity = 1
        helpBtn.textContent = '< CLOSE'
        helpMenuOpen = true
    }
    else {
        document.getElementById('help').style.opacity = 0
        document.getElementById('help').style.visibility = 'hidden'
        helpBtn.textContent = 'HOW TO PLAY'
        helpMenuOpen = false
    }
}


// typing
window.addEventListener('keydown', (event) => {
    if (typeLock == false){
        const input = document.getElementById('input')
    
        if (event.key == 'Enter') {
            let index
            if(text1.textContent.toUpperCase() == input.textContent.toUpperCase() && text1.textContent != ''){
                gameInfo.enemy1Killed = true

                // reset postion of enemy
                enemy1.style.transition = '0ms'
                enemy1.style.transform = 'translate(-50%, -50%)'
                text1.textContent = ''
                document.getElementById('img1').style.height = '75%'
                document.getElementById('img1').style.transform = 'scaleX(-1)'
    
                // update pointage
                gameInfo.points += Math.ceil((Math.random()*5)+10)

                index = takenLanes.indexOf(1)
                takenLanes.splice(index, 1)
                gameInfo.enemyCounter--

                // spawn new enemy
                setTimeout(() => {

                    spawnEnemy()

                }, (Math.random() + gameInfo.enemyCD) * 1000)
            }
            else if(text2.textContent.toUpperCase() == input.textContent.toUpperCase() && text2.textContent != ''){
                gameInfo.enemy2Killed = true

                enemy2.style.transition = 0 + 'ms'
                enemy2.style.transform = 'translate(-50%, -50%)'
                text2.textContent = ''
                document.getElementById('img2').style.height = '75%'
                document.getElementById('img2').style.transform = 'scaleX(-1)'
    
                gameInfo.points += Math.ceil((Math.random()*5)+10)

                index = takenLanes.indexOf(2)
                takenLanes.splice(index, 1)
                gameInfo.enemyCounter--

                setTimeout(() => {

                    spawnEnemy()

                }, (Math.random() + gameInfo.enemyCD) * 1000)
            }
            else if(text3.textContent.toUpperCase() == input.textContent.toUpperCase() && text3.textContent != ''){
                gameInfo.enemy3Killed = true

                enemy3.style.transition = 0 + 'ms'
                enemy3.style.transform = 'translate(-50%, -50%)'
                text3.textContent = ''
                document.getElementById('img3').style.height = '75%'
                document.getElementById('img3').style.transform = 'scaleX(-1)'
    
                gameInfo.points += Math.ceil((Math.random()*5)+10)

                index = takenLanes.indexOf(3)
                takenLanes.splice(index, 1)
                gameInfo.enemyCounter--

                setTimeout(() => {

                    spawnEnemy()

                }, (Math.random() + gameInfo.enemyCD) * 1000)
            }
            else if(text4.textContent.toUpperCase() == input.textContent.toUpperCase() && text4.textContent != ''){
                gameInfo.enemy4Killed = true

                enemy4.style.transition = 0 + 'ms'
                enemy4.style.transform = 'translate(-50%, -50%)'
                text4.textContent = ''
                document.getElementById('img4').style.height = '75%'
                document.getElementById('img4').style.transform = 'scaleX(-1)'
    
                gameInfo.points += Math.ceil((Math.random()*5)+10)

                index = takenLanes.indexOf(4)
                takenLanes.splice(index, 1)
                gameInfo.enemyCounter--

                setTimeout(() => {
                    spawnEnemy()

                }, (Math.random() + gameInfo.enemyCD) * 1000)
            }
            input.textContent = ''
            document.getElementById('points').textContent = `${gameInfo.points}`
            
        }
        if (event.key == 'Backspace') {
            const content = input.textContent
            input.textContent = content.substring(0, content.length - 1)
        }
        if (/^Key[A-Z]$/.test(event.code)) {
            input.textContent += event.key
        }

        // change the scroll background to fit the input
        let pixels = getComputedStyle(input).getPropertyValue('width')
        let pixelsNb = pixels.replace('px', '')
        let width = getComputedStyle(document.getElementById('typing')).getPropertyValue('width')
        let widthNb = width.replace('px', '')

        let percentage = ((pixelsNb / widthNb) * 100) + 5
        document.getElementById('input3').style.width = `${percentage}%`
    }
})

// determine how the game size should be like (depending on the window size)
window.addEventListener(onload, checkresize())
$(window).resize(function() {checkresize()})

function checkresize() {
    let width = window.innerWidth
    let height = window.innerHeight
    const game = document.getElementById('game')
    if (width*9 > height*16) {
        game.style.height = 95 + 'vh'
        game.style.width = 95*16/9 + 'vh' 
    }
    else {
        game.style.height = 95*9/16 + 'vw' 
        game.style.width = 95 + 'vw'
    }
}

console.log(gameInfo)

function gameHandler() {

    if (gameInfo.wave == 1) {
        gameInfo.frequency = 7
        gameInfo.enemyCD = 3
        gameInfo.enemySpeed = 1
        waveTitle.textContent = 'Wave 1'
        waveComment.textContent = '<Prologue>'
        waveComment.style.color = 'black'
    }
    else if (gameInfo.wave == 2) {
        gameInfo.frequency = 10
        gameInfo.enemyCD = 2.5
        gameInfo.enemySpeed = 1.05
        waveTitle.textContent = 'Wave 2'
        waveComment.textContent = '<Buildup>'
    }
    else if (gameInfo.wave == 3) {
        gameInfo.frequency = 15
        gameInfo.enemyCD = 2
        gameInfo.enemySpeed = 1.1
        waveTitle.textContent = 'Wave 3'
        waveComment.textContent = '<Prelude>'
    }
    else if (gameInfo.wave == 4) {
        gameInfo.frequency = 20
        gameInfo.enemyCD = 2
        gameInfo.enemySpeed = 1.2
        waveTitle.textContent = 'Wave 4'
        waveComment.textContent = '<Encounter>'
    }
    else if (gameInfo.wave == 5) {
        gameInfo.frequency = 20
        gameInfo.enemyCD = 2
        gameInfo.enemySpeed = 1.2
        waveTitle.textContent = 'Wave 5'
        waveComment.textContent = '<Showdown>'
        waveComment.style.color = 'brown'
    }

    // announce the wave number
    waveAnnouncer.style.opacity = 1
    horn.play()
    horn.volume = 0.7

    setTimeout(() => {
        waveAnnouncer.style.animation = 'fadeOut 3000ms linear forwards'
        waveAnnouncer.addEventListener('animationend', () => {
            waveAnnouncer.style.animation = ''
            waveAnnouncer.style.opacity = 0
        })
    }, 1000)

    setTimeout(() => {
        spawnEnemy()
        checkNoEnemy()

        warMusic.play()
        warMusic.volume = 1
        warMusic.loop = true

    }, 3000)
}


// choose the lanes for the enemies
let takenLanes = []
function chooseLane() {
    let lane = Math.ceil(Math.random() * 4)
    let laneCondition = takenLanes.includes(lane)
    console.log(`lane: ${lane}, taken lanes: ${takenLanes}, lane condition: ${laneCondition}`)

    // checking if the lane isn't already taken (to avoid complications)
    if (laneCondition) {
        console.log('lane unavailable')
        if (takenLanes.length < 4) {
            // recursive function :O
            return chooseLane()
        }
        // the four lanes are taken; we stop spawning (temporarily)
        else {
            console.log('all lanes chosen, stop spawning')
            return false
        }
    }
    // chosen lane is available
    else {
        console.log("lane available, choosing...")
        takenLanes.push(lane)
        return lane
    }
}

// spawn the enemies depending on the wave
function spawnEnemy() {
    // check if it's currently spawning to prevent spwning multiple enmies in quick succesion
    if (!gameInfo.spawning) {
        function spawn() {
            gameInfo.spawning = true
            
            if (gameInfo.frequency != 0 && gameInfo.enemyCounter != 4) {
                
                // adding the image
                const files = ['chort_run', 'goblin_run', 'ice_zombie', 'imp_run', 'lizard_f_run', 'lizard_m_run', 'masked_orc', 'muddy', 'necromancer', 'orc_shaman_run', 'orc_warrior_run', 'pumpkin_dude_run', 'skelet_run', 'slug', 'swampy', 'wogol_run', 'zombie']
                const randomIndex = Math.floor(Math.random() * files.length)
                const randomFile = files[randomIndex]

                // boss
                const bossFiles = ['big_demon_run', 'big_zombie_run', 'ogre_run']
                const randomBossIndex = Math.floor(Math.random() * bossFiles.length)
                const randomBossFile = bossFiles[randomBossIndex]

                let randomLane = chooseLane()
                if (randomLane !== false) {
                    // spawn bosses
                    if ((gameInfo.wave == 4 && gameInfo.frequency == 1) || (gameInfo.wave == 5 && gameInfo.frequency <= 3)) {
                        document.getElementById('img' + randomLane).src = `assets/images/enemies/boss/${randomBossFile}.gif`
                        document.getElementById('img' + randomLane).style.height = '100%'
                        document.getElementById('img' + randomLane).style.transform = 'translateY(-25%) scaleX(-1)'
                        moveBossEnemy(randomLane)
                        setBossText(randomLane)
                    }
                    
                    // spawn normal enemies
                    else {
                        document.getElementById('img' + randomLane).src = `assets/images/enemies/common/${randomFile}.gif`
                        moveEnemy(randomLane, gameInfo.enemySpeed)
                        setText(randomLane)
                    }
                    
                    gameInfo.frequency--
                    console.log(`enemies left to spawn: ${gameInfo.frequency}`)
                    gameInfo.enemyCounter++

                    if (randomLane == 1) {
                        gameInfo.enemy1Killed = false
                    }
                    if (randomLane == 2) {
                        gameInfo.enemy2Killed = false
                    }
                    if (randomLane == 3) {
                        gameInfo.enemy3Killed = false
                    }
                    if (randomLane == 4) {
                        gameInfo.enemy4Killed = false
                    }
                }

                // wait for the enemy cooldown to finish
                setTimeout(() => {
                    spawnEnemy()
                }, (Math.random()*gameInfo.enemyCD*500)+3000)
                
            }
        }

        spawn()
        gameInfo.spawning = false
    }
}

// check if the wave should end or not
function checkNoEnemy() {
    if (gameInfo.frequency == 0 && gameInfo.enemyCounter == 0){
        console.log('wave end')
        waveEnd()
    }
    else {
        setTimeout(() => {
            checkNoEnemy()
        }, 10)
    }
}

// set a random text
function setText(randomLane) {
    let randomIndex = Math.floor(Math.random() * words.length)
    let selectedWord = words[randomIndex]
    document.getElementById('text' + randomLane).textContent = selectedWord
}


// move the enemies from right to left
function moveEnemy(randomLane, enemySpeed) {
    currentEnemy = document.getElementById('enemy' + randomLane)
    let speed = (((Math.random() * 6000) + 6000) / enemySpeed) * gameInfo.speedMod
    console.log(`enemy speed: ${speed}`)
    currentEnemy.style.transition = `${speed}ms linear`
    currentEnemy.style.transform = 'translate(-925%, -50%)'
}

// boss handling (same as above, but tweaked a bit)
function setBossText(randomLane) {
    let randomIndex = Math.floor(Math.random() * longWords.length)
    let selectedWord = longWords[randomIndex]
    document.getElementById('text' + randomLane).textContent = selectedWord
}

function moveBossEnemy(randomLane) {
    currentEnemy = document.getElementById('enemy' + randomLane)
    let speed = ((Math.random() * 2000) + 15000) * gameInfo.speedMod
    console.log(`enemy speed: ${speed}`)
    currentEnemy.style.transition = `${speed}ms linear`
    currentEnemy.style.transform = 'translate(-900%, -50%)'
}

// check if enemies have reached the castle
enemy1.addEventListener('transitionend', () => {
    // reset position of enemy
    if (!gameInfo.enemy1Killed) {
        console.log('enemy 1 reached')
        enemy1.style.transition = '0ms'
        enemy1.style.transform = 'translate(-50%, -50%)'
        document.getElementById('img1').style.height = '75%'
        document.getElementById('img1').style.transform = 'scaleX(-1)'

        index = takenLanes.indexOf(1)
        takenLanes.splice(index, 1)
        gameInfo.enemyCounter--
        gameInfo.enemy1Killed = true

        // check if the enemy is a boss
        if (text1.textContent.length > 7) {
            gameInfo.health -= 30
        }
        else {
            gameInfo.health -= Math.ceil(5 + (Math.random()*5)) // remove a random amount of health
        }
        if (gameInfo.health <= 0) {
            endGame('loss')
        }
        document.getElementById('health').textContent = `${gameInfo.health}/${gameInfo.maxHealth}`
        text1.textContent = ''

        // respawn the enemy with a slight delay (so that the player doesn't get overwhelmed)
        setTimeout(() => {
            spawnEnemy()
        }, 2000)
    }
})
enemy2.addEventListener('transitionend', () => {
    // reset position of enemy
    if (!gameInfo.enemy2Killed) {
        enemy2.style.transition = '0ms'
        enemy2.style.transform = 'translate(-50%, -50%)'
        document.getElementById('img2').style.height = '75%'
        document.getElementById('img2').style.transform = 'scaleX(-1)'

        index = takenLanes.indexOf(2)
        takenLanes.splice(index, 1)
        gameInfo.enemyCounter--
        gameInfo.enemy2Killed = true

        if (text2.textContent.length > 7) {
            gameInfo.health -= 30
        }
        else {
            gameInfo.health -= Math.ceil(5 + (Math.random()*5)) // remove a random amount of health
        }
        if (gameInfo.health <= 0) {
            endGame('loss')
        }
        document.getElementById('health').textContent = `${gameInfo.health}/${gameInfo.maxHealth}`
        text2.textContent = ''

        setTimeout(() => {
            spawnEnemy()
        }, 2000)
    }
})
enemy3.addEventListener('transitionend', () => {
    // reset position of enemy
    if (!gameInfo.enemy3Killed) {
        enemy3.style.transition = '0ms'
        enemy3.style.transform = 'translate(-50%, -50%)'
        document.getElementById('img3').style.height = '75%'
        document.getElementById('img3').style.transform = 'scaleX(-1)'

        index = takenLanes.indexOf(3)
        takenLanes.splice(index, 1)
        gameInfo.enemyCounter--
        gameInfo.enemy3Killed = true
        
        if (text3.textContent.length > 7) {
            gameInfo.health -= 30
        }
        else {
            gameInfo.health -= Math.ceil(5 + (Math.random()*5)) // remove a random amount of health
        }
        if (gameInfo.health <= 0) {
            endGame('loss')
        }
        document.getElementById('health').textContent = `${gameInfo.health}/${gameInfo.maxHealth}`
        text3.textContent = ''

        setTimeout(() => {
            spawnEnemy()
        }, 2000)
    }
})
enemy4.addEventListener('transitionend', () => {
    // reset position of enemy
    if (!gameInfo.enemy4Killed) {
        enemy4.style.transition = '0ms'
        enemy4.style.transform = 'translate(-50%, -50%)'
        document.getElementById('img4').style.height = '75%'
        document.getElementById('img4').style.transform = 'scaleX(-1)'

        index = takenLanes.indexOf(4)
        takenLanes.splice(index, 1)
        gameInfo.enemyCounter--
        gameInfo.enemy4Killed = true
        
        if (text4.textContent.length > 7) {
            gameInfo.health -= 30
        }
        else {
            gameInfo.health -= Math.ceil(5 + (Math.random()*5)) // remove a random amount of health
        }
        if (gameInfo.health <= 0) {
            endGame('loss')
        }
        document.getElementById('health').textContent = `${gameInfo.health}/${gameInfo.maxHealth}`
        text4.textContent = ''

        setTimeout(() => {
            spawnEnemy()
        }, 2000)
    }
})

const shop = document.getElementById('shop')
const next = document.getElementById('next-btn')

// wave ends
function waveEnd() {
    setTimeout(() => {
        // check if the game isn't finished
        if (gameInfo.wave != 5) {
            waveTitle.textContent = 'Wave End'
            waveComment.textContent = '<Respite>'
            waveAnnouncer.style.opacity = 1

            // music
            peaceMusic.play()
            peaceMusic.volume = 1
            peaceMusic.loop = true
            
            function lowerVolume() {
                if (warMusic.volume <= 0.1) {
                    // volume already 0
                    warMusic.pause()
                    warMusic.currentTime = 0
                } 
                else {
                    warMusic.volume -= 0.1
                    setTimeout(lowerVolume, 50)
                }
            }
            lowerVolume()

            // animations
            setTimeout(() => {
                waveAnnouncer.style.animation = 'fadeOut 3000ms linear forwards'
                waveAnnouncer.addEventListener('animationend', () => {
                    waveAnnouncer.style.animation = ''
                    waveAnnouncer.style.opacity = 0
                })
                    
                // show the shop and the next button
                setTimeout(() => {
                    shop.style.opacity = 0
                    next.style.opacity = 0
                    shop.style.visibility = 'visible'
                    next.style.visibility = 'visible'
                    shop.style.animation = 'fadeIn 1000ms linear forwards'
                    next.style.animation = 'fadeIn 1000ms linear forwards'
                    shop.addEventListener('animationend', () => {
                        shop.style.opacity = 1
                        shop.style.visibility = 'visible'
                    })
                    next.addEventListener('animationend', () => {
                        next.style.opacity = 1
                        next.style.visibility = 'visible'
                    })
                }, 1200);
            }, 1000)
            peaceTimer.style.opacity = 1

            next.onclick = () => {

                select()

                setTimeout(() => {
                    peaceCountdown()
                }, 1000)
                
                // fade out shop and the next button
                shop.style.animation = 'fadeOut 1000ms linear forwards'
                next.style.animation = 'fadeOut 1000ms linear forwards'
                shop.addEventListener('animationend', () => {
                    shop.style.animation = ''
                    shop.style.visibility = 'hidden'
                })
                next.addEventListener('animationend', () => {
                    next.style.animation = ''
                    next.style.visibility = 'hidden'
                })

                // lower volume
                function lowerVolume() {
                    if (peaceMusic.volume <= 0.1) {
                        // volume already 0
                        peaceMusic.pause()
                        peaceMusic.currentTime = 0
                    } 
                    else {
                        peaceMusic.volume -= 0.1
                        setTimeout(lowerVolume, 50)
                    }
                }
                lowerVolume()


            }


            // countdown till next wave
            let timer = 3
            function peaceCountdown() {
                peaceTimer.textContent = `Next wave in: ${timer}`
                if (timer > 0) {
                    setTimeout(() => {
                        timer--
                        peaceCountdown() // recursuve function
                    }, 1000)
                    if (timer <= 5) {
                        tick()
                    }
                }
                else {
                    tick()

                    peaceTimer.style.animation = 'fadeOut 1000ms linear forwards'
                    peaceTimer.addEventListener('animationend', () => {
                        peaceTimer.style.animation = ''
                        peaceTimer.style.opacity = 0

                        // next wave
                        gameInfo.wave += 1
                        document.getElementById('wave-text').textContent = `Wave ${gameInfo.wave}`
                        gameHandler()
                    })
                }
            }
        }

        // end the game: player wins!
        else {
            endGame('win')
        }
    }, 500);
}

// hover effect for next wave button
next.onmouseover = () => {
    hover()
    next.textContent = '> Next Wave'
}
next.onmouseout = () => {
    next.textContent = 'Next Wave'
}

// upgrades you can have
const pointsText = document.getElementById('points')

// health upgrade
document.getElementById('health-up-img').onclick = () => {
    if (gameInfo.points >= 60 && gameInfo.maxHealthCounter < 3) {

        upgrade.play()

        gameInfo.maxHealth += 30
        gameInfo.health += 30
        document.getElementById('health').textContent = `${gameInfo.health}/${gameInfo.maxHealth}`
        gameInfo.maxHealthCounter++
        document.getElementById('health-up-status').textContent = `Bought: ${gameInfo.maxHealthCounter} (max 3)`
        gameInfo.points -= 50
        pointsText.textContent = `${gameInfo.points}`
    }
    else if (gameInfo.points < 60) {

        denied.play()

        console.log('not enough!')
        pointsText.style.animation = 'red 500ms linear'
        points.addEventListener('animationend', () => {
            pointsText.style.animation = ''
        })
    }
    else if (gameInfo.maxHealthCounter >= 3) {

        denied.play()

        document.getElementById('health-up-status').style.animation = 'red 500ms linear'
        document.getElementById('health-up-status').addEventListener('animationend', () => {
            document.getElementById('health-up-status').style.animation = ''
        })
    }
}
document.getElementById('health-up-img').onmousedown = () => {
    document.getElementById('health-up-img').style.scale = 0.9
}
document.getElementById('health-up-img').onmouseup = () => {
    document.getElementById('health-up-img').style.scale = 1
}

// heal
document.getElementById('repair-up-img').onclick = () => {
    if (gameInfo.points >= 40 && gameInfo.health < gameInfo.maxHealth) {

        upgrade.play()

        gameInfo.health += 20
        gameInfo.points -= 40
        pointsText.textContent = `${gameInfo.points}`
        if (gameInfo.health >= gameInfo.maxHealth) {
            gameInfo.health = gameInfo.maxHealth
        }
        document.getElementById('health').textContent = `${gameInfo.health}/${gameInfo.maxHealth}`
    }
    else if (gameInfo.points < 40) {

        denied.play()

        console.log('not enough!')
        pointsText.style.animation = 'red 500ms linear'
        points.addEventListener('animationend', () => {
            pointsText.style.animation = ''
        })
    }
}
document.getElementById('repair-up-img').onmousedown = () => {
    document.getElementById('repair-up-img').style.scale = 0.9
}
document.getElementById('repair-up-img').onmouseup = () => {
    document.getElementById('repair-up-img').style.scale = 1
}

// enemy speed
document.getElementById('speed-up-img').onclick = () => {
    if (gameInfo.points >= 50 && gameInfo.speedModCounter < 5) {

        upgrade.play()

        gameInfo.speedMod += 0.1
        gameInfo.points -= 50
        pointsText.textContent = `${gameInfo.points}`
        gameInfo.speedModCounter++
        document.getElementById('speed-up-status').textContent = `Bought: ${gameInfo.speedModCounter} (max 5)`
    }
    else if (gameInfo.points < 50) {

        denied.play()

        console.log('not enough!')
        pointsText.style.animation = 'red 500ms linear'
        points.addEventListener('animationend', () => {
            pointsText.style.animation = ''
        })
    }
    else if (gameInfo.speedModCounter >= 5) {

        denied.play()

        document.getElementById('speed-up-status').style.animation = 'red 500ms linear'
        document.getElementById('speed-up-status').addEventListener('animationend', () => {
            document.getElementById('speed-up-status').style.animation = ''
        })
    }
}
document.getElementById('speed-up-img').onmousedown = () => {
    document.getElementById('speed-up-img').style.scale = 0.9
}
document.getElementById('speed-up-img').onmouseup = () => {
    document.getElementById('speed-up-img').style.scale = 1
}

const endMusic = new Audio('assets/sounds/end.mp3')
// end the game
function endGame(event) {
    
    function lowerVolume() {
        if (warMusic.volume <= 0.1) {
            // volume already 0
            warMusic.pause()
            warMusic.currentTime = 0
        } 
        else {
            warMusic.volume -= 0.1
            setTimeout(lowerVolume, 50)
        }
    }
    lowerVolume()

    

    if (event == 'loss') {
        document.getElementById('status').textContent = 'Defeat'
        document.getElementById('end-desc').textContent = 'The castle has fallen...'
        document.getElementById('end-title').textContent = 'Better luck next time'
    }
    blackOverlay.style.visibility = 'visible'
    blackOverlay.style.animation = 'fadeToBlack 2000ms ease-in-out'
    setTimeout(() => {
        document.getElementById('game').style.display = 'none'
        document.getElementById('background-alt').style.visibility = 'hidden'
        document.getElementById('end').style.visibility = 'visible'

        endMusic.play()
        endMusic.volume = 0.7

        setTimeout(() => {
            blackOverlay.style.animation = ''
            blackOverlay.style.visibility = 'hidden'
        }, 950)
    }, 1000)
}

// retry button
const retry = document.getElementById('retry')

retry.onmouseover = () => {
    hover()
    retry.textContent = '> Retry'
}
retry.onmouseout = () => {
    retry.textContent = 'Retry'
}
retry.onclick = () => {
    select()
    location.reload()
}


// sound effects
function hover(){
    const sfx = new Audio('assets/sounds/hover.mp3')
    sfx.play()
}

function select(){
    const sfx = new Audio('assets/sounds/select.mp3')
    sfx.play()
}

function tick(){
    const sfx = new Audio('assets/sounds/tick.mp3')
    sfx.play()
}
