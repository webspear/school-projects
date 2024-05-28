class Inventory{
    constructor(parentDiv, styles, nSlots) {
        this.parentDiv = parentDiv;
        this.styles = styles;
        this.nSlots = nSlots;

        this.isShown = true;
        this.init();
    }

    init(){
        this.items = [];
        this.slotElements = [];
        this.hotbarWrapper = document.createElement('div');
        this.hotbarWrapper.id = "hotbarWrapper";
        this.hotbarWrapper.className = "hotbarWrapper";
        this.parentDiv.appendChild(this.hotbarWrapper);

        for (let i = 0; i < this.nSlots; i++){
            let e  = document.createElement('div');
            e.id = "slot"+i;
            e.className = "hotbarSlot";
            e = new Draggable(e, null, this);
            this.hotbarWrapper.appendChild(e.element);
            this.slotElements.push(e);
        }

        const styles = `
        .hotbarWrapper{
          position: absolute;
          border: 3px solid black;
          display: flex;
          flex-direction: column;
          width: fit-content;
          top:50%;
          left:1%;
          /* right: 0; */
          transform: translate(0,-50%);
          margin:10px;
          transition: left 200ms;
          z-index: 200;
          keyboard-events: none;
        }
        .hotbarSlot{
          position: relative;
          width: 75px;
          height: 75px;
          border: 5px solid black;
          margin: 2px;
          transition: transform 200ms;
          background-color: transparent;
          z-index: 199;
        }
        .hotbarSlot:hover{
          transform: scale(1.3);
          // z-index: 200;
        }
        `
        this.styleSheet = document.createElement("style");
        this.styleSheet.innerText = styles;
        document.head.appendChild(this.styleSheet);
    }

    addItem(item){
        // check for empty slots
        if (this.items.length >= this.nSlots){
            console.log("Inventory full");
            return;
        }

        // add item to inventory
        this.items.push(item);
        const currIndex = this.items.length - 1;
        this.slotElements[currIndex].element.innerHTML = item.img;
        this.slotElements[currIndex].item = item;
        this.normalize();
    }

    removeItem(item){
        const index = this.items.indexOf(item);
        if (index > -1) {
            // if (!index) return;
            this.items[index] = null;
            this.slotElements[index].element.innerHTML = "";
            // this.slotElements[index].dragElement.innerHTML = "";
            // console.log(this.slotElements[index].dragElement);
            // if (this.slotElements[index].dragElement){
            //     this.slotElements[index].dragElement.remove();
            //     this.slotElements[index].dragElement = null;
            // }
        }
        this.normalize();
    }

    normalize(){
        for (const e of this.slotElements){
            e.element.innerHTML = "";
            e.isDraggable = false;
        }
        this.items = this.items.filter(item => item !== null);
        this.items.forEach((item, i) => {
            this.slotElements[i].element.innerHTML = item.img;
            this.slotElements[i].isDraggable = true;
        });
    }

    clear(){
        this.items = [];
        this.normalize();
    }

    hide(){
        this.hotbarWrapper.style.left = '-400px';
        this.isShown = false;
    }

    show(){
        this.hotbarWrapper.style.left = '1%';
        this.isShown = true;
    }

    toggle(){
        if (this.isShown){
            this.hide();
        } else {
            this.show();
        }
    }
}

class Item{
    constructor(img, name, description, parent){
        this.name = name;
        this.description = description;
        this.imgSrc = img;
        this.img = `<img src="${this.imgSrc.url}" alt="${this.name}" width="100%" height="100%">`;
    }
}

class Draggable{
    static isGlobalDragging = false;
    static dropZones = [];
    constructor(element, item, inv){
        this.element = element;
        this.dragElement = null;
        this.item = item;
        this.inv = inv;
        this.isDragging = false;

        this.handleMouseDown = this.handleMouseDown.bind(this);
        this.handleMouseUp = this.handleMouseUp.bind(this);
        this.handleMouseMove = this.handleMouseMove.bind(this);

        this.isDraggable = false;
        this.init();
    }

    init(){
        this.element.draggable = false;
        this.element.addEventListener('mousedown', this.handleMouseDown.bind(this));
        document.addEventListener('mouseup', this.handleMouseUp.bind(this));
    }

    handleMouseDown(e){
        if (Draggable.isGlobalDragging){
            return;
        }

        if (!this.isDraggable){
            return;
        }
        e.preventDefault();

        this.isDragging = true;
        const slotId = this.element.id.replace("slot", "");
        const tempElement = this.element.cloneNode(true);
        tempElement.draggable = false;
        tempElement.id = "dragElement-" + tempElement.id;
        this.dragElement = tempElement.cloneNode(true);
        this.dragElement.style.position = 'absolute';
        this.dragElement.style.left = e.clientX+10+'px';
        this.dragElement.style.top = e.clientY+10+'px';
        document.body.appendChild(this.dragElement);
        this.highlight();
        document.addEventListener('mousemove', this.handleMouseMove, true);
        console.log("SlotID", slotId);
        this.item = this.inv.items[slotId];
    }

    handleMouseMove(e){
        if (!this.isDraggable){
            return;
        }

        if (!this.isDragging){
            return;
        }

        this.dragElement.style.left = e.clientX+10+'px';
        this.dragElement.style.top = e.clientY+10+'px';
        const dropZone = this.getClosestDropZone();
        if (dropZone.length === 0){
            this.unhighlightDropZones();
            return;
        }
        for (const e of dropZone) {
            e.object.element.style.border = '5px dashed rgb(99, 99, 102)';
            dropZone[0].object.element.style.border = '5px dashed #007AFF';
        }
        this.getClosestDropZone();
    }

    handleMouseUp(e) {
        if (!this.isDragging){
            return;
        }
        if (!this.isDraggable){
            return;
        }

        if (this.dragElement) {
            this.dragElement.style.transition = 'left 0.5s, top 0.5s';

            const dropZone = this.getClosestDropZone();
            if (dropZone.length === 0){
                this.dragElement.remove();
                this.dragElement = null;
                Draggable.isGlobalDragging = false;
                this.unhighlight();
                document.removeEventListener('mousemove', this.handleMouseMove, true);
                this.isDragging = false;
                this.unhighlightDropZones();
                return;
            }

            if (dropZone[0].object.items.length >= 1){
                console.log("Slot full");
                this.dragElement.remove();
                this.dragElement = null;
                Draggable.isGlobalDragging = false;
                this.unhighlight();
                document.removeEventListener('mousemove', this.handleMouseMove, true);
                this.isDragging = false;
                this.unhighlightDropZones();
                return;
            }

            this.unhighlightDropZones();
            document.removeEventListener('mousemove', this.handleMouseMove, true);
            // remove the scale css on hover
            // this.dragElement.style.transition = '';

            const rect = this.dragElement.getBoundingClientRect();
            const targetRect = dropZone[0].object.element.getBoundingClientRect();
            const finalCoord = {
                x: targetRect.x + targetRect.width / 2 - rect.width / 2 ,
                y: targetRect.y + targetRect.height / 2 - rect.height / 2
            };

            this.dragElement.style.left = finalCoord.x  + 'px'; // finalCoord.x - (rect.width / 2)
            this.dragElement.style.top = finalCoord.y + 'px';

            dropZone[0].object.items.push(this.item);
            setTimeout(() => {
                this.dragElement.style.left = finalCoord.x  + 'px'; // finalCoord.x - (rect.width / 2)
                this.dragElement.style.top = finalCoord.y + 'px'; // finalCoord.y - (rect.height / 2)
            }, 0);
            this.inv.removeItem(this.item);
            Draggable.isGlobalDragging = false;
            this.unhighlight();
            this.isDragging = false;
            dropZone[0].object.callback();
        }
    }

    getClosestDropZone(){
        const MAXDIST = 500;

        let closestDropZones = [];
        for (const dropZone of Draggable.dropZones){
            const center = this.getCenter();
            const dropZoneRect = dropZone.element.getBoundingClientRect();

            const dropZoneCenter = {x:dropZoneRect.left+dropZoneRect.width/2, y:dropZoneRect.top+dropZoneRect.height/2};
            const dist = Math.hypot(Math.abs(center.x - dropZoneCenter.x), Math.abs(center.y - dropZoneCenter.y));
            if (dist < MAXDIST){
                closestDropZones.push({object:dropZone, dist:dist});
            }
        }
        return closestDropZones.sort((a, b) => a.dist - b.dist);
    }

    getCenter(){
        const boundingRect = this.dragElement.getBoundingClientRect();
        return {
            x: boundingRect.left+boundingRect.width/ 2,
            y: boundingRect.top+boundingRect.height / 2
        }
    }

    highlight(){
        this.element.style.border = '5px dashed #007AFF';
    }

    unhighlight() {
        this.element.style.border = '5px solid black';
    }

    unhighlightDropZones(){
        for (const e of Draggable.dropZones){
            e.element.style.border = '5px solid rgb(99, 99, 102)';
        }

    }
}

class DropZone{
    constructor(width, height, x, y, parentDiv, callback) {
        this.width = width;
        this.height = height;
        this.x = x;
        this.y = y;
        this.parentDiv = parentDiv;
        this.items = [];
        this.callback = callback;
        this.init();
        Draggable.dropZones.push(this);
    }

    init(){
        this.element = document.createElement('div');
        this.element.style.position = 'absolute';
        this.element.style.width = this.width + 'px';
        this.element.style.height = this.height + 'px';
        this.element.style.left = this.x + this.width/2 + 'px';
        this.element.style.top = this.y + this.height/2 + 'px';
        this.element.className = "dropZones";
        this.parentDiv.appendChild(this.element);

        // #007AFF
        const styles = `
        .dropZones{
            position: relative;
            border: 5px solid rgb(99, 99, 102);
            border-radius: 10px;
            background-color: transparent;
            pointer-events: none;
             transition: border-style 0.5s, border-color 0.5s;
        }
        `
        const styleSheet = document.createElement("style");
        styleSheet.innerText = styles;
        document.head.appendChild(styleSheet);
    }
    destroy(){
        this.element.remove();
        this.element.innerHTML = '';
        Draggable.dropZones = Draggable.dropZones.filter(e => e !== this);
    }
}
