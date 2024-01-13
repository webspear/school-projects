let range = 100
var answer = Math.ceil(Math.random()*range)
console.log("answer: " + answer)
let totalHealth = 100
let remainingHealth = totalHealth
let tries = 0
let damage = 10
let difficulty = 'normal'
document.getElementById('fredcom').style.display = 'none'
const bgmusic = new Audio('Sounds/bg-music.mp3')


document.getElementById('startbutton').onclick = function() {
    const starting = document.getElementById('starting')
    const dialogue = document.getElementById('tutorialDialogue')
    document.getElementById('startbutton').style.animation = '0.6s 1 fadeOutOverlay'
    starting.style.animation = '0.6s 1 fadeOutOverlay'
    setTimeout(function(){
        document.getElementById('startbutton').style.display = 'none'
        starting.style.display = 'none'
        dialogue.style.animation = '0.6s 1 fadeInOverlay'
        document.getElementById('mute').style.animation = '0.6s 1 fadeInOverlay'
        setTimeout(function(){
            document.getElementById('mute').style.opacity = 1
            dialogue.style.display = 'flex'
            bgmusic.play()
            bgmusic.loop = true
            bgmusic.volume = 0.1
        }, 500)
    }, 500)
}


function verif(a) {
    var choice = a
    console.log("user's choice: " + choice)
    const healthbar = document.getElementById('healthbar')
    const fredcomment = document.getElementById('fredcomment')
    const healthcomment = document.getElementById('healthcomment')
    const fredcom = document.getElementById('fredcom')
    tries += 1
    if (choice == answer) {
        console.log('win')
        retryScreen('win')
    } else if (choice < answer) {
        console.log('small')
        remainingHealth -= damage
        fredcomment.innerHTML = 'Maybe try a bigger amount?'
        if (fredcom.style.display == 'block') {
            fredcom.style.animation = '0.2s 1 fadeOutOverlay'
            setTimeout(function(){fredcom.style.display = 'block'}, 100)
        }
        setTimeout(function(){
            fredcom.style.display = 'block'
            fredcom.style.animation = '0.2s 1 fadeInOverlay'
            setTimeout(function(){fredcom.style.display = 'block'}, 100)
        }, 100)
    } else if (choice > answer) {
        remainingHealth -= damage
        console.log('big')
        fredcomment.innerHTML = 'Maybe try a smaller amount?'
        if (fredcom.style.display == 'block') {
            fredcom.style.animation = '0.2s 1 fadeOutOverlay'
            setTimeout(function(){fredcom.style.display = 'block'}, 100)
        }
        setTimeout(function(){
            fredcom.style.display = 'block'
            fredcom.style.animation = '0.2s 1 fadeInOverlay'
            setTimeout(function(){fredcom.style.display = 'block'}, 100)
        }, 100)
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
    select()
    next += 1
    if (next == 2) {
        dialogue.innerHTML = "So you're here lookin' for a job, eh?"
    }
    if (next == 3) {
        dialogue.innerHTML = "I'll take you in. Name's Fred, been workin' here for over two decades now."
    }
    if (next == 4) {
        dialogue.innerHTML = "The work's pretty simple, I'll explain it to you."
    }
    if (next == 5) {
        dialogue.innerHTML = "You'll have to determine the right amount of liquor to use for a cocktail."
    }
    if (next == 6) {
        dialogue.innerHTML = "To start, I'll give you an average order. The amount of mL should be between 0 and 100."
    }
    if (next == 7) {
        dialogue.innerHTML = "I'll give you other orders once you're done with this."
    }
    if (next == 8) {
        dialogue.innerHTML = "Oh yeah, you can also hover your mouse on stuff you see to get an explanation."
    }
    if (next == 9) {
        dialogue.innerHTML = "Good luck!"
    }
    if (next >= 10) {
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
                document.getElementById('retryDialogue1').innerHTML = 'Well done!'
            } else {
                document.getElementById('retryDialogue1').innerHTML = 'Accidents happen... Maybe give it another shot?'
            }
        }, 300)
    }, 300)
        
}

let next2 = 1
function nextDialogueRetry() {
    console.log('arrived at retry sequence part 2')
    const dialogue = document.getElementById("retryDialogue1")
    select()
    next2 += 1
    if (next2 == 2) {
        dialogue.innerHTML = 'You tried ' + tries + ' time(s) and your remaining liquor is ' + remainingHealth + 'mL.'
    } else if (next2 == 3) {
        dialogue.innerHTML = 'You can try again on the same difficulty, ...'
    } else if (next2 == 4) {
        if (difficulty == 'hard') {
            dialogue.innerHTML = '...or try an easier mix.'
            next2 = 6
        } else {
            dialogue.innerHTML = '...or try a harder mix.'
        }
    } else if (next2 == 5) {
        dialogue.innerHTML = 'A harder mix means more ingredient loss and a bigger range.'
        if (difficulty == 'easy') {next2 = 7}
    } else if (next2 == 6) {
        dialogue.innerHTML = 'If it was too hard, you can also try an easier order.'
    } else if (next2 == 7) {
        dialogue.innerHTML = 'An easier order means less ingredient loss and a smaller range.'
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
document.getElementById('healthhoverarea').onmouseover = function() {
    document.getElementById('healthhover').style.opacity = 1
    document.getElementById('healthcom').style.display = 'block'
    document.getElementById('healthcom').style.animation = '0.2s 1 fadeInOverlay'
    setTimeout(function(){document.getElementById('healthcom').style.display = 'block'}, 100)
}
document.getElementById('healthhoverarea').onmouseout = function() {
    document.getElementById('healthhover').style.opacity = 0
    document.getElementById('healthcom').style.animation = '0.2s 1 fadeOutOverlay'
    setTimeout(function(){document.getElementById('healthcom').style.display = 'none'}, 100)
}


document.getElementById('easy').onclick = function() {
    console.log('difficulty set to easy')
    difficulty = 'easy'
    damage = 5
    range = 20
    document.getElementById('inputcomment').textContent = 'Amount is between 0 and 20'
    reset()
}
document.getElementById('normal').onclick = function() {
    console.log('difficulty set to normal')
    difficulty = 'normal'
    damage = 10
    range = 100
    document.getElementById('inputcomment').textContent = 'Amount is between 0 and 100'
    reset()
}
document.getElementById('hard').onclick = function() {
    console.log('difficulty set to hard')
    difficulty = 'hard'
    damage = 20
    range = 200
    document.getElementById('inputcomment').textContent = 'Amount is between 0 and 200'
    reset()
}

function reset() {
    tries = 0
    remainingHealth = 100
    console.log(tries, remainingHealth, range)
    document.getElementById('fredcomment').innerHTML = 'You can go again!'
    document.getElementById('healthcomment').innerHTML = 'Remaining Liquor: ' + remainingHealth + '/100'
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


let isMuted = false
document.getElementById('sound').addEventListener('click', function() {
    const sound = document.getElementById('mute')
    isMuted = !isMuted
    if (isMuted) {
        sound.src = 'Images/unmute.png';
        bgmusic.pause()
    } 
    else {
        sound.src = 'Images/mute.png';
        bgmusic.play()
    }
})
