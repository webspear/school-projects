import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.171.0/build/three.module.js'
// import Stats from 'stats.js'
// import {OrbitControls} from 'three/addons/controls/OrbitControls.js'

// event listerners
import {setupEventListeners} from './event-listeners.js'

// classes
import Box from './classes/box.js'
import Player from './classes/player.js'
import Enemy from './classes/enemy.js'

const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 0.1, 1000)

export const renderer = new THREE.WebGLRenderer({alpha: true, antialias: true})
renderer.shadowMap.enabled = true
renderer.setSize(window.innerWidth, window.innerHeight)

// var stats = new Stats()
// stats.showPanel(0) // 0: fps, 1: ms, 2: mb, 3+: custom
// document.body.appendChild(stats.dom)

// const controls = new OrbitControls(camera, renderer.domElement)

// set camera position
camera.position.set(0, 20, 5)
camera.lookAt(0, 0, 0)

// global variables
export let gameState = {
    playerExperience: 0,
    playerLvl: 1,
	paused: false,
	locked: false,
	transition: false,
    waveMultiplier: 1,
    enemies: [],
    expPts: [],
	expMP: 1, // def 1
	atkSpeedMp: 1, // def 1
	atkDmgMp: 1, // def 1
	critChance: 0, // def 0
	// critDmgMp: 2,
	selectedObjects: [],
	totalWaveEnemies: 10,
	remainingEnemies: 10,
	endlessMode: false, // def is false
	gameStarted: false,
}

// audio
export const hover = new Audio()
hover.src = './public/audio/hover.mp3'
export const select = new Audio()
select.src = './public/audio/select.mp3'
export const crit = new Audio()
crit.src = './public/audio/crit.mp3'
export const dmg = new Audio()
dmg.src = './public/audio/dmg.mp3'
export const end = new Audio()
end.src = './public/audio/end.mp3'
export const expa = new Audio()
expa.src = './public/audio/exp.wav'
export const hurt = new Audio()
hurt.src = './public/audio/hurt.wav'
export const levelup = new Audio()
levelup.src = './public/audio/level-up.mp3'
export const shoot = new Audio()
shoot.src = './public/audio/shoot.wav'

export const sounds = [hover, select, crit, dmg, end, expa, hurt, levelup, shoot]

export const menu = new Audio()
menu.src = './public/audio/menu.mp3'
menu.volume = 0.5
menu.loop = true
export const music = new Audio()
music.src = './public/audio/music.mp3'
music.volume = 0.5
music.loop = true

// objects
let player = new Player({
	width: 1,
	height: 1,
	depth: 1,
	position: {
		x:0,
		y:2,
		z:0
	},
})
player.castShadow = true
scene.add(player)

const ground = new Box({
	width: 17,
	height: 0.5,
	depth: 10,
	color: '#808080',
	position: {
		x:0,
		y:-0.25,
		z:0
	}
})
ground.receiveShadow = true
scene.add(ground)

const groundBig = new Box({
	width: 30,
	height: 0.1,
	depth: 20,
	color: '#808080',
	position: {
		x:0,
		y:-0.05,
		z:0
	}
})
groundBig.receiveShadow = true
scene.add(groundBig)

// lights
const light = new THREE.SpotLight(0xffffff, 700)
light.position.set(10, 30, 10)
light.castShadow = true
light.shadow.mapSize.width = 2048
light.shadow.mapSize.height = 2048
scene.add(light)

scene.add(new THREE.AmbientLight(0xffffff, 0.5))

// key events
export let keys = {
	a: false,
	d: false,
	w: false,
	s: false
}

setupEventListeners()

// enemy spawning
let enemySpawnCD = false
function spawnEnemy() {
	if (!enemySpawnCD && gameState.totalWaveEnemies > 0 && !gameState.locked && !gameState.paused && !gameState.transition) {
		gameState.totalWaveEnemies --
		enemySpawnCD = true

		const enemy = new Enemy({
			random: Math.random() * gameState.waveMultiplier
		})
		enemy.spawn(player, ground, gameState.enemies)
		gameState.enemies.push(enemy)
		enemy.castShadow = true
		scene.add(enemy)

		setTimeout(() => {
			enemySpawnCD = false
		}, 2000)
	}
}

function resetGame() {
	renderer.setAnimationLoop(null)

	// rem everything
	scene.remove(player)
	for (let i = gameState.enemies.length - 1; i >= 0; i--) {
		const enemy = gameState.enemies[i]
		scene.remove(enemy)
	
		// Remove from array if disposed
		if (!scene.children.includes(enemy)) {
			gameState.enemies.splice(i, 1)
		}
	}
	for (let i = gameState.expPts.length - 1; i >= 0; i--) {
		const exp = gameState.expPts[i]
		scene.remove(exp)
	
		// Remove from array if disposed
		if (!scene.children.includes(exp)) {
			gameState.expPts.splice(i, 1)
		}
	}
	for (let i = player.bullets.length - 1; i >= 0; i--) {
		const bullet = player.bullets[i]
		scene.remove(bullet)
		scene.remove(bullet.trail)
	
		// Remove from array if disposed
		if (!scene.children.includes(bullet)) {
			player.bullets.splice(i, 1)
		}
	}

	// add new player
	player = new Player({
		width: 1,
		height: 1,
		depth: 1,
		position: {
			x:0,
			y:2,
			z:0
		},
	})
	player.castShadow = true
	scene.add(player)

	gameState = {
		playerExperience: 0,
		playerLvl: 1,
		paused: false,
		locked: false,
		transition: false,
		waveMultiplier: 1,
		enemies: [],
		expPts: [],
		expMP: 1, // def 1
		atkSpeedMp: 1, // def 1
		atkDmgMp: 1, // def 1
		critChance: 0, // def 0
		// critDmgMp: 2,
		selectedObjects: [],
		totalWaveEnemies: 10,
		remainingEnemies: 10,
		endlessMode: gameState.endlessMode, // keep the gamemode
		gameStarted: false,
	}

	// change the text
	document.getElementById('hp-prog').textContent = '20/20'
	document.getElementById('hp-bar').style.background = 'linear-gradient(to right, #2bb148 100%, rgb(215, 255, 220) 0%)'

	document.getElementById('lvl-txt').textContent = 'LEVEL 1'
	document.getElementById('lvl-prog').textContent = '0/0'
	document.getElementById('exp-bar').style.background = 'linear-gradient(to right, #0856ff 0%, rgb(215, 234, 255) 0%)'

	document.getElementById('wave-ind').textContent = 'WAVE: 1'
	document.getElementById('wave-prog').textContent = 'ENEMIES REMAINING: 10'

	document.getElementById('wave-announcer-title').textContent = 'WAVE 1'
	document.getElementById('wave-announcer-txt').textContent = 'ENEMY SIZE MULTIPLIER: 1x'
	document.getElementById('wave-announcer-ct').textContent = 'TOTAL ENEMIES THIS WAVE: 10'

	document.getElementById('hp-stats-txt').textContent = 'MAX HEALTH: 20'
	document.getElementById('atk-dmg-txt').textContent = 'ATTACK DAMAGE: +0%'
	document.getElementById('atk-speed-txt').textContent = 'ATTACK SPEED: +0%'
	document.getElementById('speed-txt').textContent = 'SPEED: +0%'
	document.getElementById('crit-txt').textContent = 'CRIT CHANCE: 0%'
	document.getElementById('exp-stats-txt').textContent = 'EXP GAIN: +0%'
}

function startWave() {
	document.getElementById('wave-announcer-title').textContent = 'WAVE ' + gameState.waveMultiplier
	document.getElementById('wave-announcer-txt').textContent = 'ENEMY SIZE MULTIPLIER: ' + gameState.waveMultiplier + 'x'
	document.getElementById('wave-announcer-ct').textContent = 'TOTAL ENEMIES THIS WAVE: ' + gameState.totalWaveEnemies
	
	document.getElementById('wave-ind').textContent = 'WAVE: ' + gameState.waveMultiplier
	document.getElementById('wave-prog').textContent = 'ENEMIES REMAINING: ' + gameState.remainingEnemies

	document.getElementById('wave-announcer-container').style.visibility = 'visible'
	document.getElementById('wave-announcer-container').style.top = '50%'
	document.getElementById('wave-announcer-container').style.opacity = '1'
	setTimeout(() => {
		document.getElementById('wave-announcer-container').style.top = '60%'
		document.getElementById('wave-announcer-container').style.opacity = '0'
		setTimeout(() => {
			document.getElementById('wave-announcer-container').style.visibility = 'hidden'
		}, 800)
	}, 2000)
}

// player shooting
const playerShoot = setInterval(() => {
	if (!gameState.paused && !gameState.locked)
    player.trackClosestEnemy(gameState.enemies, scene)
}, 1000 / gameState.atkSpeedMp)


// render the scene
function animate() {
	// stats.begin()

	if (!gameState.locked && !gameState.paused) {
		// player movement
		if ((keys.w || keys.s) && (keys.a || keys.d)) {
			player.speed = Math.sqrt(Math.pow(player.initialSpeed, 2) / 2)
		}
		else {
			player.speed = player.initialSpeed
		}

		if (keys.w && keys.s) player.velocity.z = 0
		else if (keys.w) player.velocity.z = -player.speed
		else if (keys.s) player.velocity.z = player.speed

		if (keys.a && keys.d) player.velocity.x = 0
		else if (keys.a) player.velocity.x = -player.speed
		else if (keys.d) player.velocity.x = player.speed

		// update objects
		player.update(ground, scene, gameState.enemies)

		gameState.enemies.forEach((enemy, index) => {
			enemy.update(player, ground, gameState.enemies)

			// rem bullets if disposed
			if (!scene.children.includes(enemy)) {
				gameState.enemies.splice(index, 1)
			}
		})

		gameState.expPts.forEach((exp, index) => {
			exp.update(scene, player)

			// rem if disposed
			if (!scene.children.includes(exp)) {
				gameState.expPts.splice(index, 1)
			}
		})

		spawnEnemy()

		if (gameState.remainingEnemies <= 0 && !gameState.transition) {
			gameState.transition = true

			setTimeout(() => {
				if (gameState.waveMultiplier >= 1 && !gameState.endlessMode){ // ends at wave 5 (def 5)
					end.currentTime = 0
					end.play()

					gameState.expPts.forEach((exp, index) => {
						scene.remove(exp)

						if (!scene.children.includes(exp)) {
							gameState.expPts.splice(index, 1)
						}
					})

					gameState.locked = true

					document.getElementById('upg-container').style.visibility = 'hidden'

					// end screen
					document.getElementById('end-menu').style.visibility = 'visible'
					document.getElementById('end-menu').style.opacity = '1'
					document.getElementById('end-menu').style.top = '50%'

					document.getElementById('end-title').textContent = 'VICTORY'

					document.getElementById('endless-score').textContent = ' '

					// update end stats
					document.getElementById('end-hp-stats').textContent = document.getElementById('hp-stats-txt').textContent
					document.getElementById('end-atk-dmg').textContent = document.getElementById('atk-dmg-txt').textContent
					document.getElementById('end-atk-speed').textContent = document.getElementById('atk-speed-txt').textContent
					document.getElementById('end-speed').textContent = document.getElementById('speed-txt').textContent
					document.getElementById('end-crit').textContent = document.getElementById('crit-txt').textContent
					document.getElementById('end-exp-stats').textContent = document.getElementById('exp-stats-txt').textContent

				}
				else {
					gameState.waveMultiplier++
					gameState.totalWaveEnemies = gameState.waveMultiplier * 10
					gameState.remainingEnemies = gameState.totalWaveEnemies

					startWave()

					setTimeout(() => {
						gameState.transition = false
					}, 4000)
				}
			}, 1000)
		}
		
	}
	
	// stats.end()
	
	renderer.render(scene, camera)
}

export function startGame() {
	document.body.appendChild(renderer.domElement)

	resetGame()

	gameState.gameStarted = true

	gameState.transition = true
	renderer.setAnimationLoop(animate)

	setTimeout(() => {
		gameState.transition = false
	}, 4500);
	
	document.getElementById('lvl-prog').textContent = '0/' + Math.round((2 * gameState.playerLvl * Math.log(gameState.playerLvl + 1))*100)

	setTimeout(() => {
		startWave()
	}, 1000);
}

// startGame()