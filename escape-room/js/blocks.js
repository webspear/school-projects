// collision blocks
let collisionBlocks = []
// interacting blocks
let interactables = []

const block1 = new CollisionBlock({
    position: {
        x: 0,
        y: 627,
    },
    size: {
        width: 1600,
        height: 5,
    }
})
const block2 = new CollisionBlock({
    position: {
        x: 0,
        y: 0,
    },
    size: {
        width: 40,
        height: 945,
    }
})
const block3 = new CollisionBlock({
    position: {
        x: 300,
        y: 400,
    },
    size: {
        width: 300,
        height: 10,
    }
})

const interact1 = new Interactable({
    position: {
        x: 400,
        y: 400,
    },
    size: {
        width: 100,
        height: 227,
    }
})