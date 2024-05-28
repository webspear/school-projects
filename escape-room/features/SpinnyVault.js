class SpinnyVault{
    constructor(parent, x, y, src, nTimes, callback, accel = 0.1, speedLimit = 2) {
        this.x = x;
        this.y = y;
        this.src = src;
        this.parent = parent;
        this.callback = callback;

        this.rotation = 0;
        this.direction = 1;
        this.speed = 0;
        this.acceleration = accel;
        this.speedLimit = speedLimit;

        this.goodTimes = 0; // withscar
        this.nTimes = nTimes;

        this.init();
    }

    init(){
        this.bgImage = document.createElement('img');
        this.bgImage.src = './features/public/images/vault-pzl.png';
        this.bgImage.style.width = '50%';
        this.bgImage.style.height = 'fit-content';
        this.bgImage.style.position = 'absolute';
        this.bgImage.style.top = '50%';
        this.bgImage.style.left = '50%';
        this.bgImage.style.transform = 'translate(-50%, -50%)';
        this.bgImage.useMap = '#image-map';
        this.bgImage.zIndex = 10;
        this.parent.appendChild(this.bgImage);

        this.mapResizerJS = document.createElement('script');
        this.mapResizerJS.src = './features/public/external/imageMapResizer.min.js';
        document.head.appendChild(this.mapResizerJS);

        this.mapResizerJS.onload = () => {
            console.log('loaded');
            imageMapResize();

        }

        this.mainMap = document.createElement('map');
        this.mainMap.name = 'image-map';
        this.mainMap.id = 'image-map';
        this.bgImage.appendChild(this.mainMap);
        this.mapArea = document.createElement('area');
        this.mapArea.target = '';
        this.mapArea.alt = 'spin button';
        this.mapArea.title = '';
        this.mapArea.coords = '139,231,191,281';
        this.mapArea.shape = 'rect';
        this.mainMap.appendChild(this.mapArea);
        this.mapArea.addEventListener('click', this.clickHandler.bind(this));

        this.mainWrapper = document.createElement('div');
        this.mainWrapper.classList.add('spinnyVaultWrapper');
        this.parent.appendChild(this.mainWrapper);

        this.img = document.createElement('img');
        this.img.src = this.src;
        this.img.style.width = '25%';
        // this.img.style.height = '25%';
        this.img.style.position = 'absolute';
        this.img.style.top = '23vh';
        this.img.style.left = '50%';
        // this.img.style.transform = 'translate(-50%, -50%)';
        this.parent.appendChild(this.img);

        this.resize();
        document.addEventListener('resize', this.resize.bind(this));

        const styles = `
            .spinnyVaultWrapper{
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                gap: 10px;
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                pointer-events: none;
            }
            
            .spinnyVaultWrapper img{
                margin: 4em;
            }
            
            #rotateButton{
                // width: 100px;
                // height: 50px;
                font-size: 1.5em;
                background: #D3D3D3;
                border: none;
                color: #000;
                text-align: center;
                text-decoration: none;
                display: inline-block;
                transition-duration: 0.4s;
                cursor: pointer;
            }
            
            #rotateButton:hover {
                background-color: #3e8e41;
                color: white;
            }
    
            
            #indicatorDiv{
                display: flex;
                flex-direction: row;
                justify-content: center;
                align-items: center;
                // gap: 10px;
            }
            #indicatorText{
                // font-size: 1.5em;
                margin-right: 10px;
            }
        `
        this.styleSheet = document.createElement("style");
        this.styleSheet.innerText = styles;
        document.head.appendChild(this.styleSheet);

        setTimeout(() => {
            this.rotate();
        }, 1000);
    }

    rotate(){
        this.speed += this.acceleration * this.direction;

        // Cap the speed
        if (Math.abs(this.speed) > this.speedLimit) {
            this.speed = this.speedLimit * Math.sign(this.speed);
        }

        this.rotation += this.speed;
        this.img.style.transform = `rotate(${this.rotation}deg)`;

        const angle = this.getAngleFromCoterminal(this.rotation);
        if (!this.correctAngle) {
            this.correctAngle = this.getAngleFromCoterminal(this.genRandomDeg() +  this.direction*angle+240);
        }
        if (angle < this.correctAngle - 60 || angle > this.correctAngle + 60){
            this.bgImage.src = './features/public/images/vault-pzl_red.png';
        } else{
            this.bgImage.src = './features/public/images/vault-pzl_green.png';
        }
        requestAnimationFrame(this.rotate.bind(this));
    }

    clickHandler(e){
        this.direction *= -1;
        if (this.bgImage.src.includes('green')){
            this.goodTimes++;
            console.log("suceeded", this.goodTimes);
            if (this.goodTimes === this.nTimes){
                this.callback();
            }
        } else {
            this.goodTimes = 0;
        }
        if (this.correctAngle){
            this.correctAngle=null;
            this.bgImage.src = './features/public/images/vault-pzl_red.png';
        }
    }

    destroy() {
        this.parent.innerHTML = '';
    }

    genRandomDeg(){
        return Math.floor(Math.random() * 360);
    }

    getAngleFromCoterminal(angle){
        return Math.abs(angle % 360);
    }

    resize(){
        this.img.style.transform = `translate(-50%, -50%)`;
        const rect = this.img.getBoundingClientRect();
        this.img.style.left = `${rect.left}px`;
        this.img.style.top = `${rect.top}px`;
        this.img.style.transform = "";
    }
}