const dialogue = document.getElementById('dialogue')

const dialogueStartText = [
    {
        name: 'You',
        text: 'Oh no! It seems my expirements backfired on me...'
    },
    {
        name: 'You',
        text: 'I should\'ve been more careful with that shrinking potion.'
    },
    {
        name: 'You',
        text: 'I need to find a way to go back to my original size!'
    },
]

const dialogueStart = new Dialogue(dialogueStartText, 80, false, './features/public/audio/click.ogg', dialogue, () => {
    dialogueStart.destroy()

    document.getElementById('controls').style.animation = 'slideIn 1s ease-out forwards'

    function blink() {
        document.getElementById('controls-btn').textContent = '> PROCEED'
        setTimeout(() => {
            document.getElementById('controls-btn').textContent = 'PROCEED'
        }, 1000);
        setTimeout(() => {
            blink()
        }, 2000);
    }
    blink()
});

const dialogueBeakerText = [
    {
        name: 'You',
        text: 'Everything is so...... big...'
    },
]

let dialoguingBeakerExit = false

const dialogueBeaker = new Dialogue(dialogueBeakerText, 80, false, './features/public/audio/click.ogg', dialogue, () => {
    dialogueBeaker.destroy()
    locked = false
    dialoguing = false
});


const tubeTempBlockTxt = [
    {
        name: 'You',
        text: 'I don\'t have all the ingredients yet, I should try looking for more.'
    },
]

let tubeTempOnce = false

const finalTxt = [
    {
        name: 'You',
        text: 'Did it.... did it work....?'
    },
    {
        name: '???',
        text: '........'
    },
    {
        name: '???',
        text: '...thanks for playing...'
    },
]
const final = new Dialogue(finalTxt, 60, false, './features/public/audio/click.ogg', dialogue, () => {
    final.destroy()
});