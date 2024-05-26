class ElectricalPuzzle {
    constructor(parentDiv, width, height, styles) {
        this.parentDiv = parentDiv;
        this.width = width;
        this.height = height;
        this.styles = styles;
        this.init();
    }

    init(){
        this.bgCanvas = document.createElement('canvas');
        this.bgCanvas.width = this.width;
        this.bgCanvas.height = this.height;
        this.ctx = this.bgCanvas.getContext('2d');
        this.parentDiv.appendChild(this.bgCanvas);

        this.interactionCanvas = document.createElement('canvas');
        this.interactionCanvas.width = this.width;
        this.interactionCanvas.height = this.height;
        this.interactionCtx = this.interactionCanvas.getContext('2d');
        this.parentDiv.appendChild(this.interactionCanvas);
        this.interactionCanvas.addEventListener('click', this.handleClick);

        let initX = 10;
        let endY = 380;

        let arrColor = ['red', 'blue', 'green', 'yellow', 'purple']
        this.shuffleArray(arrColor);
        let bottomArr = [...arrColor];
        this.shuffleArray(arrColor);
        let topArr = [...arrColor];

        for (let i = 0; i < 5; i++){
            this.ctx.fillStyle = topArr[i];
            this.ctx.fillRect(initX, 0, this.styles.wireWidth, this.styles.wireHeight);
            this.ctx.fillStyle = "white";

            this.ctx.fillStyle = bottomArr[i];
            this.ctx.fillRect(initX, endY, this.styles.wireWidth, this.styles.wireHeight);

            initX += 100;
        }
    }

    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * i);
            const temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
    }

    handleClick(e) {

    }

    getClosestPoint(x, y) {

    }
}