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

// clear canvas function
function clearCanvas() {
    requestAnimationFrame(clearCanvas)

    ctx.fillStyle = 'rgba(30, 42, 56, 1)'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
}

clearCanvas()

background()

setTimeout(() => {
}, 1000)

// chapter1()

options()

cursor()