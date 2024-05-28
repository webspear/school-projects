class ElectricalPuzzle {
    constructor(parentDiv, width, height, styles, calback) {
        this.parentDiv = parentDiv;
        this.width = width;
        this.height = height;
        this.styles = styles;
        this.points = {top: [], bottom: []};
        this.callback = calback;
        this.completed = [];
        this.handleMouseMove = this.handleMouseMove.bind(this);
        this.bgImage = new Image();
        this.bgImage.src = './features/public/images/electrical-wire-pzl.png';
        this.bgCanvas = document.createElement('canvas');
        this.bgCanvas.width = this.width;
        this.bgCanvas.height = this.height;
        this.ctx = this.bgCanvas.getContext('2d');
        this.parentDiv.appendChild(this.bgCanvas);
        this.bgCanvas.id = 'Electrical-bgCanvas';

        this.interactionCanvas = document.createElement('canvas');
        this.interactionCanvas.width = this.width;
        this.interactionCanvas.height = this.height;
        this.interactionCtx = this.interactionCanvas.getContext('2d');
        this.parentDiv.appendChild(this.interactionCanvas);
        this.interactionCanvas.id = 'Electrical-interactionCanvas';

        this.bgImage.onload = () => {
            this.bgCanvas.width = this.width;
            this.bgCanvas.height = this.height;
            this.ctx.drawImage(this.bgImage, 0, 0, this.width, this.height);
            this.init();
        }
    }

    init(){
        this.interactionCanvas.addEventListener('click', this.handleClick.bind(this));

        // this.ctx.fillStyle = this.styles.bgColor;
        // this.ctx.fillRect(0, 0, this.width, this.height);

        // let initX = 10;
        const initY = 28;
        let endY = this.interactionCanvas.height-this.styles.wireHeight;

        let arrColor = ['red', 'blue', 'green', 'yellow', 'purple']
        this.shuffleArray(arrColor);
        let bottomArr = [...arrColor];
        this.shuffleArray(arrColor);
        let topArr = [...arrColor];

        for (let i = 0; i < 5; i++){
            let initX = this.interactionCanvas.width/6*(i+1);
            this.ctx.fillStyle = topArr[i];
            this.ctx.fillRect(initX-this.styles.wireWidth/2, initY, this.styles.wireWidth, this.styles.wireHeight);
            this.ctx.fillStyle = "white";
            this.points.top.push({x: initX, y: this.styles.wireHeight+initY, color: topArr[i], isInteractable: true});
            this.drawCircle(20, initX, this.styles.wireHeight+initY, 'white', this.ctx)

            this.ctx.fillStyle = bottomArr[i];
            this.ctx.fillRect(initX-this.styles.wireWidth/2, endY-initY, this.styles.wireWidth, this.styles.wireHeight);
            this.ctx.fillStyle = "white";
            this.points.bottom.push({x: initX, y: endY-initY, color: bottomArr[i], isInteractable: true});
            this.drawCircle(20, initX, endY-initY, 'white', this.ctx)
        }

        const styles = `
            #Electrical-bgCanvas {
                border: 3px solid white;
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                z-index: 100;
            }
            #Electrical-interactionCanvas {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                z-index: 100;
            }
            `
        const styleSheet = document.createElement("style")
        styleSheet.innerText = styles;
        document.head.appendChild(styleSheet);
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
        const x = e.offsetX;
        const y = e.offsetY;
        const pts = this.getClosestPoints(x, y);

        if (pts.length === 0) return;

        console.log(x, y, pts);
        if (!this.currentPts && pts[0].isInteractable){
            this.currentPts = pts;
            this.interactionCanvas.addEventListener('mousemove', this.handleMouseMove, true);
        } else {
            if (!this.currentPts) return;
            if (this.currentPts[0].y === pts[0].y) return;
            if (!pts[0].isInteractable) return;
            if (this.currentPts[0].color !== pts[0].color) return;

            console.log(this.currentPts)
            this.ctx.beginPath();
            this.ctx.moveTo(pts[0].x, pts[0].y);
            this.ctx.strokeStyle = this.currentPts[0].color;
            this.ctx.lineWidth = 5;
            this.ctx.lineTo(this.currentPts[0].x, this.currentPts[0].y);
            this.ctx.stroke();
            this.ctx.closePath();
            this.interactionCanvas.removeEventListener('mousemove', this.handleMouseMove, true);
            this.interactionCtx.clearRect(0, 0, this.width, this.height);
            ['top', 'bottom'].forEach(key => {
                const found = this.points[key].find(e => e === pts[0] || e === this.currentPts[0]);
                if (found){
                    found.isInteractable = false;
                }
            });
            this.currentPts = null;
            this.redrawCircles(this.ctx);
            this.completed.push(pts[0].color);
            console.log(this.checkAnswer());
        }
    }

    handleMouseMove(e) {
        const pts = this.currentPts;
        this.interactionCtx.clearRect(0, 0, this.width, this.height);
        this.interactionCtx.beginPath();
        this.interactionCtx.moveTo(pts[0].x, pts[0].y);
        this.interactionCtx.strokeStyle = pts[0].color;
        this.interactionCtx.lineWidth = 5;
        this.interactionCtx.lineTo(e.offsetX, e.offsetY);
        this.interactionCtx.stroke();
        this.interactionCtx.closePath();
        this.redrawCircles(this.interactionCtx)
    }

    getClosestPoints(x, y) {
        const closestPoints = [];
        for (const point of this.points.top){
            let distance = Math.sqrt((point.x - x) ** 2 + (point.y - y) ** 2);
            if (distance < 10){
                closestPoints.push(point);
            }
        }
        for (const point of this.points.bottom){
            let distance = Math.sqrt((point.x - x) ** 2 + (point.y - y) ** 2);
            if (distance < 10){
                closestPoints.push(point);
            }
        }
        return closestPoints;
    }

    drawCircle(width, centerX, centerY, color, ctx){
        ctx.fillStyle = color;
        ctx.fillRect(centerX - width/2, centerY - width/2, width, width);
    }

    redrawCircles(ctx){
        for (const e of this.points.top){
            this.drawCircle(20, e.x, e.y, 'white', ctx)
        }
        for (const e of this.points.bottom){
            this.drawCircle(20, e.x, e.y, 'white', ctx)
        }
    }

    checkAnswer(){
        if (this.completed.length === 5){
            this.callback();
            return true;
        }
        return false;
    }

    destroy(){
        this.parentDiv.innerHTML = '';
    }
}