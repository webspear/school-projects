// collision blocks
let collisionBlocks = []
// interacting blocks
let interactables = []

const groundTop = new CollisionBlock({
    position: {
        x: 0,
        y: 584,
    },
    size: {
        width: 2560,
        height: 5,
    }
})
const groundMiddle = new CollisionBlock({
    position: {
        x: 0,
        y: 1280,
    },
    size: {
        width: 2016,
        height: 64,
    }
})
const groundBottom = new CollisionBlock({
    position: {
        x: 0,
        y: 1920,
    },
    size: {
        width: 2560,
        height: 5,
    }
})
const boundaryLeft = new CollisionBlock({
    position: {
        x: -10,
        y: 0,
    },
    size: {
        width: 10,
        height: 2560,
    }
})
const boundaryRight = new CollisionBlock({
    position: {
        x: 2560,
        y: 0,
    },
    size: {
        width: 10,
        height: 2560,
    }
})
const tube = new CollisionBlock({
    position: {
        x: 360,
        y: 960,
    },
    size: {
        width: 96,
        height: 320,
    }
})
const beakerLeft = new CollisionBlock({
    position: {
        x: 1472,
        y: 1096,
    },
    size: {
        width: 8,
        height: 184,
    }
})
const beakerRight = new CollisionBlock({
    position: {
        x: 1624,
        y: 1096,
    },
    size: {
        width: 8,
        height: 184,
    }
})
const beakerBottom = new CollisionBlock({
    position: {
        x: 1472,
        y: 1176,
    },
    size: {
        width: 160,
        height: 104,
    }
})
const vineTop = new CollisionBlock({
    position: {
        x: 456,
        y: 960,
    },
    size: {
        width: 128,
        height: 32,
    }
})
const counterShelf = new CollisionBlock({
    position: {
        x: 608,
        y: 1600,
    },
    size: {
        width: 768,
        height: 16,
    }
})
const counterShelfLeft = new CollisionBlock({
    position: {
        x: 576,
        y: 1344,
    },
    size: {
        width: 32,
        height: 272,
    }
})
const counterShelfRight = new CollisionBlock({
    position: {
        x: 1376,
        y: 1344,
    },
    size: {
        width: 32,
        height: 272,
    }
})
const boundaryMiddle = new CollisionBlock({
    position: {
        x: 2040,
        y: 1088,
    },
    size: {
        width: 16,
        height: 256,
    }
})
const plantTop = new CollisionBlock({
    position: {
        x: 1296,
        y: 416,
    },
    size: {
        width: 136,
        height: 168,
    }
})
const fallenBook = new CollisionBlock({
    position: {
        x: 1064,
        y: 512,
    },
    size: {
        width: 232,
        height: 72,
    }
})

// interactable places
const ladderVine = new Interactable({
    position: {
        x: 560,
        y: 880,
    },
    size: {
        width: 32,
        height: 400,
    },
    type: 'ladder',
})
const deployWire = new Interactable({
    position: {
        x: 1912,
        y: 1200,
    },
    size: {
        width: 72,
        height: 80,
    },
    type: 'puzzle',
})
const ladderWire = new Interactable({
    position: {
        x: 1984,
        y: 1200,
    },
    size: {
        width: 32,
        height: 720,
    },
    type: 'ladder',
})
const ventDoor = new Interactable({
    position: {
        x: 1688,
        y: 1736,
    },
    size: {
        width: 192,
        height: 184,
    },
    type: 'door',
})
const ventDoorTop = new Interactable({
    position: {
        x: 2536,
        y: 304,
    },
    size: {
        width: 24,
        height: 280,
    },
    type: 'door',
})
const pipeLadder = new Interactable({
    position: {
        x: 1104,
        y: 1442,
    },
    size: {
        width: 24,
        height: 488,
    },
    type: 'ladder',
})
const fuseBox = new Interactable({
    position: {
        x: 1504,
        y: 1728,
    },
    size: {
        width: 96,
        height: 192,
    },
    type: 'puzzle',
})
const vaultDoor = new Interactable({
    position: {
        x: 232,
        y: 1792,
    },
    size: {
        width: 64,
        height: 128,
    },
    type: 'puzzle',
})
const vaultKeypad = new Interactable({
    position: {
        x: 80,
        y: 1768,
    },
    size: {
        width: 80,
        height: 136,
    },
    type: 'puzzle',
})
const booksBelow = new Interactable({
    position: {
        x: 1208,
        y: 1368,
    },
    size: {
        width: 168,
        height: 232,
    },
    type: 'puzzle',
})
const noteBottom = new Interactable({
    position: {
        x: 736,
        y: 1808,
    },
    size: {
        width: 96,
        height: 112,
    },
    type: 'puzzle',
})
const noteMiddle = new Interactable({
    position: {
        x: 720,
        y: 1120,
    },
    size: {
        width: 96,
        height: 160,
    },
    type: 'puzzle',
})
const noteTop = new Interactable({
    position: {
        x: 424,
        y: 418,
    },
    size: {
        width: 96,
        height: 208,
    },
    type: 'puzzle',
})
const binderTop = new Interactable({
    position: {
        x: 664,
        y: 352,
    },
    size: {
        width: 328,
        height: 232,
    },
    type: 'puzzle',
})
const telescope = new Interactable({
    position: {
        x: 96,
        y: 400,
    },
    size: {
        width: 224,
        height: 184,
    },
    type: 'puzzle',
})
const boiler = new Interactable({
    position: {
        x: 48,
        y: 1152,
    },
    size: {
        width: 112,
        height: 128,
    },
    type: 'puzzle',
})

// pushable box
const box = {
    position: {
        x: 1768,
        y: 488,
    },
    width: 112,
    height: 96,
    imageSrc: './assets/images/box.png'
}

// items
const wirePickup = new Interactable({
    position: {
        x: 1704,
        y: 1176,
    },
    size: {
        width: 128,
        height: 104,
    },
    type: 'item',
})
const fusePickup = new Interactable({
    position: {
        x: 2024,
        y: 536,
    },
    size: {
        width: 160,
        height: 48,
    },
    type: 'item',
})
const flowerPickup = new Interactable({
    position: {
        x: 680,
        y: 1480,
    },
    size: {
        width: 128,
        height: 120,
    },
    type: 'item',
})