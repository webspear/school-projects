const dialogue = document.getElementById('dialogue')

const dialogueBeakerText = [
    {
        name: 'You',
        text: 'Everything is so...... big.'
    },
]

let dialoguingBeakerExit = false
let dialogueBeakerOnce = false

const dialogueBeaker = new Dialogue(dialogueBeakerText, 80, false, '../features/audio/click.ogg', dialogue, () => {
    dialogueBeaker.destroy()
    locked = false
    dialoguing = false
});