import {cursor} from './js/cursor.js'
import {chapter1} from "./js/chapters/chap1.js";
import {chapter2} from "./js/chapters/chap2.js";
import {chapter3} from "./js/chapters/chap3.js";
import {chapter4} from "./js/chapters/chap4.js";
import {background} from "./js/background.js";
import {options} from "./js/options.js";

export const canvas = document.getElementById('canvas')
export const ctx = canvas.getContext('2d')

canvas.width = window.innerWidth
canvas.height = window.innerHeight

window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
})

// objects
export let buttons = []
export let ripples = []

// audio
export const click1 = new Audio()
click1.src = './assets/audio/click1.mp3'
export const click2 = new Audio()
click2.src = './assets/audio/click2.mp3'

export const music = new Audio()
music.src = './assets/audio/music.mp3'
music.volume = 0.5
music.loop = true

// clear canvas function
function clearCanvas() {
    requestAnimationFrame(clearCanvas)

    ctx.fillStyle = 'rgba(30, 42, 56, 1)'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
}

clearCanvas()

document.getElementById('start-overlay').addEventListener('click', () => {
    document.getElementById('start-overlay').style.visibility = 'hidden'

    background()
    chapter1()

    music.play()
})

// background()

// chapter1()

// options()

cursor()