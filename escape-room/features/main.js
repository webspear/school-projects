import './style.css'
import Inventory, {DropZone, Item} from "./Inventory.js";
import Crafting from "./Crafting.js";

const parent = document.getElementById('Cryptex')

// const electrical = new ElectricalPuzzle(parent, 500, 500, {
//     wireWidth: 10,
//     wireHeight: 20,
//     bgColor: 'black'
// });

const inv = new Inventory(parent, {}, 8);
// const item1 = new Item({url: 'https://picsum.photos/50'}, 'item1', 'description', inv, 1);
// const item2 = new Item({url: 'https://picsum.photos/50'}, 'item2', 'description', inv, 1);
// const item3 = new Item({url: 'https://picsum.photos/50'}, 'item3', 'description', inv, 1);
// const item4 = new Item({url: 'https://picsum.photos/50'}, 'item4', 'description', inv, 2);
// const item5 = new Item({url: 'https://picsum.photos/50'}, 'item5', 'description', inv, 2);
// const item6 = new Item({url: 'https://picsum.photos/50'}, 'item6', 'description', inv, 2);
// const item7 = new Item({url: 'https://picsum.photos/50'}, 'item7', 'description', inv, 3);
// const item8 = new Item({url: 'https://picsum.photos/50'}, 'item8', 'description', inv, 3);
//
// inv.addItem(item1);
// inv.addItem(item2);
// inv.addItem(item3);
// inv.addItem(item4);
// inv.addItem(item5);
// inv.addItem(item6);
// inv.addItem(item7);
// inv.addItem(item8);
// inv.normalize();
// // inv.removeItem(item2);
//
// const dropZone = new DropZone(100, 100, 500, 500, parent);
// const dropZone2 = new DropZone(100, 100, 200, 300, parent);
// const dropZone3 = new DropZone(100, 100, 200, 200, parent);
// const dropZone4 = new DropZone(100, 100, 400, 400, parent);
// const dropZone5 = new DropZone(100, 100, 300, 300, parent);

// function generatePoints(radius, xOffset, yOffset, nSide = 3) {
//     let points = [];
//     for (let i = 0; i < nSide; i++) {
//         let angleRad = degToRad(-90) + (2 * Math.PI / nSide) * i;
//         let x = xOffset + radius * Math.cos(angleRad);
//         let y = yOffset + radius * Math.sin(angleRad);
//         points.push({ x, y });
//     }
//     return points;
// }
//
// function degToRad(deg) {
//     return deg * (Math.PI / 180);
// }
//
// const points = generatePoints(400, window.innerWidth/2, window.innerHeight/2, 5);
//
// for (const e of points){
//     const dropZone = new DropZone(100, 100, e.x-100, e.y-100, parent);
// }
// const dropzonev2 = new DropZone(100, 100, window.innerWidth/2-100, window.innerHeight/2-100, parent);

const crafting = new Crafting(inv, ['item1', 'item2'], () => {
    console.log('recipe found, callback');
}, 5, 100, 100, parent);

for (let i = 0; i<7; i++){
    const item = new Item({url: 'https://picsum.photos/50'}, 'item'+i, 'description', inv, 1);
    inv.addItem(item);
}
inv.normalize();