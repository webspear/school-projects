import * as TWEEN from "@tweenjs/tween.js";

export class Map {
  constructor(
    canvas,
    spritesheetImage,
    x,
    y,
    room = null,
    lockdownBlock = false,
    mapData = null,
  ) {
    // console.log(canvas);
    this.spritesheet = new Image();
    this.spritesheet.src = spritesheetImage;
    this.tileSize = 16;
    this.mapWidth = 0;
    this.mapHeight = 0;
    this.layers = [];
    this.collisionMap = []; // use this for collision
    this.enemyMap = []; // use this for enemy spawn points
    this.interactMap = []; // use this for interact blocks
    this.reservedTiles = []; // use this for reserved tiles
    this.debugMode = false;
    this.x = x;
    this.y = y;
    this.type = null;
    this.subtype = null;

    // blockade logic
    this.room = room;
    this.lockdownBlock = lockdownBlock;

    // canvas and context
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");

    // load map data
    if (mapData) {
      this.loadMap(mapData);
    }

    // battle room
    this.battleRoomDone = false;

    // enemies array
    this.enemies = [];

    // vfx
    this.tweenGroup = new TWEEN.Group();
    this.explosions = [];

    // well
    this.wellUpg = [];

    // chest
    this.chest = Math.random();
    this.chestDone = [];

    // shard room
    this.shardDone = [];
  }

  async loadMap(mapData) {
    const data = typeof mapData === "string" ? JSON.parse(mapData) : mapData;

    // map properties
    this.tileSize = data.tileSize || this.tileSize;
    this.mapWidth = data.mapWidth;
    this.mapHeight = data.mapHeight;

    // init collision map
    this.collisionMap = Array(this.mapHeight)
      .fill()
      .map(() => Array(this.mapWidth).fill(0));

    // init spawn map
    this.enemyMap = Array(this.mapHeight)
      .fill()
      .map(() => Array(this.mapWidth).fill(0));

    // init interaction map
    this.interactMap = Array(this.mapHeight)
      .fill()
      .map(() => Array(this.mapWidth).fill(0));

    this.reservedTiles = Array(this.mapHeight)
      .fill()
      .map(() => Array(this.mapWidth).fill(0));

    // layers
    this.layers = data.layers;

    // process collision data
    this.processCollisionLayer();

    // process interact data
    this.processInteractLayer();

    // wait for spritesheet image to fully load
    return new Promise((resolve, reject) => {
      if (this.spritesheet.complete) {
        resolve();
      } else {
        this.spritesheet.onload = () => {
          resolve();
        };
        this.spritesheet.onerror = () => {
          console.error("failed to load spritesheet image");
          reject(new Error("failed to load spritesheet image"));
        };
      }
    });
  }

  async loadMapFromFile(filePath) {
    try {
      const response = await fetch(filePath);
      const mapData = await response.json();
      await this.loadMap(mapData);
      return true;
    } catch (error) {
      console.error("error loading map file:", error);
      return false;
    }
  }

  processCollisionLayer() {
    // reset collision map
    this.collisionMap = Array(this.mapHeight)
      .fill()
      .map(() => Array(this.mapWidth).fill(0));

    this.enemyMap = Array(this.mapHeight)
      .fill()
      .map(() => Array(this.mapWidth).fill(0));

    this.reservedTiles = Array(this.mapHeight)
      .fill()
      .map(() => Array(this.mapWidth).fill(0));

    // processing each layer that has collider=true in the .json file
    for (const layer of this.layers) {
      if (layer.collider === true) {
        for (const tile of layer.tiles) {
          const x = parseInt(tile.x, 10);
          const y = parseInt(tile.y, 10);

          this.collisionMap[y][x] = 1;
          this.enemyMap[y][x] = 1;
        }
      }
    }
    // process doors
    // horizontal doors
    this.enemyMap[0] = Array(this.mapWidth).fill(1);
    this.enemyMap[this.enemyMap.length - 1] = Array(this.mapWidth).fill(1);
    // vertical doors
    for (let i = 0; i < this.enemyMap.length; i++) {
      this.enemyMap[i][0] = 1;
      this.enemyMap[i][this.enemyMap[i].length - 1] = 1;
    }

    // DEEP COPY to reservedTiles
    this.reservedTiles = JSON.parse(JSON.stringify(this.enemyMap));
    // console.log("rsvp", this.reservedTiles);
    // console.log(this.enemyMap);
  }

  processInteractLayer() {
    // reset collision map
    this.interactMap = Array(this.mapHeight)
      .fill()
      .map(() => Array(this.mapWidth).fill(0));

    // processing each layer that has collider=true in the .json file
    for (const layer of this.layers) {
      if (layer.name === "interactable") {
        for (const tile of layer.tiles) {
          const x = parseInt(tile.x, 10);
          const y = parseInt(tile.y, 10);

          this.interactMap[y][x] = 1;
        }
      }
    }
  }

  render() {
    // order should be: floor, decoration, collision, interactive

    const floorLayer = this.layers.find((layer) => layer.name === "floor");
    const decorationLayer = this.layers.find(
      (layer) => layer.name === "decoration",
    );
    const collisionLayer = this.layers.find(
      (layer) => layer.name === "collision",
    );
    const interactLayer = this.layers.find(
      (layer) => layer.name === "interactable",
    );

    // array of layers in proper rendering order
    const orderedLayers = [];
    if (floorLayer) orderedLayers.push(floorLayer);
    if (decorationLayer) orderedLayers.push(decorationLayer);
    if (collisionLayer) orderedLayers.push(collisionLayer);
    if (interactLayer) orderedLayers.push(interactLayer);

    // render each layer
    for (const layer of orderedLayers) {
      for (const tile of layer.tiles) {
        const tileId = parseInt(tile.id, 10);
        const x = parseInt(tile.x, 10) * this.tileSize;
        const y = parseInt(tile.y, 10) * this.tileSize;

        if (!this.spritesheet.complete || !this.spritesheet.width) {
          console.warn("spritesheet not fully loaded yet");
          continue;
        }

        const tilesPerRow = Math.floor(this.spritesheet.width / this.tileSize);
        if (tilesPerRow <= 0) {
          console.error("invalid spritesheet width/tile size");
          continue;
        }

        const spritesheetX = (tileId % tilesPerRow) * this.tileSize;
        const spritesheetY = Math.floor(tileId / tilesPerRow) * this.tileSize;

        this.ctx.save();
        this.ctx.scale(1, 1);
        this.ctx.drawImage(
          this.spritesheet,
          spritesheetX,
          spritesheetY+0.07,
          this.tileSize,
          this.tileSize,
          this.x + x,
          this.y + y,
          this.tileSize + 0.5,
          this.tileSize + 0.5,
        );
        this.ctx.restore();
      }
    }

    // draw overlay
    if (this.debugMode) {
      this.renderCollisionDebug();
    }
  }

  renderCollisionDebug() {
    this.ctx.fillStyle = "rgba(255,0,0,0.3)";

    for (let y = 0; y < this.mapHeight; y++) {
      for (let x = 0; x < this.mapWidth; x++) {
        if (this.collisionMap[y] && this.collisionMap[y][x] === 1) {
          this.ctx.fillRect(
            x * this.tileSize,
            y * this.tileSize,
            this.tileSize,
            this.tileSize,
          );
        }
      }
    }
  }

  getMapWidth() {
    return this.mapWidth * this.tileSize;
  }

  getMapHeight() {
    return this.mapHeight * this.tileSize;
  }

  /**
   * Get information about a tile at a specific position
   * @param {number} x - X coordinate in pixels
   * @param {number} y - Y coordinate in pixels
   * @returns {Object|null} - Tile information or null if out of bounds
   */
  getTileAt(x, y) {
    const tileX = Math.floor(x / this.tileSize);
    const tileY = Math.floor(y / this.tileSize);

    if (
      tileX < 0 ||
      tileX >= this.mapWidth ||
      tileY < 0 ||
      tileY >= this.mapHeight
    ) {
      return null;
    }

    // return info
    return {
      x: tileX,
      y: tileY,
      collidable: this.collisionMap[tileY][tileX] === 1,
      interactable: this.interactMap[tileY][tileX] === 1,
    };
  }

  setPosition(x, y) {
    this.x = x;
    this.y = y;
  }

  clone() {
    const clonedMap = new Map(
      this.canvas,
      this.spritesheet.src,
      this.x,
      this.y,
      this.room,
      this.lockdownBlock,
    );
    clonedMap.tileSize = this.tileSize;
    clonedMap.mapWidth = this.mapWidth;
    clonedMap.mapHeight = this.mapHeight;
    clonedMap.layers = JSON.parse(JSON.stringify(this.layers));
    clonedMap.collisionMap = JSON.parse(JSON.stringify(this.collisionMap));
    clonedMap.interactMap = JSON.parse(JSON.stringify(this.interactMap));
    clonedMap.enemyMap = JSON.parse(JSON.stringify(this.enemyMap));
    clonedMap.reservedTiles = JSON.parse(JSON.stringify(this.reservedTiles));
    return clonedMap;
  }
}
