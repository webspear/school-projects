import Inventory from "./Inventory.js";
import {DropZone} from "./Inventory.js";
export default class Crafting{
    constructor(inventory, recipe, callback, nSlots, width, height, parent) {
        this.inventory = inventory;
        this.recipe = recipe;
        this.callback = callback;
        this.containedItems = [];
        this.width = width;
        this.height = height;
        this.parent = parent;

        this.dropZones = [];
        this.mainContainer = document.createElement('div');
        this.parent.appendChild(this.mainContainer);

        this.init();
    }

    init(){
        const points = this.generatePoints(400, window.innerWidth/2, window.innerHeight/2, 5);

        for (const e of points){
            const dropZone = new DropZone(this.width, this.height, e.x-this.width, e.y-this.height, this.mainContainer, this.checkForRecipe.bind(this));
            this.dropZones.push(dropZone);
        }
    }

    checkForRecipe(){
        let items = [];
        for (const dropZone of this.dropZones){
            if (dropZone.items.length > 0){
                items.push(dropZone);
            }
        }

        console.log(items);
        this.containedItems = items;

        const itemNameList = items.map(e => e.items[0].name);
        console.log(itemNameList);

        if (itemNameList.sort().toString() === this.recipe.sort().toString()){
            this.callback();
            console.log('recipe found');
            return true;
        }
        return false;
    }

    generatePoints(radius, xOffset, yOffset, nSide = 3) {
        let points = [];
        for (let i = 0; i < nSide; i++) {
            let angleRad = this.degToRad(-90) + (2 * Math.PI / nSide) * i;
            let x = xOffset + radius * Math.cos(angleRad);
            let y = yOffset + radius * Math.sin(angleRad);
            points.push({ x, y });
        }
        return points;
    }

    degToRad(deg) {
        return deg * (Math.PI / 180);
    }

    destroy(){
        this.mainContainer.innerHTML = '';
    }
}