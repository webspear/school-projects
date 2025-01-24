import {cursor} from './js/cursor.js'
import {chapter1} from "./js/chapters/chap1.js";

export const canvas = document.getElementById('canvas')
export const ctx = canvas.getContext('2d')

canvas.width = window.innerWidth
canvas.height = window.innerHeight

// objects
export let buttons = []

// clear canvas function
function clearCanvas() {
    requestAnimationFrame(clearCanvas)

    ctx.clearRect(0, 0, canvas.width, canvas.height)
}

clearCanvas()

chapter1()

cursor()
