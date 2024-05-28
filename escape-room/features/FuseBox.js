class FuseBox {
    constructor(parentDiv, x, y, width, height, item, callback) {
        this.parentDiv = parentDiv;
        this.item = item;
        this.callback = callback;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.init();
    }

    init(){
        this.image = new Image();
        this.image.src = './features/public/images/fuse-pzl.png';
        this.image.onload = () => {
            this.parentDiv.appendChild(this.image);
            this.image.style.position = 'absolute';
            this.image.style.top = '50%';
            this.image.style.left = '50%';
            this.image.style.transform = 'translate(-50%, -50%)';
            this.image.height = '700';
            this.image.style.zIndex = this.dropZone.element.style.zIndex-1;

        }
        this.dropZone = new DropZone(this.width, this.height, this.x, this.y, this.parentDiv, this.checkForItem.bind(this));
    }

    checkForItem(){
        if (this.dropZone.items.length > 0){
            if (this.dropZone.items[0].name === this.item.name){
                this.callback();
                return true;
            }
        }
        return false;
    }

    destroy(){
        this.dropZone.destroy();
        this.parentDiv.innerHTML = '';
    }
}