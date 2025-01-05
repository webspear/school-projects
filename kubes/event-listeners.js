import {renderer} from "./main"
import {gameState} from "./main"
import {startGame} from "./main"
import {keys} from "./main"
import {hover} from "./main"
import {select} from "./main"
import {menu} from "./main"
import {music} from "./main"

import {sounds} from "./main"

export function setupEventListeners() {
    window.addEventListener('keydown', (event) => {
        switch(event.code) {
            case 'KeyA':
                keys.a = true
                break
            case 'KeyD':
                keys.d = true
                break
            case 'KeyW':
                keys.w = true
                break
            case 'KeyS':
                keys.s = true
                break
            
        }
    })
    window.addEventListener('keyup', (event) => {
        switch(event.code) {
            case 'KeyA':
                keys.a = false
                break
            case 'KeyD':
                keys.d = false
                break
            case 'KeyW':
                keys.w = false
                break
            case 'KeyS':
                keys.s = false
                break
            
        }
    })
    window.addEventListener('keydown', (event) => {
        if (event.repeat) return
        switch(event.code) {
            case 'Escape':
                if (gameState.gameStarted) {
                    if (gameState.paused) {
                        gameState.paused = false
                        document.getElementById('pause-menu').style.visibility = 'hidden'
                    }
                    else {
                        gameState.paused = true
                        document.getElementById('pause-menu').style.visibility = 'visible'
                    }
                }
                break
        }
    })
    document.getElementById('replay-btn').addEventListener('click', () => {
        select.currentTime = 0
        select.play()

        startGame()

        // hide end-menu
        document.getElementById('end-menu').style.top = '60%'
        document.getElementById('end-menu').style.opacity = '0'

        document.getElementById('end-title').textContent = 'VICTORY'
        setTimeout(() => {
            document.getElementById('end-menu').style.visibility = 'hidden'
        }, 500);
    })
    document.getElementById('back-to-title-btn').addEventListener('click', () => {
        select.currentTime = 0
        select.play()

        music.pause()
        music.currentTime = 0

        menu.play()
        
        document.getElementById('end-menu').style.top = '60%'
        document.getElementById('end-menu').style.opacity = '0'

        document.getElementById('end-title').textContent = 'VICTORY'
        setTimeout(() => {
            document.getElementById('end-menu').style.visibility = 'hidden'
        }, 500);

        // hide game
        renderer.setAnimationLoop(null)
        document.body.removeChild(renderer.domElement)
        document.getElementById('game').style.visibility = 'hidden'
        document.getElementById('upg-container').style.visibility = 'hidden'
        document.getElementById('pause-menu').style.visibility = 'hidden'

        // show menu
        document.getElementById('menu').style.left = '5%'
        document.getElementById('menu-icon').style.left = '70%'
    })

    // volume
    document.getElementById('music-slider').oninput = () => {
        menu.volume = document.getElementById('music-slider').value / 100
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

    // button events
    document.getElementById('play-btn').onmouseover = () => {
        hover.currentTime = 0
        hover.play()
    }
    document.getElementById('options-btn').onmouseover = () => {
        hover.currentTime = 0
        hover.play()
    }
    document.getElementById('options-back').onmouseover = () => {
        hover.currentTime = 0
        hover.play()
    }
    document.getElementById('controls-btn').onmouseover = () => {
        hover.currentTime = 0
        hover.play()
    }
    document.getElementById('controls-back').onmouseover = () => {
        hover.currentTime = 0
        hover.play()
    }
    document.getElementById('help-btn').onmouseover = () => {
        hover.currentTime = 0
        hover.play()
    }
    document.getElementById('help-back').onmouseover = () => {
        hover.currentTime = 0
        hover.play()
    }
    document.getElementById('vs-player').onmouseover = () => {
        hover.currentTime = 0
        hover.play()
    }
    document.getElementById('vs-cpu-easy').onmouseover = () => {
        hover.currentTime = 0
        hover.play()
    }
    document.getElementById('replay-btn').onmouseover = () => {
        hover.currentTime = 0
        hover.play()
    }
    document.getElementById('back-to-title-btn').onmouseover = () => {
        hover.currentTime = 0
        hover.play()
    }
    document.getElementById('upg-1').addEventListener('mouseenter', () => {
        hover.currentTime = 0
        hover.play()
    })
    document.getElementById('upg-2').addEventListener('mouseenter', () => {
        hover.currentTime = 0
        hover.play()
    })
    document.getElementById('upg-3').addEventListener('mouseenter', () => {
        hover.currentTime = 0
        hover.play()
    })

    // click events
    document.getElementById('start-overlay').onclick = () => {
        document.getElementById('start-overlay').style.visibility = 'hidden'
        select.currentTime = 0
        select.play()
        menu.play()
    }
    document.getElementById('play-btn').onclick = () => {
        document.getElementById('menu').style.left = '-50%'
        document.getElementById('game-select').style.left = '5%'
        select.currentTime = 0
        select.play()
    }
    document.getElementById('options-btn').onclick = () => {
        document.getElementById('menu').style.left = '-50%'
        document.getElementById('options').style.left = '5%'
        select.currentTime = 0
        select.play()
    }
    document.getElementById('options-back').onclick = () => {
        document.getElementById('options').style.left = '-50%'
        document.getElementById('menu').style.left = '5%'
        select.currentTime = 0
        select.play()
    }
    document.getElementById('help-btn').onclick = () => {
        document.getElementById('menu').style.left = '-50%'
        document.getElementById('help').style.left = '5%'
        select.currentTime = 0
        select.play()
    }
    document.getElementById('help-back').onclick = () => {
        document.getElementById('help').style.left = '-50%'
        document.getElementById('menu').style.left = '5%'
        select.currentTime = 0
        select.play()
    }
    document.getElementById('controls-btn').onclick = () => {
        document.getElementById('menu').style.left = '-50%'
        document.getElementById('controls').style.left = '5%'
        select.currentTime = 0
        select.play()
    }
    document.getElementById('controls-back').onclick = () => {
        document.getElementById('controls').style.left = '-50%'
        document.getElementById('menu').style.left = '5%'
        select.currentTime = 0
        select.play()
    }

    function fadeOutMusic(duration) {
        const fadeOutInterval = 50
        const fadeOutSteps = duration / fadeOutInterval
        let currentVolume = menu.volume
      
        const fadeOut = setInterval(() => {
          if (currentVolume > 0) {
            currentVolume -= 1 / fadeOutSteps
            menu.volume = Math.max(currentVolume, 0)
          } else {
            clearInterval(fadeOut)
            menu.pause()
          }
        }, fadeOutInterval)
    }

    document.getElementById('vs-player').onclick = () => {
        document.getElementById('game-select').style.left = '-50%'
        document.getElementById('menu-icon').style.left = '150%'
        select.currentTime = 0
        select.play()
        gameState.endlessMode = false

        fadeOutMusic(1000)

        music.play()

        setTimeout(() => {
            // start game
            document.getElementById('game').style.visibility = 'visible'
            startGame()
        }, 500);
        
    }
    document.getElementById('vs-cpu-easy').onclick = () => {
        document.getElementById('game-select').style.left = '-50%'
        document.getElementById('menu-icon').style.left = '150%'
        select.currentTime = 0
        select.play()
        gameState.endlessMode = true

        fadeOutMusic(1000)
        
        music.play()

        setTimeout(() => {
            // start game
            document.getElementById('game').style.visibility = 'visible'
            startGame()
        }, 500);
    }
    document.getElementById('upg-1').onclick = () => {
        select.currentTime = 0
        select.play()
    }
    document.getElementById('upg-2').onclick = () => {
        select.currentTime = 0
        select.play()
    }
    document.getElementById('upg-3').onclick = () => {
        select.currentTime = 0
        select.play()
    }
}