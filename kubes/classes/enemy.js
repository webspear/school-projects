import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.171.0/build/three.module.js'
import Exp from './exp.js'
import EnemyBullet from './enemy-bullet.js'
import {gameState} from '../main.js'
import {dmg} from '../main.js'
import {crit} from '../main.js'

class Enemy extends THREE.Mesh {
    constructor({color = '#f6b447', position = {x:0, y:2, z:0}, random, player}) {
        const ranSide = random * 0.5 + 1

        super(
            new THREE.BoxGeometry(ranSide, ranSide, ranSide), 
            new THREE.MeshStandardMaterial({color})
        )

        this.width = ranSide
        this.height = ranSide
        this.depth = ranSide

        this.position.set(position.x, position.y, position.z)

        this.bottom = this.position.y - this.height/2
        this.top = this.position.y + this.height/2

        this.velocity = {
            x: 0,
            y: -0.01,
            z: 0
        }
        this.gravity = -0.005
        
        this.speed = Math.max(random * -0.01 + 0.03, 0.006)
        this.direction = 45
        this.maxHealth = random * 0.5 + 1
        this.health = this.maxHealth

        this.isDead = false

        this.type = 1 // type of enemy; 1 is normal, 2 is shooter

        this.shootCD = true
        this.frameCount = 30
        this.direction2 = new THREE.Vector3()
            .subVectors(player.position, this.position)
            .normalize()

        // enemies.push(this)
    }

    spawn(player, ground) {
        let validSpawn = false

        if (this.type === 2) {
            this.material.color.set('#ea8f29')
        }
    
        while (!validSpawn) {
            // random position
            this.position.x = Math.random() * ground.width - ground.width / 2
            this.position.z = Math.random() * ground.depth - ground.depth / 2

            validSpawn = true

            // check for collision w/ other enemies
            for (const other of gameState.enemies) {
                if (other !== this) {
                    const distanceX = Math.abs(this.position.x - other.position.x)
                    const distanceZ = Math.abs(this.position.z - other.position.z)
                    const minDistance = this.width / 2 + other.width / 2

                    if (distanceX < minDistance && distanceZ < minDistance) {
                        validSpawn = false
                        break
                    }
                }
            }

            // check if too close to the player
            if (Math.sqrt((player.position.x - this.position.x)**2 + (player.position.z - this.position.z)**2) < 5) {
                validSpawn = false
            }
        }
    }

    update(player, ground, scene) {
        this.bottom = this.position.y - this.height/2
        this.top = this.position.y + this.height/2

        // collisions with player
        if (this.checkCollisionWithPlayer(player)) {
            this.resolveCollisionWithPlayer(player)
        }

        // collisions with other enemies
        for (const other of gameState.enemies) {
            if (other !== this && this.checkCollision(other)) {
                this.resolveCollision(other)
            }
        }
        
        // track player
        this.direction = Math.atan2(player.position.z - this.position.z, player.position.x - this.position.x)*-1
 
        if (this.direction >= 180) {
            this.direction -= 180
        }

        // enemy direction of movement
        this.velocity.x = Math.cos(this.direction)
        this.velocity.z = Math.sin(this.direction) * -1

        // type 2 stays at a certain distance
        if (this.type === 2) {
            this.keepDistance(player)
        }

        // apply vleocity to position
        this.position.x += this.velocity.x * this.speed
        this.position.z += this.velocity.z * this.speed

        this.applyGravity(ground)

        this.direction2 = new THREE.Vector3()
            .subVectors(player.position, this.position)
            .normalize()

        // shoot player
        if (this.type === 2) {
            const raycaster = new THREE.Raycaster()
            raycaster.set(this.position, this.direction2)
            const intersects = raycaster.intersectObjects(scene.children)

            for (const intersect of intersects) {
                let shouldBreak = false
                gameState.enemies.forEach((enemy) => {
                    if (intersect.object === enemy) {
                        shouldBreak = true
                    }
                    else if (intersect.object === player) {
                        this.frameCount++
                        if (!gameState.paused && !gameState.locked && !this.shootCD) {
                            this.shootCD = true
                    
                            this.fireBullet(scene, player)
                    
                        }
                        if (this.frameCount >= (Math.random()*30+150)*2) {
                            this.shootCD = false
                            this.frameCount = 0
                        }
                    }
                })

                if (shouldBreak) {
                    break
                }

                // if (intersect.object === player) {
                //     this.frameCount++
                //     if (!gameState.paused && !gameState.locked && !this.shootCD) {
                //         this.shootCD = true
                
                //         this.fireBullet(scene, player)
                
                //     }
                //     if (this.frameCount >= (Math.random()*30+90)*2) {
                //         this.shootCD = false
                //         this.frameCount = 0
                //     }
                // }
                // else {
                //     console.log('nope')
                // }
            }
        }
    }

    keepDistance(player) {
        if (Math.sqrt((player.position.x - this.position.x)**2 + (player.position.z - this.position.z)**2) <= 6) {
            this.velocity.x = 0
            this.velocity.z = 0
        }
    }

    fireBullet(scene, player) {
        // shoot.currentTime = 0
        // shoot.play()

        const bullet = new EnemyBullet({
            position: { x: this.position.x, y: player.position.y, z: this.position.z },
            target: player,
        })

        scene.add(bullet)
        scene.add(bullet.trail)

        gameState.enemyBullets.push(bullet)
    }

    applyGravity(ground) {
        this.velocity.y += this.gravity

        // collision with ground
        if (this.bottom + this.velocity.y <= ground.top) {
            this.velocity.y *= 0.5 // bounciness
            this.velocity.y = -this.velocity.y
        }
        else {
            this.position.y += this.velocity.y
        }
    }

    checkCollisionWithPlayer(player) {
        return (
            this.position.x - this.width / 2 < player.position.x + player.width / 2 &&
            this.position.x + this.width / 2 > player.position.x - player.width / 2 &&
            this.position.z - this.depth / 2 < player.position.z + player.depth / 2 &&
            this.position.z + this.depth / 2 > player.position.z - player.depth / 2
        )
    }

    resolveCollisionWithPlayer(player) {
        const overlapX = (this.width + player.width) / 2 - Math.abs(this.position.x - player.position.x)
        const overlapZ = (this.depth + player.depth) / 2 - Math.abs(this.position.z - player.position.z)

        if (overlapX < overlapZ) {
            // x-axis
            if (this.position.x < player.position.x) {
                this.position.x -= overlapX
            } else {
                this.position.x += overlapX
            }
            
            this.velocity.x = 0
        } else {
            // z-axis
            if (this.position.z < player.position.z) {
                this.position.z -= overlapZ
            } else {
                this.position.z += overlapZ
            }

            this.velocity.z = 0
        }
    }

    checkCollision(other) {
        return (
            this.position.x - this.width / 2 < other.position.x + other.width / 2 &&
            this.position.x + this.width / 2 > other.position.x - other.width / 2 &&
            this.position.z - this.depth / 2 < other.position.z + other.depth / 2 &&
            this.position.z + this.depth / 2 > other.position.z - other.depth / 2
        )
    }

    resolveCollision(other) {
        const overlapX = (this.width + other.width) / 2 - Math.abs(this.position.x - other.position.x);
        const overlapZ = (this.depth + other.depth) / 2 - Math.abs(this.position.z - other.position.z);

        if (overlapX < overlapZ) {
            // x-axis
            if (this.position.x < other.position.x) {
                this.position.x -= overlapX / 2
                other.position.x += overlapX / 2
            } else {
                this.position.x += overlapX / 2
                other.position.x -= overlapX / 2
            }

            this.velocity.x = 0
            other.velocity.x = 0
        } else {
            // z-axis
            if (this.position.z < other.position.z) {
                this.position.z -= overlapZ / 2
                other.position.z += overlapZ / 2
            } else {
                this.position.z += overlapZ / 2
                other.position.z -= overlapZ / 2
            }

            this.velocity.z = 0
            other.velocity.z = 0
        }
    }

    damaged(scene) {
        // critical hit chances, crit deals twice the damage
        const critRNG = Math.random()

        if (critRNG <= gameState.critChance) {
            crit.currentTime = 0
            crit.play()

            this.health -= 0.5 * gameState.atkDmgMp * 2
        }
        else {
            dmg.currentTime = 0
            dmg.play()

            this.health -= 0.5 * gameState.atkDmgMp
        }

        this.material.color.set('#ff0000')
        setTimeout(() => {
            if (this.type === 1)
            this.material.color.set('#f6b447')
            else
            this.material.color.set('#ea8f29')
        }, 100)

        if (this.health <= 0) {
            this.isDead = true

            scene.remove(this)

            const experiencePt = new Exp({
                size: this.maxHealth/3, // size of exp dependant on health of enemy
                position: {
                    x: this.position.x,
                    y: 0.5,
                    z: this.position.z
                }
            })

            scene.add(experiencePt)

            gameState.expPts.push(experiencePt)

            gameState.remainingEnemies--
            document.getElementById('wave-prog').textContent = 'ENEMIES REMAINING: ' + gameState.remainingEnemies
        }
    }
}

export default Enemy