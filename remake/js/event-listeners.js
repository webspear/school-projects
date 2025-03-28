window.addEventListener('resize', () => {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    game.bases.forEach((e) => {
        e.y = canvas.height - e.sprite.height + 100
    })
})

// jump
window.addEventListener('keydown', () => {
    switch(event.code) {
        case 'Space':
            if (!inMenu) {
                player.vy = -12
                player.rotation = player.minRotation
                wing.currentTime = 0
                wing.play()
            }
            break
    }
})
window.addEventListener('click', () => {
    if (!inMenu) {
        player.vy = -12
        player.rotation = player.minRotation
        wing.currentTime = 0
        wing.play()
    }
})

// pause
window.addEventListener('keydown', (event) => {
    if (event.repeat) return
    switch(event.code) {
        case 'Escape':
            if (game.started) {
                if (game.paused) {
                    game.paused = false
                    document.getElementById('pause-menu').style.visibility = 'hidden'

                    game.pauseDuration = performance.now() - game.pauseStart
                    game.spawnStart += game.pauseDuration
                }
                else {
                    game.paused = true
                    document.getElementById('pause-menu').style.visibility = 'visible'

                    game.pauseStart = performance.now()
                }
            }
            break
    }
})

// button clicks
document.getElementById('start-overlay').onclick = () => {
    document.getElementById('start-overlay').style.visibility = 'hidden'
    swoosh.currentTime = 0
    swoosh.play()
    music.play()
}
document.getElementById('end-btn-1').onclick = () => {
    start()
    document.getElementById('end').style.transition = '0ms'
    document.getElementById('end-exp-bar').style.transition = '0ms'
    document.getElementById('end').style.visibility = 'hidden'
    document.getElementById('end').style.top = '60%'
    document.getElementById('end').style.opacity = '0'
    document.getElementById('end-exp-skill').style.visibility = 'hidden'
    document.getElementById('end-btn-1').style.visibility = 'hidden'
    document.getElementById('end-btn-2').style.visibility = 'hidden'

    swoosh.currentTime = 0
    swoosh.play()
}
document.getElementById('end-btn-2').onclick = () => {
    document.getElementById('end').style.transition = '0ms'
    document.getElementById('end-exp-bar').style.transition = '0ms'
    document.getElementById('end').style.visibility = 'hidden'
    document.getElementById('end').style.top = '60%'
    document.getElementById('end').style.opacity = '0'
    document.getElementById('end-exp-skill').style.visibility = 'hidden'
    document.getElementById('end-btn-1').style.visibility = 'hidden'
    document.getElementById('end-btn-2').style.visibility = 'hidden'
    document.getElementById('distance-display').style.visibility = 'hidden'
    document.getElementById('menu').style.left = '60%'
    document.getElementById('menu').style.opacity = '1'
    document.getElementById('menu').style.visibility = 'visible'

    inMenu = true
    player.rotation = 0
    player.currentFrame = 1
    menu()

    swoosh.currentTime = 0
    swoosh.play()
}
document.getElementById('skin-select').onclick = () => {
    document.getElementById('skins').style.visibility = 'visible'
    document.getElementById('skills').style.visibility = 'hidden'
    document.getElementById('skin-select').style.borderBottom = 'none'
    document.getElementById('skill-select').style.borderBottom = 'black solid 3px'

    swoosh.currentTime = 0
    swoosh.play()
}
document.getElementById('skill-select').onclick = () => {
    document.getElementById('skins').style.visibility = 'hidden'
    document.getElementById('skills').style.visibility = 'visible'
    document.getElementById('skin-select').style.borderBottom = 'black solid 3px'
    document.getElementById('skill-select').style.borderBottom = 'none'

    swoosh.currentTime = 0
    swoosh.play()
}
document.getElementById('play-btn').onclick = () => {
    document.getElementById('levels').style.left = '60%'
    document.getElementById('levels').style.opacity = '1'
    document.getElementById('levels').style.visibility = 'visible'
    document.getElementById('menu').style.left = '100%'
    document.getElementById('menu').style.opacity = '0'
    setTimeout(() => {
        document.getElementById('menu').style.visibility = 'hidden'
    }, 350)

    if (game.playerUnlock >= 2) {
        document.getElementById('lvl-2').style.color = 'black'
    }
    if (game.playerUnlock >= 3) {
        document.getElementById('lvl-3').style.color = 'black'
    }
    if (game.playerUnlock >= 4) {
        document.getElementById('lvl-4').style.color = 'black'
    }

    swoosh.currentTime = 0
    swoosh.play()
}
document.getElementById('lvl-back').onclick = () => {
    document.getElementById('menu').style.left = '60%'
    document.getElementById('menu').style.opacity = '1'
    document.getElementById('menu').style.visibility = 'visible'
    document.getElementById('levels').style.left = '100%'
    document.getElementById('levels').style.opacity = '0'
    setTimeout(() => {
        document.getElementById('levels').style.visibility = 'hidden'
    }, 350)

    swoosh.currentTime = 0
    swoosh.play()
}
document.getElementById('options-btn').onclick = () => {
    document.getElementById('options').style.left = '65%'
    document.getElementById('options').style.opacity = '1'
    document.getElementById('options').style.visibility = 'visible'
    document.getElementById('menu').style.left = '100%'
    document.getElementById('menu').style.opacity = '0'
    setTimeout(() => {
        document.getElementById('menu').style.visibility = 'hidden'
    }, 350)

    swoosh.currentTime = 0
    swoosh.play()
}
document.getElementById('options-back').onclick = () => {
    document.getElementById('menu').style.left = '60%'
    document.getElementById('menu').style.opacity = '1'
    document.getElementById('menu').style.visibility = 'visible'
    document.getElementById('options').style.left = '100%'
    document.getElementById('options').style.opacity = '0'
    setTimeout(() => {
        document.getElementById('options').style.visibility = 'hidden'
    }, 350)

    swoosh.currentTime = 0
    swoosh.play()
}
document.getElementById('info-btn').onclick = () => {
    document.getElementById('info').style.left = '60%'
    document.getElementById('info').style.opacity = '1'
    document.getElementById('info').style.visibility = 'visible'
    document.getElementById('menu').style.left = '100%'
    document.getElementById('menu').style.opacity = '0'
    setTimeout(() => {
        document.getElementById('menu').style.visibility = 'hidden'
    }, 350)

    swoosh.currentTime = 0
    swoosh.play()
}
document.getElementById('info-back').onclick = () => {
    document.getElementById('menu').style.left = '60%'
    document.getElementById('menu').style.opacity = '1'
    document.getElementById('menu').style.visibility = 'visible'
    document.getElementById('info').style.left = '100%'
    document.getElementById('info').style.opacity = '0'
    setTimeout(() => {
        document.getElementById('info').style.visibility = 'hidden'
    }, 350)

    swoosh.currentTime = 0
    swoosh.play()
}
document.getElementById('store-btn').onclick = () => {
    document.getElementById('store').style.left = '65%'
    document.getElementById('store').style.opacity = '1'
    document.getElementById('store').style.visibility = 'visible'
    document.getElementById('skins').style.visibility = 'visible'
    document.getElementById('menu').style.left = '100%'
    document.getElementById('menu').style.opacity = '0'
    document.getElementById('skin-select').style.borderBottom = 'none'
    document.getElementById('skill-select').style.borderBottom = 'black solid 3px'
    setTimeout(() => {
        document.getElementById('menu').style.visibility = 'hidden'
    }, 350)

    document.getElementById('currency-coin').textContent = 'Coins: ' + game.playerTotalCoins
    document.getElementById('currency-skill').textContent = 'Skill Points: ' + game.playerPoint

    swoosh.currentTime = 0
    swoosh.play()
}
document.getElementById('store-back').onclick = () => {
    document.getElementById('store').style.left = '100%'
    document.getElementById('store').style.opacity = '0'
    document.getElementById('menu').style.visibility = 'visible'
    document.getElementById('menu').style.left = '60%'
    document.getElementById('menu').style.opacity = '1'
    setTimeout(() => {
        document.getElementById('store').style.visibility = 'hidden'
        document.getElementById('skins').style.visibility = 'hidden'
        document.getElementById('skills').style.visibility = 'hidden'
    }, 350)

    swoosh.currentTime = 0
    swoosh.play()
}

// level selecting
document.getElementById('lvl-1').onclick = () => {
    game.gameLevelInit = 1
    game.gameLevel = 1
    start()

    document.getElementById('levels').style.left = '100%'
    document.getElementById('levels').style.opacity = '0'
    setTimeout(() => {
        document.getElementById('levels').style.visibility = 'hidden'
    }, 350)

    swoosh.currentTime = 0
    swoosh.play()
}
document.getElementById('lvl-2').onclick = () => {
    if (game.playerUnlock < 2) return
    game.gameLevelInit = 2
    game.gameLevel = 2
    start()

    document.getElementById('levels').style.left = '100%'
    document.getElementById('levels').style.opacity = '0'
    setTimeout(() => {
        document.getElementById('levels').style.visibility = 'hidden'
    }, 350)

    swoosh.currentTime = 0
    swoosh.play()
}
document.getElementById('lvl-3').onclick = () => {
    if (game.playerUnlock < 3) return
    game.gameLevelInit = 3
    game.gameLevel = 3
    start()

    document.getElementById('levels').style.left = '100%'
    document.getElementById('levels').style.opacity = '0'
    setTimeout(() => {
        document.getElementById('levels').style.visibility = 'hidden'
    }, 350)

    swoosh.currentTime = 0
    swoosh.play()
}
document.getElementById('lvl-4').onclick = () => {
    if (game.playerUnlock < 4) return
    game.gameLevelInit = 4
    game.gameLevel = 4
    start()

    document.getElementById('levels').style.left = '100%'
    document.getElementById('levels').style.opacity = '0'
    setTimeout(() => {
        document.getElementById('levels').style.visibility = 'hidden'
    }, 350)

    swoosh.currentTime = 0
    swoosh.play()
}

// volume
document.getElementById('music-slider').oninput = () => {
    music.volume = document.getElementById('music-slider').value / 100

    document.getElementById('music-ind').textContent = document.getElementById('music-slider').value
}
document.getElementById('music-slider').onmouseup = () => {
    swoosh.currentTime = 0
    swoosh.play()
}
document.getElementById('volume-slider').oninput = () => {
    sounds.forEach(e => {
        e.volume = document.getElementById('volume-slider').value / 100
    })
    document.getElementById('volume-ind').textContent = document.getElementById('volume-slider').value
}
document.getElementById('volume-slider').onmouseup = () => {
    swoosh.currentTime = 0
    swoosh.play()
}

// fullscreen
const doc = document.documentElement
document.getElementById('fs-checkbox').addEventListener('click', () => {
    if (window.innerHeight == screen.height) {
        document.exitFullscreen()
    }
    else {
        doc.requestFullscreen()
    }
    swoosh.currentTime = 0
    swoosh.play()
})

// shop items
document.getElementById('skins').addEventListener('click', (event) => {
    if (event.target.classList.contains('skin-btn')) {
        const index = event.target.dataset.index
        const parentDiv = event.target.closest('.skin-item')
        const priceTag = parentDiv.querySelector('.skin-price')

        // not bought
        if (skinItems[index].prompt === 'Buy' && parseInt(skinItems[index].price) <= game.playerTotalCoins) {
            game.playerTotalCoins -= parseInt(skinItems[index].price)
            document.getElementById('currency-coin').textContent = 'Coins: ' + game.playerTotalCoins
            skinItems[index].prompt = 'Equip'
            event.target.textContent = skinItems[index].prompt
            priceTag.textContent = 'Owned'

            swoosh.currentTime = 0
            swoosh.play()
        }

        // bought
        else if (event.target.textContent === 'Equip') {
            skinItems[index].prompt = 'Equipped'
            event.target.textContent = skinItems[index].prompt

            swoosh.currentTime = 0
            swoosh.play()

            if (skinItems[index].name === 'Green Pipes') {
                game.pipeSprite = './assets/images/pipe-green-export.png'
                game.pipeSprite2 = './assets/images/pipe-green-export-2.png'
                const otherItem = ([...document.getElementById('skins').children].find(div => div.querySelector('h3').textContent === 'Red Pipes')).querySelector('.skin-btn')
                otherItem.textContent = 'Equip'
            }
            if (skinItems[index].name === 'Red Pipes') {
                game.pipeSprite = './assets/images/pipe-red-export.png'
                game.pipeSprite2 = './assets/images/pipe-red-export-2.png'
                const otherItem = [...document.getElementById('skins').children].find(div => div.querySelector('h3').textContent === 'Green Pipes').querySelector('.skin-btn')
                otherItem.textContent = 'Equip'
            }
            if (skinItems[index].name === 'Daytime') {
                game.background = './assets/images/background-day.png'
                backgroundSprite.src = game.background
                const otherItem = [...document.getElementById('skins').children].find(div => div.querySelector('h3').textContent === 'Nighttime').querySelector('.skin-btn')
                otherItem.textContent = 'Equip'
            }
            if (skinItems[index].name === 'Nighttime') {
                game.background = './assets/images/background-night.png'
                backgroundSprite.src = game.background
                const otherItem = [...document.getElementById('skins').children].find(div => div.querySelector('h3').textContent === 'Daytime').querySelector('.skin-btn')
                otherItem.textContent = 'Equip'
            }
            if (skinItems[index].name === 'Yellow Bird') {
                game.playerSprite = './assets/images/yellowbird.png'
                player.spriteSheet.src = game.playerSprite
                const otherItem = [...document.getElementById('skins').children].find(div => div.querySelector('h3').textContent === 'Red Bird').querySelector('.skin-btn')
                otherItem.textContent = 'Equip'
                const otherItem2 = [...document.getElementById('skins').children].find(div => div.querySelector('h3').textContent === 'Blue Bird').querySelector('.skin-btn')
                otherItem2.textContent = 'Equip'
            }
            if (skinItems[index].name === 'Red Bird') {
                game.playerSprite = './assets/images/redbird.png'
                player.spriteSheet.src = game.playerSprite
                const otherItem = [...document.getElementById('skins').children].find(div => div.querySelector('h3').textContent === 'Yellow Bird').querySelector('.skin-btn')
                otherItem.textContent = 'Equip'
                const otherItem2 = [...document.getElementById('skins').children].find(div => div.querySelector('h3').textContent === 'Blue Bird').querySelector('.skin-btn')
                otherItem2.textContent = 'Equip'
            }
            if (skinItems[index].name === 'Blue Bird') {
                game.playerSprite = './assets/images/bluebird.png'
                player.spriteSheet.src = game.playerSprite
                const otherItem = [...document.getElementById('skins').children].find(div => div.querySelector('h3').textContent === 'Yellow Bird').querySelector('.skin-btn')
                otherItem.textContent = 'Equip'
                const otherItem2 = [...document.getElementById('skins').children].find(div => div.querySelector('h3').textContent === 'Red Bird').querySelector('.skin-btn')
                otherItem2.textContent = 'Equip'
            }
        }
    }
})

document.getElementById('skills').addEventListener('click', (event) => {
    if (event.target.classList.contains('skill-btn')) {
        const skillDiv = event.target.closest('.skill')
        const skillName = skillDiv.querySelector('h1').textContent
        console.log(parseInt((event.target.textContent.match(/\d+(?=\))/))[0], 10))

        if (event.target.textContent.includes('Unlock ') && parseInt((event.target.textContent.match(/\d+(?=\))/))[0], 10) <= game.playerPoint) {
            game.playerPoint -= parseInt((event.target.textContent.match(/\d+(?=\))/))[0], 10)
            document.getElementById('currency-skill').textContent = 'Skill Points: ' + game.playerPoint
            event.target.textContent = 'Unlocked'

            if (skillName === 'SLOW AND STEADY') {
                game.upgradeSlow = 0.8
            }
            if (skillName === 'MIDAS') {
                game.upgradeCoin = 2
            }
            if (skillName === 'OPEN SESAME') {
                game.upgradeGap = 1.2
            }
            if (skillName === 'PHOENIX') {
                game.upgradeLife = true
            }
            if (skillName === 'MOONWALKING') {
                game.upgradeGrav = 0.8
            }
        }
    }
})