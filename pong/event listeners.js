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
document.getElementById('music-slider').oninput = () => {
    music.volume = document.getElementById('music-slider').value / 100
    
    document.getElementById('music-ind').textContent = document.getElementById('music-slider').value
}
document.getElementById('music-slider').onmouseup = () => {
    select.currentTime = 0
    select.play()
}
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

// game scale
document.getElementById('scale-slider').oninput = () => {
    if (document.getElementById('orientation-btn').textContent == 'HORIZONTAL') {
        canvas.height = 700 * document.getElementById('scale-slider').value/100
        canvas.width = 1000 * document.getElementById('scale-slider').value/100
    }
    else {
        canvas.height = 1000 * document.getElementById('scale-slider').value/100
        canvas.width = 700 * document.getElementById('scale-slider').value/100
    }
    game.player2.position.x = canvas.width - 70

    function financial(x) {
        return Number.parseFloat(x).toFixed(2);
    }
    document.getElementById('scale-ind').textContent = financial(document.getElementById('scale-slider').value/100) + 'x'
}
document.getElementById('scale-slider').onmouseup = () => {
    select.currentTime = 0
    select.play()
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

// paddle size
document.getElementById('size-slider').oninput = () => {
    paddleSize = document.getElementById('size-slider').value
    game.player1.height = document.getElementById('size-slider').value
    game.player2.height = document.getElementById('size-slider').value

    document.getElementById('size-ind').textContent = document.getElementById('size-slider').value + 'px'
}
document.getElementById('size-slider').onmouseup = () => {
    select.currentTime = 0
    select.play()
}

// ball starting angle
document.getElementById('angle-slider').oninput = () => {
    game.ball.direction = document.getElementById('angle-slider').value - 90
    if (game.ball.direction < 0) {
        game.ball.direction += 360
    }

    document.getElementById('angle-ind').style.transform = 'rotate(' + game.ball.direction + 'deg)'
}
document.getElementById('angle-slider').onmouseup = () => {
    select.currentTime = 0
    select.play()
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
document.getElementById('help-btn').onmouseover = () => {
    mouseOver(document.getElementById('help-btn'))
    hover.currentTime = 0
    hover.play()
}
document.getElementById('help-btn').onmouseout = () => {
    mouseOut(document.getElementById('help-btn'))
}
document.getElementById('help-back').onmouseover = () => {
    mouseOver(document.getElementById('help-back'))
    hover.currentTime = 0
    hover.play()
}
document.getElementById('help-back').onmouseout = () => {
    mouseOut(document.getElementById('help-back'))
}

// game options menu
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

// game mods menu
document.getElementById('orientation-btn').onmouseover = () => {
    mouseOver(document.getElementById('orientation-btn'))
    hover.currentTime = 0
    hover.play()
}
document.getElementById('orientation-btn').onmouseout = () => {
    mouseOut(document.getElementById('orientation-btn'))
}
document.getElementById('mods-proceed').onmouseover = () => {
    mouseOver(document.getElementById('mods-proceed'))
    hover.currentTime = 0
    hover.play()
}
document.getElementById('mods-proceed').onmouseout = () => {
    mouseOut(document.getElementById('mods-proceed'))
}

// end screen menu
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


// click events
document.getElementById('start-overlay').onclick = () => {
    document.getElementById('start-overlay').style.visibility = 'hidden'
    music.play()
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
document.getElementById('help-btn').onclick = () => {
    document.getElementById('menu').style.visibility = 'hidden'
    document.getElementById('help').style.visibility = 'visible'
    select.currentTime = 0
    select.play()
}
document.getElementById('help-back').onclick = () => {
    document.getElementById('help').style.visibility = 'hidden'
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
    document.getElementById('game-mods').style.visibility = 'visible'
    select.currentTime = 0
    select.play()
    playerCount = 2
}
document.getElementById('vs-cpu-easy').onclick = () => {
    document.getElementById('game-select').style.visibility = 'hidden'
    document.getElementById('game-mods').style.visibility = 'visible'
    select.currentTime = 0
    select.play()
    playerCount = 1
    difficulty = difficulties.easy
}
document.getElementById('vs-cpu-med').onclick = () => {
    document.getElementById('game-select').style.visibility = 'hidden'
    document.getElementById('game-mods').style.visibility = 'visible'
    select.currentTime = 0
    select.play()
    playerCount = 1
    difficulty = difficulties.medium
}
document.getElementById('vs-cpu-hard').onclick = () => {
    document.getElementById('game-select').style.visibility = 'hidden'
    document.getElementById('game-mods').style.visibility = 'visible'
    select.currentTime = 0
    select.play()
    playerCount = 1
    difficulty = difficulties.hard
}
document.getElementById('vs-survival').onclick = () => {
    document.getElementById('game-select').style.visibility = 'hidden'
    document.getElementById('game-mods').style.visibility = 'visible'
    document.getElementById('speed-label').textContent = 'SPEED INCREASE (DISABLED):'
    select.currentTime = 0
    select.play()
    playerCount = 1
    difficulty = difficulties.survival
}
document.getElementById('orientation-btn').onclick = () => {
    if (document.getElementById('orientation-btn').textContent == 'HORIZONTAL') {
        document.getElementById('orientation-btn').textContent = 'VERTICAL'
        canvas.style.transform = 'translate(-50%, -50%) rotate(90deg)'
        canvas.height = 1000
        canvas.width = 700
    }
    else {
        document.getElementById('orientation-btn').textContent = 'HORIZONTAL'
        canvas.style.transform = 'translate(-50%, -50%)'
        canvas.height = 700
        canvas.width = 1000
    }
    game.player2.position.x = canvas.width - 70
}
document.getElementById('mods-proceed').onclick = () => {
    document.getElementById('game-mods').style.visibility = 'hidden'
    document.getElementById('canvas').style.visibility = 'visible'
    select.currentTime = 0
    select.play()
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
    document.getElementById('speed-label').textContent = 'SPEED INCREASE:'
    select.currentTime = 0
    select.play()
}