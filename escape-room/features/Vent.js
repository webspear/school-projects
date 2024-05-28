class Vent {
    constructor(parent, callback, width =500, height =500) {
        this.width = width;
        this.height = height;
        this.parent = parent;
        this.callback = callback;

        this.ventCanvas = document.createElement('canvas');
        this.ventCanvas.width = 500;
        this.ventCanvas.height = 500;
        this.ventCtx = this.ventCanvas.getContext('2d');
        this.parent.appendChild(this.ventCanvas);
        this.ventCanvas.classList.add('ventCanvas');

        const styles = `
            .ventCanvas {
                position: absolute;
                top: 50%;
                left: 50%;
                width: ${this.width}px;
                height: ${this.height}px;
                transform: translate(-50%, -50%);
                z-index: 100;
                visibility: hidden;
            }
        `
        this.styleSheet = document.createElement('style');
        this.styleSheet.innerHTML = styles;
        document.head.appendChild(this.styleSheet);

        this.ventImage = new Image();
        this.ventImage.src = './features/public/images/vent.png';
        this.ventScrew = new Image();
        this.ventScrew.src = './features/public/images/vent-screw.png';

        this.init();
    }

    init(){
        this.ventImage.onload = () => {
            this.ventCtx.drawImage(this.ventImage, 0, 0, this.width, this.height);
        }
        this.ventScrew.onload = () => {
            this.pts = [
                {x: 30, y: 30},
                {x: 30, y: 430},
                {x: 430, y: 30},
                {x: 430, y: 430}
            ];
            for (const pt of this.pts){
                this.ventCtx.drawImage(this.ventScrew, pt.x, pt.y, 500/15, 500/15);
            }
        }

        this.ventCanvas.addEventListener('click', this.handleClick.bind(this));
    }

    handleClick(e){
        const {offsetX, offsetY} = e;
        const closestPt = this.getClosestPoint(offsetX, offsetY);
        if (closestPt === null) return;
        this.pts.splice(this.pts.indexOf(closestPt), 1);
        this.redraw();
        interaction.play()
    }

    getClosestPoint(x, y) {
        let closestPt = null;
        const maxDist = 50;
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
        this.ventCtx.clearRect(0, 0, this.width, this.height);
        this.ventCtx.drawImage(this.ventImage, 0, 0, this.width, this.height);
        for (const pt of this.pts){
            this.ventCtx.drawImage(this.ventScrew, pt.x, pt.y, 500/15, 500/15);
        }

        if (this.pts.length === 0){
            this.callback();
        }
    }


}