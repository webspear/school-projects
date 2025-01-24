import Button from "../classes/button.js";
import {buttons} from '../../main.js'

export function chapter1() {
    const testBtn = new Button({
        position: {x: 500, y: 500},
        radius: 100,
        color: 'red',
    })

    function animate() {
        requestAnimationFrame(animate)

        testBtn.update()
    }

    animate()
}