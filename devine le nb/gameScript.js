let range = 100
var answer = Math.ceil(Math.random()*range)
console.log("answer: " + answer)
let totalHealth = 100
let remainingHealth = totalHealth
let tries = 0
let damage = 10


document.getElementById('startbutton').onclick = function() {
    console.log('^^^ autoplay policies :(')
    const starting = document.getElementById('starting')
    const dialogue = document.getElementById('tutorialDialogue')
    const bgmusic = new Audio('Sounds/Fireside-Tales-MP3.mp3')
    document.getElementById('startbutton').style.animation = '0.6s 1 fadeOutOverlay'
    starting.style.animation = '0.6s 1 fadeOutOverlay'
    setTimeout(function(){
        document.getElementById('startbutton').style.display = 'none'
        starting.style.display = 'none'
        dialogue.style.animation = '0.6s 1 fadeInOverlay'
        setTimeout(function(){
            dialogue.style.display = 'flex'
            bgmusic.play()
            bgmusic.loop = true
            bgmusic.volume = 0.03
        }, 500)
    }, 500)
}


function verif(a) {
    var choice = a
    console.log(choice)
    const healthbar = document.getElementById('healthbar')
    const fredcomment = document.getElementById('fredcomment')
    const healthcomment = document.getElementById('healthcomment')
    tries += 1
    if (choice == answer) {
        console.log('win')
        retryScreen('win')
    } else if (choice < answer) {
        console.log('small')
        remainingHealth -= damage
        fredcomment.innerHTML = 'Maybe try a bigger amount?'
        if (document.getElementById('fredcom').style.display == 'none') {
            document.getElementById('fredcom').style.display = 'block'
            document.getElementById('fredcom').style.animation = '0.2s 1 fadeInOverlay'
            setTimeout(function(){document.getElementById('fredcom').style.display = 'block'}, 100)
        }
    } else if (choice > answer) {
        remainingHealth -= damage
        console.log('big')
        fredcomment.innerHTML = 'Maybe try a smaller amount?'
        if (document.getElementById('fredcom').style.display == 'none') {
            document.getElementById('fredcom').style.display = 'block'
            document.getElementById('fredcom').style.animation = '0.2s 1 fadeInOverlay'
            setTimeout(function(){document.getElementById('fredcom').style.display = 'block'}, 100)
        }
    }
    healthcomment.innerHTML = 'Remaining health: ' + remainingHealth + '/100'
    console.log('remaining health: ' + remainingHealth)
    console.log('tries: ' + tries)
    if (remainingHealth <= totalHealth*0.75) {
        healthbar.src = 'Images/healthbar - 75.png'
        console.log('health below 75%, passed')
    } if (remainingHealth <= totalHealth*0.50) {
        healthbar.src = 'Images/healthbar - 50.png'
    } if (remainingHealth <= totalHealth*0.25) {
        healthbar.src = 'Images/healthbar - 25.png'
    } if (remainingHealth <= 0) {
        healthbar.src = 'Images/healthbar - empty.png'
        retryScreen('lose')
    }
}

let next = 1
function nextDialogueTutorial() {
    const dialogue = document.getElementById("tutorialDialogue1")
    next += 1
    if (next == 2) {
        console.log("passed")
        dialogue.innerHTML = "so uh... i dont have dialogue yet (just know that u can hover over stuff)"
    }
    if (next == 3) {
        console.log("end tutorial")
        const bartender = document.getElementById("startupOverlay")
        document.getElementById("tutorialDialogue").style.animation = '0.4s 1 fadeOutOverlay'
        bartender.style.animation = '0.4s 1 fadeOutOverlay'
        setTimeout(function(){
            document.getElementById("tutorialDialogue").style.display = 'none'
            bartender.style.display = 'none'
            setTimeout(function(){
                const overlay = document.getElementById("overlay")
                overlay.style.display = 'block'
                overlay.style.animation = '0.3s 1 fadeInOverlay'

            }, 300)
        }, 300)
    }
}

document.getElementById('input').onclick = function() {
    document.getElementById('input').value = ''
}

document.getElementById('confirm').onclick = function() {
    verif(document.getElementById('input').value)
}

function retryScreen(e){
    console.log('arrived at retry sequence')
    const retryScreen = document.getElementById('retryScreen')
    document.getElementById('overlay').style.display = 'block'
    document.getElementById('overlay').style.animation = '0.4s 1 fadeOutOverlay'
    setTimeout(function(){
        document.getElementById('overlay').style.display = 'none'
        document.getElementById('retryScreen').style.display = 'block'
        retryScreen.style.display = 'block'
        retryScreen.style.animation = '0.4s 1 fadeInOverlay'
        setTimeout(function(){
            retryScreen.style.opacity = 1
            if (e == 'win') {
                document.getElementById('retryDialogue1').innerHTML = 'Congratulations!'
            } else {
                document.getElementById('retryDialogue1').innerHTML = 'It seems you have failed...'
            }
        }, 300)
    }, 300)
        
}

let next2 = 1
function nextDialogueRetry() {
    console.log('arrived at retry sequence part 2')
    const dialogue = document.getElementById("retryDialogue1")
    next2 += 1
    if (next2 == 2) {
        dialogue.innerHTML = 'You tried ' + tries + ' time(s) and your remaining health is ' + remainingHealth + '.'
    } else if (next2 == 3) {
        dialogue.innerHTML = 'You can try again on the same difficulty, ...'
    } else if (next2 == 4) {
        dialogue.innerHTML = '...or try a harder challenge.'
    } else if (next2 == 5) {
        dialogue.innerHTML = 'A harder challenge means more health penalties and a bigger range.'
    } else if (next2 == 6) {
        dialogue.innerHTML = 'If it was too hard, you can also try an easier challenge.'
    } else if (next2 == 7) {
        dialogue.innerHTML = 'An easier challenge means less health penalties and a smaller range.'
    } else if (next2 == 8) {
        dialogue.innerHTML = 'What will you do?'
    } else if (next2 >= 9) {
        dialogue.innerHTML = ''
        document.getElementById('difficulties').style.display = 'flex'
    } 
}

document.getElementById('fredhoverarea').onmouseover = function() {
    document.getElementById('fredhover').style.opacity = 1
    document.getElementById('fredcom').style.display = 'block'
    document.getElementById('fredcom').style.animation = '0.2s 1 fadeInOverlay'
    setTimeout(function(){document.getElementById('fredcom').style.display = 'block'}, 100)
}
document.getElementById('fredhoverarea').onmouseout = function() {
    document.getElementById('fredhover').style.opacity = 0
    document.getElementById('fredcom').style.animation = '0.2s 1 fadeOutOverlay'
    setTimeout(function(){document.getElementById('fredcom').style.display = 'none'}, 100)
}
document.getElementById('healthbar').onmouseover = function() {
    document.getElementById('healthhover').style.opacity = 1
    document.getElementById('healthcom').style.display = 'block'
    document.getElementById('healthcom').style.animation = '0.2s 1 fadeInOverlay'
    setTimeout(function(){document.getElementById('healthcom').style.display = 'block'}, 100)
}
document.getElementById('healthbar').onmouseout = function() {
    document.getElementById('healthhover').style.opacity = 0
    document.getElementById('healthcom').style.animation = '0.2s 1 fadeOutOverlay'
    setTimeout(function(){document.getElementById('healthcom').style.display = 'none'}, 100)
}


document.getElementById('easy').onclick = function() {
    console.log('difficulty set to easy')
    damage = 5
    range = 20
    reset()
}
document.getElementById('normal').onclick = function() {
    console.log('difficulty set to normal')
    damage = 10
    range = 100
    reset()
}
document.getElementById('hard').onclick = function() {
    console.log('difficulty set to hard')
    damage = 20
    range = 200
    reset()
}

function reset() {
    tries = 0
    remainingHealth = 100
    console.log(tries, remainingHealth, range)
    document.getElementById('fredcomment').innerHTML = 'You can now try again!'
    document.getElementById('healthcomment').innerHTML = 'Remaining health: ' + remainingHealth + '/100'
    document.getElementById('healthbar').src = 'Images/healthbar - filled.png'
    answer = Math.ceil(Math.random()*range)
    console.log('new answer: ' + answer)

    console.log('retrying')
    const retryScreen = document.getElementById('retryScreen')
    retryScreen.style.animation = '0.4s 1 fadeOutOverlay'
    setTimeout(function(){
        retryScreen.style.display = 'none'
        document.getElementById('difficulties').style.display = 'none'
        next2 = 1
        document.getElementById('input').value = '0'
        document.getElementById('overlay').style.animation = '0.4s 1 fadeInOverlay'
        setTimeout(function(){
            document.getElementById('overlay').style.display = 'block'
        }, 300)
    }, 300)
}


function hover(){
    const hover = new Audio()
    hover.src = 'Sounds/hover.mp3'
    hover.play()
}

function select(){
    const select = new Audio('Sounds/select.mp3')
    select.play()
}
