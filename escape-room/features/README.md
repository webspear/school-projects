# hex-grid-TEST  
Test of a hex grid drawing and patterns in js  
```bash
npm i
npm run dev
```

# Docs
## HexGrid
```js
const grid = new HexGrid(radius, xOffset, yOffset, true, document.body, window.innerWidth, window.innerHeight, {bgColor: '#181825', dotColor: '#fff', lineColor: '#fff', lineWidth: 5, lineCap: 'round', dotRadius: 3, goodDotColor: '#00ff00', badDotColor: '#ff0000'});
```
## Cyptex
```js
import Cryptex from './Cryptex.js';
const parentDiv = document.getElementById('Cryptex');
const goodAnswer = [1, 2, 3, 4, 5];
const cryptex = new Cryptex(parentDiv, 5, goodAnswer, () => {
    console.log('You did it!');
    cryptex.destroy();
});
```
### Constructor
```js
new Cryptex(parentDiv, nRings, goodAnswer, callback); // HTML E, int, Arr, func
```
### Methods
```js
cryptex.destroy(); // destroy

cryptex.checkAnswer() // check if the answer is correct, true if correct, false if not
```
## Dialogue
```js
import Dialogue from './Dialogue.js';
const dialogueText = [
    {
        name: 'Flagellum Dei',
        text: 'For I am Attila the Hun, the scourge of God. If you had not committed great sins, God would not have sent a punishment like me upon you.'
    },
    {
        name: 'Flagellum Dei',
        text: 'Shame on you for your despicable sins and your great wickedness. You have brought great suffering upon yourselves.'
    },
    {
        name: 'Flagellum Dei',
        text: 'Now eat this sucker!'
    }
]

const Dialogue1 = new Dialogue(dialogueText, 40, false, 'audio/click.ogg', parent, () => {
    console.log('done');
    Dialogue1.destroy();
});

Dialogue1.startFromOrigin();
```
### Constructor
```js
new Dialogue(dialogueText, timePerLetter, autoSkip, srcToAudio, parentElement, callback); // Arr, int, bool, str, E, func

dialogueText = [
    {name: 'Name', text: 'Text'},
    {name: 'Name', text: 'Text'}, //.. etc
]
```
### Methods
```js
startFromOrigin(); // start the dialogue from the beginning

stop(); // stop the dialogue

resume(); // resume the dialogue where it stopped

reset(); // reset the dialogue to the beginning of everything

destroy(); // destroy the dialogue
```
## Crafting
```js
import Crafting from './Crafting.js';
import Inventory from './Inventory.js';
const parent = document.getElementById('Crafting');
const crafting = new Crafting(inv, ['item1', 'item2'], () => {
    console.log('recipe found, callback');
}, 5, 100, 100, parent);
```
### Constructor
```js
new Crafting(inventory, recipe, callback, nSlots, width, height, parentElement); // Inv, Arr, func, int, int, int, E
callback = () => {} // function to call when the recipe is found
recipe = ['item1', 'item2', 'item3', ...] // list of name of items
width, height = int // size of the dropping box
```
### Methods
```js
crafting.destroy(); // destroy
crafting.checkRecipe(); // check if the recipe is correct, true if correct, false if not
// check recipe also calls the callback if the recipe is correct
```
## Inventory
```js
import Inventory, {Item} from "./Inventory.js";
const parent = document.getElementById('Inventory');
const inv = new Inventory(parent, {}, 8);

const item = new Item({url: 'https://picsum.photos/50'}, 'item6', 'description', inv, 2);
inv.addItem(item);
inv.normalize();
```
### Constructor
```js
new Inventory(parentElement, styles, nSlots); // E, Obj, int 
nSlots = int // number of slots
styles = {} // styles for the inv, nothing for now
```
### Methods
```js
inv.addItem(item); // add an item to the inventory, must be class Item
inv.removeItem(item); // remove an item from the inventory
inv.normalize(); // normalize the inventory (Make items draggable and trim the empty slots)

inv.clear(); // clear the inventory
inv.show(); // show the inventory
inv.hide(); // hide the inventory
```
## Item
```js
import Inventory, {Item} from "./Inventory.js";
const parent = document.getElementById('Inventory');
const inv = new Inventory(parent, {}, 8);
const item = new Item({url: 'https://picsum.photos/50'}, 'item6', 'description', inv, 2);
inv.addItem(item);
inv.normalize();
```
### Constructor
```js
new Item({url: 'url'}, name, description, inventory, quantity); // Obj, str, str, Inv, int
url = str // url to the image
inventory = parentInv // the inventory where the item is
// note: Quantity is not yet implemented
```
### Methods
```js
Nothing yet...
```
## DropZone
```js
import {DropZone} from './Inventory.js';
const dropZone = new DropZone(100, 100, 500, 500, parent);
```
### Constructor
```js
new DropZone(width, height, x, y, parentElement, callback); // int, int, int, int, E, func
callback = () => {} // function to call when an item is dropped in the zone
width, height, x, y = int // size and position of the zone (bug here, the position is the bottom left corner)
```
### Methods
```js
Nothing yet...
```


