const dialogue = document.getElementById('dialogue')

const dialogueStartText = [
    {
        name: 'You',
        text: 'Everything is so...... big.'
    },
]

const dialogueStart = new Dialogue(dialogueStartText, 80, false, './features/public/audio/click.ogg', dialogue, () => {
    dialogueStart.destroy()
    locked = false
    titleSequence = false
    camFocus = false
});

const dialogueBeakerText = [
    {
        name: 'You',
        text: 'Everything is so...... big.'
    },
]

let dialoguingBeakerExit = false

const dialogueBeaker = new Dialogue(dialogueBeakerText, 80, false, './features/public/audio/click.ogg', dialogue, () => {
    dialogueBeaker.destroy()
    locked = false
    dialoguing = false
});