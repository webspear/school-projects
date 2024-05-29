class Dialogue {
    constructor(dialogues, timeDelay, autoSkip, sfx, parent, callback) {
        this.dialogues = dialogues; // list of dialogues [{name:"name, text:"text"}]
        this.timeDelay = timeDelay; // time delay per letter
        this.oldTimeDelay = timeDelay; // store the original time delay
        this.autoSkip = autoSkip; // auto skip to the next dialogue
        this.sfx = new Audio(sfx); // sound effect
        this.parent = parent; // parent element
        this.callback = callback; // callback function on completion

        this.currentDialogue = 0; // current "chapter"
        this.currentText = 0; // current letter
        this.isTyping = false; // is letter appearing "typing"
        this.isAuto = false; // is auto skipping
        this.isFinished = false; // is dialogue finished

        // main wrapper
        this.dialogueElement = document.createElement("div");
        this.dialogueElement.classList.add("dialogueWrapper");

        // name box
        this.nameBox = document.createElement("div");
        this.nameBox.classList.add("nameBox");
        this.dialogueElement.appendChild(this.nameBox);

        // text box
        this.textBox = document.createElement("div");
        this.textBox.classList.add("textBox");
        this.dialogueElement.appendChild(this.textBox);

        this.parent.appendChild(this.dialogueElement);
        this.lastTime = 0;

        this.dialogueElement.style.zIndex = -100;

        this.next = this.next.bind(this);
        this.init();
    }

    init() {
        const styles = `
        .dialogueWrapper{
            position: absolute;
            top: 85%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 50%;
            height: 20%;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            gap: 10px;
            user-select: none;
            opacity: 0;
        }
        
        .nameBox{
            width: 100%;
            height: 20%;
            justify-content: center;
            align-items: center;
            font-size: 3em;
            text-align: left;
        }
        
        .textBox{
            width: 100%;
            height: 80%;
            justify-content: center;
            align-items: center;
            font-size: 2.5em;
            border: 5px solid black;
            overflow-y: auto;
            padding: 10px;
            background-color: rgb(255, 255, 255, 0.5);
            text-align: center;
        }
        
        .nextArrow{
            width: 50px;
            height: 50px;
            fill: black;
            cursor: pointer;
            position: absolute;
            bottom: 0;
            right: 0;
            
        }
        `;

        this.styleSheet = document.createElement("style");
        this.styleSheet.innerText = styles;
        document.head.appendChild(this.styleSheet);

        this.arrowHtml = `<br> <br> <svg class="nextArrow" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
            <rect x="54" y="64" width="9" height="9"/>
            <rect x="63" y="55" width="9" height="9"/>
            <rect x="72" y="46" width="9" height="9"/>
            <rect x="18" y="46" width="9" height="9"/>
            <rect x="27" y="55" width="9" height="9"/>
            <rect x="36" y="64" width="9" height="9"/>
            <rect x="45" y="73" width="9" height="9"/>
            <polygon points="54,45.667 54,55 63,55 63,45.667 63,36.667 63,28 54,28 54,36.667"/>
            <polygon points="45,45.667 45,36.667 45,28 36,28 36,36.667 36,45.667 36,55 45,55"/>
            <rect x="45" y="19" width="9" height="9"/>
        </svg>
        `;
    }

    updateText(timeStamp) {
        this.dT = timeStamp - this.lastTime;
        if (this.dT > this.timeDelay) {
            this.lastTime = timeStamp;
            if (this.isTyping) {
                this.nameBox.innerHTML = this.dialogues[this.currentDialogue].name;
                this.textBox.innerHTML = this.dialogues[
                    this.currentDialogue
                    ].text.substring(0, this.currentText);

                // auto scroll to the bottom
                this.textBox.scrollTop = this.textBox.scrollHeight;

                // increment the current letter
                this.currentText++;

                try {
                    this.sfx.pause();
                    this.sfx.currentTime = 0;
                    this.sfx.play();
                } catch (e) {}

                // check for end of chapter
                if (
                    this.currentText > this.dialogues[this.currentDialogue].text.length
                ) {
                    this.isTyping = false;
                    // reset time delay
                    this.timeDelay = this.oldTimeDelay;

                    this.currentDialogue++;
                    // add arrows
                    if (this.currentDialogue < this.dialogues.length) {
                        this.textBox.innerHTML += this.arrowHtml;
                        this.textBox.scrollTop = this.textBox.scrollHeight;
                    }
                    // auto skip
                    if (this.autoSkip) {
                        this.isAuto = true;
                        setTimeout(this.next.bind(this), 1000);
                    }
                    // check for end of dialogue since next() is not called
                    if (this.currentDialogue >= this.dialogues.length) {
                        this.isFinished = true;
                    }
                }
            }
        }
        requestAnimationFrame(this.updateText.bind(this));
    }

    // Methods
    startFromOrigin() {
        // call this method to start the dialogue
        this.dialogueElement.style.zIndex = 1000;
        this.dialogueElement.style.opacity = 1;
        this.isTyping = true;
        this.currentText = 0;
        this.updateText(0);
        this.textBox.addEventListener("click", this.next);
    }

    stop() {
        // call this method to stop the dialogue
        this.isTyping = false;
    }

    resume() {
        // resume
        this.isTyping = true;
    }

    reset() {
        // reset to the first dialogue
        this.currentDialogue = 0;
        this.currentText = 0;
        this.isTyping = false;
        this.isAuto = false;
    }

    destroy() {
        // remove the dialogue
        this.parent.removeChild(this.dialogueElement);
        document.head.removeChild(this.styleSheet);
        this.sfx.pause();
        this.sfx.currentTime = 0;
    }

    // Event Handlers
    next() {
        console.log("next");
        if (this.isFinished) {
            this.callback();
            return;
        }
        // Skip user input if auto skip is enabled
        if (this.isAuto) {
            return;
        }

        // Check if dialogue is at the end
        if (this.currentDialogue >= this.dialogues.length) {
            this.isFinished = true;
            return;
        }

        // Divide time delay by 2 if user clicks while typing
        if (this.isTyping) {
            this.timeDelay = this.timeDelay / 2;
            return;
        }

        // Reset to the first letter of the next dialogue
        this.currentText = 0;
        this.isTyping = true;
    }
}