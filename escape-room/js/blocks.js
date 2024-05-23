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
        height: 5,
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