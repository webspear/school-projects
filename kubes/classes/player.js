import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.171.0/build/three.module.js'
import Bullet from './bullet.js'
import { gameState } from '../main.js'
import { hurt } from '../main.js'
import { shoot } from '../main.js'
import { end } from '../main.js'

class Player extends THREE.Mesh {
    constructor({width, height, depth, color = '#71a9ff', velocity = {x:0, y:0, z:0}, position = {x:0, y:0, z:0}}) {
        super(
            new THREE.BoxGeometry(width, height, depth), 
            new THREE.MeshStandardMaterial({color})
        )

        this.width = width
        this.height = height
        this.depth = depth

        this.position.set(position.x, position.y, position.z)

        this.bottom = this.position.y - this.height/2
        this.top = this.position.y + this.height/2

        this.velocity = velocity
        this.gravity = -0.005
        
        this.initialSpeed = 0.06
        this.speed = this.initialSpeed
        this.maxHealth = 10
        this.health = this.maxHealth

        this.target = null

        this.bullets = []

        this.inv = false
        this.invFrames = 0
        this.invDur = 20
    }

    update(ground, scene, enemies) {
        this.bottom = this.position.y - this.height/2
        this.top = this.position.y + this.height/2

        // move player
        this.position.z += this.velocity.z
        this.position.x += this.velocity.x

        this.borderCollision(ground)

        // reset velocities
        this.velocity.x = 0
        this.velocity.z = 0

        this.applyGravity(ground)

        this.bullets.forEach((bullet, index) => {
            bullet.update(scene)

            // rem bullets if disposed
            if (!scene.children.includes(bullet)) {
                this.bullets.splice(index, 1)
            }
        })

        this.target = null // reset the target every frame

        this.takeDmg(enemies)
    }

    borderCollision(ground) {
        if (this.position.x - this.width/2 < -ground.width/2) {
            this.position.x = -ground.width/2 + this.width/2
        }
        else if (this.position.x + this.width/2 > ground.width/2) {
            this.position.x = ground.width/2 - this.width/2
        }
        if (this.position.z - this.depth/2 < -ground.depth/2) {
            this.position.z = -ground.depth/2 + this.depth/2
        }
        else if (this.position.z + this.depth/2 > ground.depth/2) {
            this.position.z = ground.depth/2 - this.depth/2
        }
    }

    applyGravity(ground) {
        this.velocity.y += this.gravity

        // collision with ground
        if (this.bottom + this.velocity.y <= ground.top) {
            this.velocity.y *= 0.5
            this.velocity.y = -this.velocity.y
        }
        else {
            this.position.y += this.velocity.y
        }
    }

    takeDmg(enemies) {
        // invincibilty
        if (this.inv) {
            this.invFrames++

            // reset
            if (this.invFrames >= this.invDur) {
                this.inv = false
                this.invFrames = 0
            }
        }

        // collision with enemies
        enemies.forEach((e) => {
            if (e.checkCollisionWithPlayer(this)) {
                if (!this.inv) {
                    this.takeDmg2()
                }
            }
        })

        gameState.enemyBullets.forEach((bullet) => {
            if (
                bullet.position.x > this.position.x - this.width / 2 &&
                bullet.position.x < this.position.x + this.width / 2 &&
                bullet.position.z > this.position.z - this.depth / 2 &&
                bullet.position.z < this.position.z + this.depth / 2
            ) {
                if (!this.inv) {
                    this.takeDmg2()
                }
            }
        })
    }

    takeDmg2() {
        this.health--

        hurt.currentTime = 0
        hurt.play()

        document.getElementById('hp-prog').textContent = this.health + '/' + this.maxHealth
        document.getElementById('hp-bar').style.background = 'linear-gradient(to right, #2bb148 ' + (this.health/this.maxHealth)*100 + '%, rgb(215, 255, 220) 0%)'
        
        this.inv = true

        // death
        if (this.health <= 0) {
            end.currentTime = 0
            end.play()
            
            gameState.locked = true

            document.getElementById('upg-container').style.visibility = 'hidden'

            // end screen
            document.getElementById('end-menu').style.visibility = 'visible'
            document.getElementById('end-menu').style.opacity = '1'
            document.getElementById('end-menu').style.top = '50%'

            document.getElementById('end-title').textContent = 'DEFEAT'

            // update end stats
            document.getElementById('end-hp-stats').textContent = document.getElementById('hp-stats-txt').textContent
            document.getElementById('end-atk-dmg').textContent = document.getElementById('atk-dmg-txt').textContent
            document.getElementById('end-atk-speed').textContent = document.getElementById('atk-speed-txt').textContent
            document.getElementById('end-speed').textContent = document.getElementById('speed-txt').textContent
            document.getElementById('end-crit').textContent = document.getElementById('crit-txt').textContent
            document.getElementById('end-exp-stats').textContent = document.getElementById('exp-stats-txt').textContent

            if (gameState.endlessMode) {
                document.getElementById('endless-score').textContent = 'SURVIVED ' + gameState.waveMultiplier +' WAVE'
            }
            else {
                document.getElementById('endless-score').textContent = ' '
            }
        }
    }

    trackClosestEnemy(enemies, scene) {
        let closestDistance = Infinity

        // find the closest enemy
        enemies.forEach((e) => {
            const distance = Math.sqrt((e.position.x - this.position.x)**2 + (e.position.z - this.position.z)**2)

            if (distance < closestDistance) {
                closestDistance = distance
                this.target = e
            }
        })

        // create bullet
        if (this.target) {
            this.fireBullet(scene)
        }
    }

    fireBullet(scene) {
        shoot.currentTime = 0
        shoot.play()

        const bullet = new Bullet({
            position: { x: this.position.x, y: this.position.y, z: this.position.z },
            target: this.target,
        })

        scene.add(bullet)
        scene.add(bullet.trail)

        this.bullets.push(bullet)
    }
}

export default Player