// handle key presses
window.addEventListener('keydown', (event) => {
    switch(event.key) {
        case 'w':
            keys.w = true
            break
        case 's':
            keys.s = true
            break
        case 'ArrowUp':
            keys.up = true
            break
        case 'ArrowDown':
            keys.down = true
            break
    }
})

// stop moving 
window.addEventListener('keyup', (event) => {
    switch(event.key) {
        case 'w':
            keys.w = false
            game.player1.velocity = 0
            break
        case 's':
            keys.s = false
            game.player1.velocity = 0
            break
        case 'ArrowUp':
            keys.up = false
            game.player2.velocity = 0
            break
        case 'ArrowDown':
            keys.down = false
            game.player2.velocity = 0
            break
    }
})

// pause
window.addEventListener('keydown', (event) => {
    if (event.repeat) return
    switch(event.key) {
        case 'Escape':
            if (!preventPause) {
                if (!paused) {
                    paused = true

                    game.player1.velocity = 0
                    game.player2.velocity = 0

                    gameStatus.style.visibility = 'visible'
                    gameStatus.textContent = 'PAUSED'
                }
                else {
                    paused = false

                    gameStatus.style.visibility = 'hidden'
                }
            }
            break
    }
})

// volume
document.getElementById('volume-slider').oninput = () => {
    sounds.forEach(e => {
        e.volume = document.getElementById('volume-slider').value / 100
    })
    document.getElementById('volume-ind').textContent = document.getElementById('volume-slider').value
}
document.getElementById('volume-slider').onmouseup = () => {
    select.currentTime = 0
    select.play()
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
    select.currentTime = 0
    select.play()
})

document.getElementById('fs-checkbox').onmouseover = () => {
    hover.currentTime = 0
    hover.play()
}

// gradual speed increase
document.getElementById('speed-checkbox').addEventListener('click', () => {
    if (gradualSpeedIncrease) {
        gradualSpeedIncrease = false
    }
    else {
        gradualSpeedIncrease = true
    }
    select.currentTime = 0
    select.play()
})

document.getElementById('speed-checkbox').onmouseover = () => {
    hover.currentTime = 0
    hover.play()
}

// color
const colorsDropdown = document.getElementById("colors")

colorsDropdown.addEventListener("change", function () {
    color = colorsDropdown.value
    canvas.style.border = '10px solid ' + color
})

document.getElementById("colors").onclick = () => {
    select.currentTime = 0
    select.play()
}

document.getElementById("colors").onmouseover = () => {
    hover.currentTime = 0
    hover.play()
}

// button events
document.getElementById('play-btn').onmouseover = () => {
    mouseOver(document.getElementById('play-btn'))
    hover.currentTime = 0
    hover.play()
}
document.getElementById('play-btn').onmouseout = () => {
    mouseOut(document.getElementById('play-btn'))
}
document.getElementById('options-btn').onmouseover = () => {
    mouseOver(document.getElementById('options-btn'))
    hover.currentTime = 0
    hover.play()
}
document.getElementById('options-btn').onmouseout = () => {
    mouseOut(document.getElementById('options-btn'))
}
document.getElementById('options-back').onmouseover = () => {
    mouseOver(document.getElementById('options-back'))
    hover.currentTime = 0
    hover.play()
}
document.getElementById('options-back').onmouseout = () => {
    mouseOut(document.getElementById('options-back'))
}
document.getElementById('controls-btn').onmouseover = () => {
    mouseOver(document.getElementById('controls-btn'))
    hover.currentTime = 0
    hover.play()
}
document.getElementById('controls-btn').onmouseout = () => {
    mouseOut(document.getElementById('controls-btn'))
}
document.getElementById('controls-back').onmouseover = () => {
    mouseOver(document.getElementById('controls-back'))
    hover.currentTime = 0
    hover.play()
}
document.getElementById('controls-back').onmouseout = () => {
    mouseOut(document.getElementById('controls-back'))
}
document.getElementById('vs-player').onmouseover = () => {
    mouseOver(document.getElementById('vs-player'))
    document.getElementById('game-desc').textContent = 'Play against your friend! A player vs. player experience.'
    hover.currentTime = 0
    hover.play()
}
document.getElementById('vs-player').onmouseout = () => {
    mouseOut(document.getElementById('vs-player'))
    document.getElementById('game-desc').textContent = ''
}
document.getElementById('vs-cpu-easy').onmouseover = () => {
    mouseOver(document.getElementById('vs-cpu-easy'))
    document.getElementById('game-desc').textContent = 'Play against a computer at easy diffciculty.'
    hover.currentTime = 0
    hover.play()
}
document.getElementById('vs-cpu-easy').onmouseout = () => {
    mouseOut(document.getElementById('vs-cpu-easy'))
    document.getElementById('game-desc').textContent = ''
}
document.getElementById('vs-cpu-med').onmouseover = () => {
    mouseOver(document.getElementById('vs-cpu-med'))
    document.getElementById('game-desc').textContent = 'Play against a computer at medium diffciculty.'
    hover.currentTime = 0
    hover.play()
}
document.getElementById('vs-cpu-med').onmouseout = () => {
    mouseOut(document.getElementById('vs-cpu-med'))
    document.getElementById('game-desc').textContent = ''
}
document.getElementById('vs-cpu-hard').onmouseover = () => {
    mouseOver(document.getElementById('vs-cpu-hard'))
    document.getElementById('game-desc').textContent = 'Play against a computer at hard diffciculty.'
    hover.currentTime = 0
    hover.play()
}
document.getElementById('vs-cpu-hard').onmouseout = () => {
    mouseOut(document.getElementById('vs-cpu-hard'))
    document.getElementById('game-desc').textContent = ''
}
document.getElementById('vs-survival').onmouseover = () => {
    mouseOver(document.getElementById('vs-survival'))
    document.getElementById('game-desc').textContent = 'Survive as long as possible against an unbeatable computer. Speed increase is disabled on this gamemode.'
    hover.currentTime = 0
    hover.play()
}
document.getElementById('vs-survival').onmouseout = () => {
    mouseOut(document.getElementById('vs-survival'))
    document.getElementById('game-desc').textContent = ''
}
document.getElementById('end-button-1').onmouseover = () => {
    mouseOver(document.getElementById('end-button-1'))
    hover.currentTime = 0
    hover.play()
}
document.getElementById('end-button-1').onmouseout = () => {
    mouseOut(document.getElementById('end-button-1'))
}
document.getElementById('end-button-2').onmouseover = () => {
    mouseOver(document.getElementById('end-button-2'))
    hover.currentTime = 0
    hover.play()
}
document.getElementById('end-button-2').onmouseout = () => {
    mouseOut(document.getElementById('end-button-2'))
    hover.currentTime = 0
}

document.getElementById('play-btn').onclick = () => {
    player1Score = 0
    player2Score = 0
    lastPlayerScore = 1
    game.ball.direction = 45
    document.getElementById('menu').style.visibility = 'hidden'
    document.getElementById('game-select').style.visibility = 'visible'
    select.currentTime = 0
    select.play()
}
document.getElementById('options-btn').onclick = () => {
    document.getElementById('menu').style.visibility = 'hidden'
    document.getElementById('options').style.visibility = 'visible'
    select.currentTime = 0
    select.play()
}
document.getElementById('options-back').onclick = () => {
    document.getElementById('options').style.visibility = 'hidden'
    document.getElementById('menu').style.visibility = 'visible'
    select.currentTime = 0
    select.play()
}
document.getElementById('controls-btn').onclick = () => {
    document.getElementById('menu').style.visibility = 'hidden'
    document.getElementById('controls').style.visibility = 'visible'
    select.currentTime = 0
    select.play()
}
document.getElementById('controls-back').onclick = () => {
    document.getElementById('controls').style.visibility = 'hidden'
    document.getElementById('menu').style.visibility = 'visible'
    select.currentTime = 0
    select.play()
}

document.getElementById('vs-player').onclick = () => {
    document.getElementById('game-select').style.visibility = 'hidden'
    document.getElementById('canvas').style.visibility = 'visible'
    select.currentTime = 0
    select.play()
    playerCount = 2
    if (!updateToggle) {
        game.update()
        updateToggle = true
    }
    game.roundStart()
}
document.getElementById('vs-cpu-easy').onclick = () => {
    document.getElementById('game-select').style.visibility = 'hidden'
    document.getElementById('canvas').style.visibility = 'visible'
    select.currentTime = 0
    select.play()
    playerCount = 1
    difficulty = difficulties.easy
    if (!updateToggle) {
        game.update()
        updateToggle = true
    }
    game.roundStart()
}
document.getElementById('vs-cpu-med').onclick = () => {
    document.getElementById('game-select').style.visibility = 'hidden'
    document.getElementById('canvas').style.visibility = 'visible'
    select.currentTime = 0
    select.play()
    playerCount = 1
    difficulty = difficulties.medium
    if (!updateToggle) {
        game.update()
        updateToggle = true
    }
    game.roundStart()
}
document.getElementById('vs-cpu-hard').onclick = () => {
    document.getElementById('game-select').style.visibility = 'hidden'
    document.getElementById('canvas').style.visibility = 'visible'
    select.currentTime = 0
    select.play()
    playerCount = 1
    difficulty = difficulties.hard
    if (!updateToggle) {
        game.update()
        updateToggle = true
    }
    game.roundStart()
}
document.getElementById('vs-survival').onclick = () => {
    document.getElementById('game-select').style.visibility = 'hidden'
    document.getElementById('canvas').style.visibility = 'visible'
    select.currentTime = 0
    select.play()
    playerCount = 1
    difficulty = difficulties.survival
    if (!updateToggle) {
        game.update()
        updateToggle = true
    }
    game.roundStart()
}

document.getElementById('end-button-1').onclick = () => {
    player1Score = 0
    player2Score = 0
    lastPlayerScore = 1
    game.ball.direction = 45
    document.getElementById('end-screen').style.visibility = 'hidden'
    select.currentTime = 0
    select.play()
    game.roundStart()
}
document.getElementById('end-button-2').onclick = () => {
    document.getElementById('menu').style.visibility = 'visible'
    document.getElementById('canvas').style.visibility = 'hidden'
    document.getElementById('end-screen').style.visibility = 'hidden'
    select.currentTime = 0
    select.play()
}