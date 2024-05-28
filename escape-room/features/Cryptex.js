class Cryptex {
    constructor(parentDiv, nRings, goodAnswer, callback) {
        this.parentDiv = parentDiv;
        this.nRings = nRings;
        this.answer = [];
        this.goodAnswer = goodAnswer;
        this.callback = callback;
        this.canvas = document.createElement('canvas');
        this.canvas.classList.add('cryptexCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.parentDiv.appendChild(this.canvas);
        this.pts = []; // [{x:0, y:0}]
        // this.createCryptex();
        this.init();
    }

    init(){
        this.pts = [
            {x:120, y:95},
            {x:120, y:365},
            {x:250, y:95},
            {x:250, y:365},
            {x:370, y:95},
            {x:370, y:365},
            {x:495, y:95},
            {x:495, y:365},
        ];
        this.canvas.width = 614;
        this.canvas.height = 461;
        this.bgImage = new Image();
        this.bgImage.src = './features/public/images/cryptx-pzl.png';
        this.bgImage.onload = () => {
            this.ctx.drawImage(this.bgImage, 0, 0, this.canvas.width, this.canvas.height);
            this.ctx.font = '30px ending';
            this.ctx.fillStyle = 'black';
            this.ctx.fillText('0', 119, 240);
            this.answer[0] = 0;
            this.ctx.fillText('0', 239, 240);
            this.answer[1] = 0;
            this.ctx.fillText('0', 360, 240);
            this.answer[2] = 0;
            this.ctx.fillText('0', 483, 240);
            this.answer[3] = 0;
        }
        const styles = `
                .cryptexCanvas {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    z-index: 100;
                }
        }`
        this.styleSheet = document.createElement('style');
        this.styleSheet.innerHTML = styles;
        document.head.appendChild(this.styleSheet);

        this.canvas.addEventListener('click', this.handleClick.bind(this));

    }

    handleClick(e) {
        const {offsetX, offsetY} = e;
        const closestPt = this.getClosestPoint(offsetX, offsetY);
        if (closestPt === null) return;
        if (closestPt === this.pts[0]){
            this.answer[0] = this.answer[0] + 1;
        } else if (closestPt === this.pts[1]){
            this.answer[0] = this.answer[0] - 1;
        } else if (closestPt === this.pts[2]){
            this.answer[1] = this.answer[1] + 1;
        } else if (closestPt === this.pts[3]){
            this.answer[1] = this.answer[1] - 1;
        } else if (closestPt === this.pts[4]){
            this.answer[2] = this.answer[2] + 1;
        } else if (closestPt === this.pts[5]){
            this.answer[2] = this.answer[2] - 1;
        } else if (closestPt === this.pts[6]){
            this.answer[3] = this.answer[3] + 1;
        } else if (closestPt === this.pts[7]){
            this.answer[3] = this.answer[3] - 1;
        }

        for (const i of this.answer){
            if (i < 0){
                this.answer[this.answer.indexOf(i)] = 9;
            }
            if (i > 9){
                this.answer[this.answer.indexOf(i)] = 0;
            }
        }

        this.redraw();
        this.checkAnswer();
    }

    getClosestPoint(x, y) {
        let closestPt = null;
        const maxDist = 30;
        for (const pt of this.pts){
            const dist = Math.hypot(pt.x - x, pt.y - y);
            if (dist < maxDist){
                closestPt = pt;
                break;
            }
        }
        return closestPt;
    }

    redraw(){
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.drawImage(this.bgImage, 0, 0, this.canvas.width, this.canvas.height);
        this.ctx.font = '30px ending';
        this.ctx.fillStyle = 'black';
        this.ctx.fillText(this.answer[0], 119, 240);
        this.ctx.fillText(this.answer[1], 239, 240);
        this.ctx.fillText(this.answer[2], 360, 240);
        this.ctx.fillText(this.answer[3], 483, 240);
    }

    checkAnswer(){
        console.log(this.answer, this.goodAnswer);
        if(this.answer[0] === this.goodAnswer[0] && this.answer[1] === this.goodAnswer[1] && this.answer[2] === this.goodAnswer[2] && this.answer[3] === this.goodAnswer[3]){
            this.callback();
        }
    }

    destroy(){
        this.canvas.removeEventListener('click', this.handleClick.bind(this));
        this.parentDiv.removeChild(this.canvas);
        this.styleSheet.remove();
    }

    // createCryptex() {
    //     let link = document.createElement('link');
    //     link.rel = 'stylesheet';
    //     link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css';
    //     link.integrity = 'sha512-SnH5WK+bZxgPHs44uWIX+LLJAJ9/2PkPKZ5QiAj6Ta86w+fsb2TkcmfRyVX3pBnMFcV7oQPJkl9QevSCWr3W6A==';
    //     link.crossOrigin = 'anonymous';
    //     link.referrerPolicy = 'no-referrer';
    //     document.head.appendChild(link);
    //
    //     for (let i = 0; i < this.nRings; i++) {
    //         const ring = document.createElement('div');
    //         ring.className = 'ring';
    //         ring.id = 'ring' + i;
    //
    //         const upButton = document.createElement('div');
    //         upButton.className = 'cryptexButton';
    //         upButton.id = 'upButton' + i;
    //         upButton.onclick = () => this.handleClick(i, 'up');
    //         const upIcon = document.createElement('i');
    //         upIcon.className = 'fa-solid fa-caret-up';
    //         upButton.appendChild(upIcon);
    //         ring.appendChild(upButton);
    //
    //         const ringInner = document.createElement('div');
    //         ringInner.className = 'ringInner';
    //         ringInner.id = 'ringInner' + i;
    //         ring.appendChild(ringInner);
    //         ringInner.innerHTML = 0;
    //
    //         const downButton = document.createElement('div');
    //         downButton.className = 'cryptexButton';
    //         downButton.id = 'downButton' + i;
    //         downButton.onclick = () => this.handleClick(i, 'down');
    //         const downIcon = document.createElement('i');
    //         downIcon.className = 'fa-solid fa-caret-down';
    //         downButton.appendChild(downIcon);
    //         ring.appendChild(downButton);
    //
    //         this.answer[i] = 0;
    //
    //         this.parentDiv.appendChild(ring);
    //     }
    //
    //     const styles = `
    //             .cryptex {
    //                 display: flex;
    //                 flex-direction: row;
    //                 gap: 10px;
    //                 margin: 10px;
    //             }
    //
    //             .ring {
    //               display:flex;
    //               flex-direction: column;
    //               justify-content: center;
    //               align-items: center;
    //             }
    //
    //             .cryptexButton{
    //               font-size: 4rem;
    //               color: black;
    //               margin: 2px;
    //               transition: all 100ms;
    //             }
    //
    //             .cryptexButton:hover{
    //               transform: scale(1.3);
    //             }
    //
    //             .cryptexButton:active{
    //               transform: scale(1.5);
    //               color:lightblue;
    //             }`;
    //     const styleSheet = document.createElement("style");
    //     styleSheet.innerText = styles;
    //     document.head.appendChild(styleSheet);
    // }
    //
    // handleClick(n, dir){
    //     const e = document.getElementById('ringInner' + n);
    //     this.answer[n] = this.answer[n] + (dir === "up" ? 1:-1);
    //     e.innerHTML = this.answer[n];
    //     this.checkAnswer();
    // }
    //
    // checkAnswer(){
    //     for (let i = 0; i < this.nRings; i++) {
    //         if (this.answer[i] !== this.goodAnswer[i]){
    //             return false;
    //         }
    //     }
    //     this.callback();
    //     return true;
    // }
    //
    // destroy(){
    //     this.parentDiv.innerHTML = '';
    // }
}