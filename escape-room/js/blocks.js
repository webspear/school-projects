// collision blocks
let collisionBlocks = []
// interacting blocks
let interactables = []

const block1 = new CollisionBlock({
    position: {
        x: 0,
        y: 1280,
    },
    size: {
        width: 3000,
        height: 5,
    }
})
const block2 = new CollisionBlock({
    position: {
        x: -10,
        y: 0,
    },
    size: {
        width: 10,
        height: 2560,
    }
})
const block3 = new CollisionBlock({
    position: {
        x: 360,
        y: 904,
    },
    size: {
        width: 95,
        height: 386,
    }
})
const block4 = new CollisionBlock({
    position: {
        x: 1472,
        y: 1096,
    },
    size: {
        width: 8,
        height: 184,
    }
})
const block5 = new CollisionBlock({
    position: {
        x: 1608,
        y: 1096,
    },
    size: {
        width: 8,
        height: 184,
    }
})
const block6 = new CollisionBlock({
    position: {
        x: 1472,
        y: 1176,
    },
    size: {
        width: 144,
        height: 104,
    }
})

const interact1 = new Interactable({
    position: {
        x: 400,
        y: 400,
    },
    size: {
        width: 1,
        height: 227,
    },
    tag: 'ladder'
})