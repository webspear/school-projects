import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.171.0/build/three.module.js'
import {gameState} from '../main.js'
import { expa } from '../main.js'
import { levelup } from '../main.js'

class Exp extends THREE.Mesh {
    constructor({size, color = '#4db2ff', position}) {
        super (
            new THREE.OctahedronGeometry(size, 0),
            new THREE.MeshStandardMaterial({color})
        )
        
        this.value = size

        this.position.set(position.x, position.y, position.z)

        this.velocity
    }

    update(scene, player) {
        this.rotation.y += 0.02

        // using vectors for the first time ()
        const direction = new THREE.Vector3()
            .subVectors(player.position, this.position)
            .normalize()
            .multiplyScalar(0.2)
        this.velocity = direction

        // only attract when player is close enough
        if (player && this.position.distanceTo(player.position) < 2) {
            this.position.add(this.velocity)
        }

        // del bullet when reaching target
        if (player && this.position.distanceTo(player.position) < 0.2) {
            expa.currentTime = 0
            expa.play()

            scene.remove(this)

            gameState.playerExperience += this.value * gameState.expMP * 3

            // exp requirements
            let expReq = 2 * gameState.playerLvl * Math.log(gameState.playerLvl + 1)

            // level up!
            if (gameState.playerExperience > expReq) {
                levelup.currentTime = 0
                levelup.play()

                gameState.playerLvl++

                // update stats
                gameState.playerExperience -= expReq
                expReq = 2 * gameState.playerLvl * Math.log(gameState.playerLvl + 1)
                document.getElementById('lvl-txt').textContent = 'LEVEL ' + gameState.playerLvl
                
                console.log(gameState.playerExperience)

                // lock character
                gameState.locked = true

                // animations
                document.getElementById('upg-title-div').style.opacity = 1

                document.getElementById('upg-1').style.transition = '0ms'
                document.getElementById('upg-2').style.transition = '0ms'
                document.getElementById('upg-3').style.transition = '0ms'
                document.getElementById('upg-1').style.top = '50%'
                document.getElementById('upg-2').style.top = '50%'
                document.getElementById('upg-3').style.top = '50%'
                document.getElementById('upg-1').style.transform = 'translate(-80%, -50%) scaleX(0)'
                document.getElementById('upg-2').style.transform = 'translate(-80%, -50%) scaleX(0)'
                document.getElementById('upg-3').style.transform = 'translate(-80%, -50%) scaleX(0)'
                document.getElementById('upg-1').style.transition = '200ms'
                document.getElementById('upg-2').style.transition = '200ms'
                document.getElementById('upg-3').style.transition = '200ms'
                setTimeout(() => {
                    document.getElementById('upg-container').style.visibility = 'visible'
                    document.getElementById('upg-1').style.transform = 'translate(-50%, -50%)'
                    setTimeout(() => {
                        document.getElementById('upg-2').style.transform = 'translate(-50%, -50%)'
                    }, 200)
                    setTimeout(() => {
                        document.getElementById('upg-3').style.transform = 'translate(-50%, -50%)'
                    }, 400)
                }, 150)

                this.levelUp(player)
            }

            document.getElementById('exp-bar').style.background = 'linear-gradient(to right, #0856ff ' + (gameState.playerExperience/expReq)*100 +'%, rgb(215, 234, 255) ' + (gameState.playerExperience/expReq)*100 +'%)'
            document.getElementById('lvl-prog').textContent = Math.round(gameState.playerExperience*100) + '/' + Math.round(expReq*100)
        }
    }

    levelUp(player) {
        // set attributes for cards
        const attributes = [
            {id: 0, img: './public/images/hp.png', pos: '+2 Health', neg: '-5% Speed'},
            {id: 1, img: './public/images/atk-dmg.png', pos: '+20% Atk Damage', neg: '-3% EXP Gain'},
            {id: 2, img: './public/images/atk-speed.png', pos: '+20% Atk Speed', neg: '-2% Crit Chance'},
            {id: 3, img: './public/images/speed.png', pos: '+20% Speed', neg: '-1 Health'},
            {id: 4, img: './public/images/crit.png', pos: '+10% Crit Chance', neg: '-5% Atk Speed'},
            {id: 5, img: './public/images/exp.png', pos: '+20% EXP Gain', neg: '-3% Atk Damage'},
        ]

        while (gameState.selectedObjects.length < 3) {
            const randomIndex = Math.floor(Math.random() * attributes.length)
            const randomObject = attributes[randomIndex]
        
            // use uid
            if (!gameState.selectedObjects.includes(randomObject)) {
              gameState.selectedObjects.push(randomObject)
            }
        }

        console.log(gameState.selectedObjects)

        function handleUpgrade(selectedObject) {
            if (selectedObject?.id === 0) {
                player.maxHealth += 2
                player.speed -= 0.06 * 0.05
                player.initialSpeed -= 0.06 * 0.05
                player.health = player.maxHealth
                document.getElementById('hp-prog').textContent = player.health + '/' + player.maxHealth
                document.getElementById('hp-bar').style.background = 'linear-gradient(to right, #2bb148 ' + (player.health / player.maxHealth) * 100 + '%, rgb(215, 255, 220) 0%)'
            } else if (selectedObject?.id === 1) {
                gameState.atkDmgMp += 0.2
                gameState.expMP -= 0.03
            } else if (selectedObject?.id === 2) {
                gameState.atkSpeedMp += 0.2
                gameState.critChance -= 0.02
            } else if (selectedObject?.id === 3) {
                player.speed += 0.06 * 0.2
                player.initialSpeed += 0.06 * 0.2
                player.maxHealth -= 1
                if (player.health > player.maxHealth) {
                    player.health = player.maxHealth
                    document.getElementById('hp-prog').textContent = player.health + '/' + player.maxHealth
                    document.getElementById('hp-bar').style.background = 'linear-gradient(to right, #2bb148 ' + (player.health / player.maxHealth) * 100 + '%, rgb(215, 255, 220) 0%)'
                }
            } else if (selectedObject?.id === 4) {
                gameState.critChance += 0.1
                gameState.atkSpeedMp -= 0.05
            } else if (selectedObject?.id === 5) {
                gameState.expMP += 0.2
                gameState.atkDmgMp -= 0.03
            }
        
            // stats
            document.getElementById('hp-stats-txt').textContent = 'MAX HEALTH: ' + player.maxHealth
        
            if (gameState.atkDmgMp >= 1) {
                document.getElementById('atk-dmg-txt').textContent = 'ATTACK DAMAGE: ' + '+' + Math.round((gameState.atkDmgMp - 1) * 100) + '%'
            } else {
                document.getElementById('atk-dmg-txt').textContent = 'ATTACK DAMAGE: ' + Math.round((gameState.atkDmgMp - 1) * 100) + '%'
            }
        
            if (gameState.atkSpeedMp >= 1) {
                document.getElementById('atk-speed-txt').textContent = 'ATTACK SPEED: ' + '+' + Math.round((gameState.atkSpeedMp - 1) * 100) + '%'
            } else {
                document.getElementById('atk-speed-txt').textContent = 'ATTACK SPEED: ' + Math.round((gameState.atkSpeedMp - 1) * 100) + '%'
            }
        
            if (player.initialSpeed >= 0.06) {
                document.getElementById('speed-txt').textContent = 'SPEED: ' + '+' + Math.round((player.initialSpeed - 0.06)/0.06 * 100) + '%'
            } else {
                document.getElementById('speed-txt').textContent = 'SPEED: ' + Math.round((player.initialSpeed - 0.06)/0.06 * 100) + '%'
            }
        
            document.getElementById('crit-txt').textContent = 'CRIT CHANCE: ' + Math.round((gameState.critChance) * 100) + '%'
        
            if (gameState.expMP >= 1) {
                document.getElementById('exp-stats-txt').textContent = 'EXP GAIN: ' + '+' + Math.round((gameState.expMP - 1) * 100) + '%'
            } else {
                document.getElementById('exp-stats-txt').textContent = 'EXP GAIN: ' + Math.round((gameState.expMP - 1) * 100) + '%'
            }
        
            gameState.locked = false
        
        }
        
        function handleUpgrade1() {
            document.getElementById('upg-title-div').style.opacity = 0
            document.getElementById('upg-1').style.top = '200%'
            document.getElementById('upg-2').style.transform = 'translate(-80%, -50%) scaleX(0)'
            document.getElementById('upg-3').style.transform = 'translate(-80%, -50%) scaleX(0)'
            setTimeout(() => {
                document.getElementById('upg-1').style.transform = 'translate(-80%, -50%) scaleX(0)'
                document.getElementById('upg-container').style.visibility = 'hidden'
            }, 300)
            console.log('1')
            handleUpgrade(gameState.selectedObjects[0])
            gameState.selectedObjects = []
        }
        
        function handleUpgrade2() {
            document.getElementById('upg-title-div').style.opacity = 0
            document.getElementById('upg-2').style.top = '200%'
            document.getElementById('upg-1').style.transform = 'translate(-80%, -50%) scaleX(0)'
            document.getElementById('upg-3').style.transform = 'translate(-80%, -50%) scaleX(0)'
            setTimeout(() => {
                document.getElementById('upg-2').style.transform = 'translate(-80%, -50%) scaleX(0)'
                document.getElementById('upg-container').style.visibility = 'hidden'
            }, 300)
            console.log('2')
            handleUpgrade(gameState.selectedObjects[1])
            gameState.selectedObjects = []
        }
        
        function handleUpgrade3() {
            document.getElementById('upg-title-div').style.opacity = 0
            document.getElementById('upg-3').style.top = '200%'
            document.getElementById('upg-1').style.transform = 'translate(-80%, -50%) scaleX(0)'
            document.getElementById('upg-2').style.transform = 'translate(-80%, -50%) scaleX(0)'
            setTimeout(() => {
                document.getElementById('upg-3').style.transform = 'translate(-80%, -50%) scaleX(0)'
                document.getElementById('upg-container').style.visibility = 'hidden'
            }, 300)
            console.log('3')
            handleUpgrade(gameState.selectedObjects[2])
            gameState.selectedObjects = []
        }
        
        document.getElementById('upg-1').removeEventListener('click', handleUpgrade1)
        document.getElementById('upg-2').removeEventListener('click', handleUpgrade2)
        document.getElementById('upg-3').removeEventListener('click', handleUpgrade3)
        
        if (gameState.selectedObjects.length != 0) {
            document.getElementById('upg-1').addEventListener('click', handleUpgrade1)
            document.getElementById('upg-2').addEventListener('click', handleUpgrade2)
            document.getElementById('upg-3').addEventListener('click', handleUpgrade3)
        }

        // update cards
        document.getElementById('upg-img-1').src = gameState.selectedObjects[0].img
        document.getElementById('pos-txt-1').textContent = gameState.selectedObjects[0].pos
        document.getElementById('neg-txt-1').textContent = gameState.selectedObjects[0].neg

        document.getElementById('upg-img-2').src = gameState.selectedObjects[1].img
        document.getElementById('pos-txt-2').textContent = gameState.selectedObjects[1].pos
        document.getElementById('neg-txt-2').textContent = gameState.selectedObjects[1].neg

        document.getElementById('upg-img-3').src = gameState.selectedObjects[2].img
        document.getElementById('pos-txt-3').textContent = gameState.selectedObjects[2].pos
        document.getElementById('neg-txt-3').textContent = gameState.selectedObjects[2].neg
    }
}

export default Exp