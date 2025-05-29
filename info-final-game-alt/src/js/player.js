import * as UTILS from "./utils.js";
import { audio, music } from "./audio.js";

export class Player {
  constructor(canvas, x, y, width, height, speed = 2, mapGen) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.speed = speed;

    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");

    this.mapGen = mapGen;

    // movement states
    this.direction = "down"; // 'up', 'down', 'left', 'right'
    this.moving = false;

    // anims
    this.spritesheet = null;
    this.spritesheet2 = null;
    this.spritesheet3 = null;
    this.frameX = 0;
    this.frameY = 0;
    this.animationSpeed = 3; // frames per animation change
    this.frameCounter = 0;

    // collision
    this.hitbox = {};

    // movement keys
    this.keys = {
      up: false,
      down: false,
      left: false,
      right: false,
    };

    // lock player
    this.movementLocked = false;

    // health
    this.maxHp = 5;
    this.hp = this.maxHp;

    // weapon
    this.angle = 0;
    this.radiusX = 18;
    this.radiusY = 18;
    this.weaponSprite = new Image();
    this.weaponSprite.src = "./weapon.png";
    this.weaponTargetX = 0;
    this.weaponTargetY = 0;

    // debug
    this.debugMode = false;

    // gun
    this.gun = null;

    // dmg
    this.offCanvas = document.createElement("canvas");
    this.offCanvas.width = this.width;
    this.offCanvas.height = this.height;
    this.offCtx = this.offCanvas.getContext("2d", { willReadFrequently: true });
    this.dmged = false;
    this.interations = 0;

    // audio
    this.stepped = false;

    // dash
    this.dashing = false;
    this.postDash = 0;
    this.dashSpeed = 5 * this.speed;
    this.dashDuration = 6; // frames
    this.dashDurationLeft = 0;
    this.dashCooldown = 60; // frames
    this.dashCooldownLeft = 0;
    this.dashDirection = { x: 0, y: 0 };
  }

  async loadSpritesheet(spritesheetPath) {
    this.spritesheet = new Image();
    this.spritesheet.src = spritesheetPath;
    return new Promise((resolve, reject) => {
      this.spritesheet.onload = () => resolve();
      this.spritesheet.onerror = () =>
        reject(new Error("failed to load player spritesheet"));
    });
  }

  async loadSpritesheet2(spritesheetPath) {
    this.spritesheet2 = new Image();
    this.spritesheet2.src = spritesheetPath;
    return new Promise((resolve, reject) => {
      this.spritesheet2.onload = () => resolve();
      this.spritesheet2.onerror = () =>
        reject(new Error("failed to load player spritesheet"));
    });
  }

  async loadSpritesheet3(spritesheetPath) {
    this.spritesheet3 = new Image();
    this.spritesheet3.src = spritesheetPath;
    return new Promise((resolve, reject) => {
      this.spritesheet3.onload = () => resolve();
      this.spritesheet3.onerror = () =>
        reject(new Error("failed to load player spritesheet"));
    });
  }

  handleKeyDown(e) {
    switch (e.code) {
      case "ArrowUp":
      case "KeyW":
        this.keys.up = true;
        break;
      case "ArrowDown":
      case "KeyS":
        this.keys.down = true;
        break;
      case "ArrowLeft":
      case "KeyA":
        this.keys.left = true;
        break;
      case "ArrowRight":
      case "KeyD":
        this.keys.right = true;
        break;
      case "ShiftLeft":
        this.triggerDash()
        break;
    }
  }

  triggerDash() {
    if (!this.dashing && this.dashCooldownLeft <= 0 && this.moving) {
      this.dashing = true;
      this.dashDurationLeft = this.dashDuration;
      this.dashCooldownLeft = this.dashCooldown;

      this.postDash = 20;

      // set dash direction based on last movement direction
      const normalizer = 1 / Math.sqrt(2);
      let dx = 0, dy = 0;
      if (this.keys.up) dy -= 1;
      if (this.keys.down) dy += 1;
      if (this.keys.left) dx -= 1;
      if (this.keys.right) dx += 1;
      if (dx !== 0 && dy !== 0) {
        dx *= normalizer;
        dy *= normalizer;
      }
      this.dashDirection = {
        x: dx * this.dashSpeed,
        y: dy * this.dashSpeed
      };

      audio.dash.currentTime = 0
      audio.dash.play()
    }
  }

  handleKeyUp(e) {
    switch (e.code) {
      case "ArrowUp":
      case "KeyW":
        this.keys.up = false;
        break;
      case "ArrowDown":
      case "KeyS":
        this.keys.down = false;
        break;
      case "ArrowLeft":
      case "KeyA":
        this.keys.left = false;
        break;
      case "ArrowRight":
      case "KeyD":
        this.keys.right = false;
        break;
    }
  }

  update(map, blocks) {
    if (!this.movementLocked) this.movement(map, blocks);
    this.animate();

    if (this.gun) {
      this.gun.updateProjectiles(16, 1, map);
      // console.log(map);
    }
    this.render();
  }

  movement(map, blocks) {
    // check if moving
    this.moving =
      this.keys.up || this.keys.down || this.keys.left || this.keys.right;

    // old position for collision resolution
    const oldX = this.x;
    const oldY = this.y;

    // movement
    let dx = 0;
    let dy = 0;

    if (this.postDash > 0)
      this.postDash--

    if (this.dashing) {
      dx = this.dashDirection.x;
      dy = this.dashDirection.y;

      this.dashDurationLeft--;
      if (this.dashDurationLeft <= 0) {
        this.dashing = false;
      }
    } else {
      if (this.keys.up) {
        dy -= this.speed;
        this.direction = "up";
      }
      if (this.keys.down) {
        dy += this.speed;
        this.direction = "down";
      }
      if (this.keys.left) {
        dx -= this.speed;
        this.direction = "left";
      }
      if (this.keys.right) {
        dx += this.speed;
        this.direction = "right";
      }

      // normalize
      if (dx !== 0 && dy !== 0) {
        const normalizer = 1 / Math.sqrt(2);
        dx *= normalizer;
        dy *= normalizer;
      }
    }

    if (this.dashCooldownLeft > 0) {
      this.dashCooldownLeft--;
    }

    if (dx !== 0) {
      this.x += dx;

      // check collision on x
      if (this.checkCollisionWithMap(map, blocks)) {
        this.x = oldX; // restore old x
      }
    }

    if (dy !== 0) {
      this.y += dy;

      // check collision on y
      if (this.checkCollisionWithMap(map, blocks)) {
        this.y = oldY; // restore old y
      }
    }
  }

  checkCollisionWithMap(map, blocks) {
    this.hitbox = {
      x: this.x + this.width / 2 - 5,
      y: this.y + this.height / 2 + 4,
      width: 10,
      height: 10,
    };

    // check collision with the four corners of the hitbox
    const positions = [
      { x: this.hitbox.x, y: this.hitbox.y },
      { x: this.hitbox.x + this.hitbox.width, y: this.hitbox.y },
      { x: this.hitbox.x, y: this.hitbox.y + this.hitbox.height },
      {
        x: this.hitbox.x + this.hitbox.width,
        y: this.hitbox.y + this.hitbox.height,
      },
    ];

    // adjust positions for map offset
    const mapPositions = positions.map((pos) => ({
      x: pos.x - map.x,
      y: pos.y - map.y,
    }));

    for (const pos of mapPositions) {
      const tile = map.getTileAt(pos.x, pos.y);
      if (tile && tile.collidable) {
        return true;
      }
    }

    // blocks
    for (const block of blocks) {
      if (
        block.x >= this.mapGen.currentRoom.x &&
        block.x <
          this.mapGen.currentRoom.x + this.mapGen.currentRoom.mapWidth * 16 &&
        block.y >= this.mapGen.currentRoom.y &&
        block.y <
          this.mapGen.currentRoom.y + this.mapGen.currentRoom.mapHeight * 16
      ) {
        const blockPositions = positions.map((pos) => ({
          x: pos.x - block.x,
          y: pos.y - block.y,
        }));

        for (const pos of blockPositions) {
          const tile = block.getTileAt(pos.x, pos.y);
          if (tile && tile.collidable) {
            return true;
          }
        }
      }
    }

    return false;
  }

  animate() {
    // animation
    if (!this.dashing) {
      this.frameCounter++;
      if (this.frameCounter >= this.animationSpeed) {
        this.frameCounter = 0;
        this.frameX = (this.frameX + 1) % 8; // assuming 8 frames per animation
      }
    } else {
      this.frameX = 0
    }


    // set frameY based on direction
    switch (this.direction) {
      case "down":
        this.frameY = 0;
        break;
      case "right":
        this.frameY = 1;
        break;
      case "left":
        this.frameY = 2;
        break;
      case "up":
        this.frameY = 3;
        break;
    }
  }

  render() {
    if (!this.spritesheet || !this.spritesheet.complete) return;

    // this.fillStyle = "black";
    // this.ctx.fillRect(this.x, this.y, this.width, this.height);
    // this.ctx.fillStyle = "white";
    const frameWidth = this.spritesheet.width / 8; // 8 columns of frames
    const frameHeight = this.spritesheet.height / 4; // 4 rows of frames (up, down, left, right)

    if (!this.dmged) {
      if (this.dashing) {
        this.ctx.drawImage(
          this.spritesheet3,
          this.frameX * frameWidth,
          this.frameY * frameHeight,
          frameWidth,
          frameHeight,
          this.x,
          this.y,
          this.width,
          this.height,
        );
      } else {
        if (!this.moving)
          this.ctx.drawImage(
            this.spritesheet,
            this.frameX * frameWidth,
            this.frameY * frameHeight,
            frameWidth,
            frameHeight,
            this.x,
            this.y,
            this.width,
            this.height,
          );
        else
          this.ctx.drawImage(
            this.spritesheet2,
            this.frameX * frameWidth,
            this.frameY * frameHeight,
            frameWidth,
            frameHeight,
            this.x,
            this.y,
            this.width,
            this.height,
          );
      }
    } else {
      if (!this.moving) {
        this.offCtx.drawImage(
          this.spritesheet,
          this.frameX * frameWidth,
          this.frameY * frameHeight,
          frameWidth,
          frameHeight,
          0,
          0,
          this.width,
          this.height,
        );
        // this.offCtx.fillStyle = 'red'
        // this.offCtx.fillRect(0, 0, 20, 20)
      } else
        this.offCtx.drawImage(
          this.spritesheet2,
          this.frameX * frameWidth,
          this.frameY * frameHeight,
          frameWidth,
          frameHeight,
          0,
          0,
          this.width,
          this.height,
        );

      // const imageData = this.offCtx.getImageData(0, 0, frameWidth, frameHeight);
      // const data = imageData.data;
      //
      // for (let i = 0; i < data.length; i += 4) {
      //   const alpha = data[i + 3];
      //   if (alpha > 0) {
      //     data[i] = Math.min(255, data[i]); // R
      //     data[i + 1] *= 0.5;                     // G
      //     data[i + 2] *= 0.5;                     // B
      //   }
      //   this.interations++
      // }
      // this.offCtx.putImageData(imageData, 0, 0);

      this.offCtx.globalCompositeOperation = "source-atop";
      this.offCtx.fillStyle = "rgba(255, 0, 0, 0.3)";
      this.offCtx.fillRect(0, 0, this.offCanvas.width, this.offCanvas.height);
      this.offCtx.globalCompositeOperation = "source-over";

      // this.offCtx.fillStyle = 'red'
      // this.offCtx.fillRect(0, 0, this.offCanvas.width, this.offCanvas.height)

      this.ctx.drawImage(
        this.offCanvas,
        0,
        0,
        frameWidth,
        frameHeight,
        this.x,
        this.y,
        this.width,
        this.height,
      );

      this.offCtx.clearRect(0, 0, this.offCanvas.width, this.offCanvas.height);
    }

    // weapon
    const a = this.radiusX;
    const b = this.radiusY;

    const x = this.getCenterX() + Math.cos(this.angle) * a;
    const y = this.getCenterY() + Math.sin(this.angle) * b;

    this.ctx.save();
    this.ctx.translate(x, y);
    this.ctx.rotate(this.angle);
    this.ctx.drawImage(
      this.weaponSprite,
      -this.weaponSprite.width / 2,
      -this.weaponSprite.height / 2,
    );
    this.ctx.restore();

    // audio
    if (this.moving) {
      if (!this.stepped && this.frameX === 2) {
        this.stepped = true;
        const rng = Math.ceil(Math.random() * 5);
        audio.steps["step" + rng].currentTime = 0;
        audio.steps["step" + rng].play();
        // console.log('step')
      } else if (this.frameX !== 2) {
        this.stepped = false;
      }
    }

    // draw collision box in debug mode
    if (this.debugMode) {
      this.ctx.fillStyle = "rgba(255, 0, 0, 0.3)";
      this.ctx.fillRect(
        this.hitbox.x,
        this.hitbox.y,
        this.hitbox.width,
        this.hitbox.height,
      );
    }
  }

  // get center position of player (camera)
  getCenterX() {
    return this.x + this.width / 2;
  }

  getCenterY() {
    return this.y + this.height / 2;
  }

  // check if player is facing a specific position
  isFacing(x, y) {
    const centerX = this.getCenterX();
    const centerY = this.getCenterY();

    switch (this.direction) {
      case "up":
        return y < centerY && Math.abs(x - centerX) < Math.abs(y - centerY);
      case "down":
        return y > centerY && Math.abs(x - centerX) < Math.abs(y - centerY);
      case "left":
        return x < centerX && Math.abs(y - centerY) < Math.abs(x - centerX);
      case "right":
        return x > centerX && Math.abs(y - centerY) < Math.abs(x - centerX);
    }
    return false;
  }

  // get tile position the player is currently facing
  getFacingTile(map) {
    if (!map) return;
    const centerX = this.getCenterX() - map.x;
    const centerY = this.getCenterY() - map.y;
    let tileX = Math.floor(centerX / map.tileSize);
    let tileY = Math.floor(centerY / map.tileSize);

    // adjust tile coordinates based on direction
    switch (this.direction) {
      case "up":
        tileY--;
        break;
      case "down":
        tileY++;
        break;
      case "left":
        tileX--;
        break;
      case "right":
        tileX++;
        break;
    }

    if (
      tileX < 0 ||
      tileX >= map.mapWidth ||
      tileY < 0 ||
      tileY >= map.mapHeight
    ) {
      return null;
    }

    return { x: tileX, y: tileY };
  }

  decreaseHp(levelFunctions) {
    this.hp--;

    const hearts = document.querySelectorAll(".heart");

    for (let i = hearts.length - 1; i >= 0; i--) {
      const heart = hearts[i];
      if (heart.src.includes("/heart.png")) {
        heart.src = "./heart-dead.png";
        break; // stops after breaking one heart
      }
    }

    // dead
    if (this.hp <= 0) {
      this.movementLocked = true;
      this.moving = false;

      setTimeout(() => {
        document.getElementById("end-screen-background").style.opacity = "1";
      }, 200);
      setTimeout(() => {
        levelFunctions.endScreen("Defeat");
      }, 400);
    }

    this.dmged = true;
    setTimeout(() => {
      this.dmged = false;
    }, 100);

    // audio
    audio.hurt.currentTime = 0;
    audio.hurt.play();
  }

  shootGun(levelFunctions) {
    if (!this.gun) {
      console.error("No gun! Visit America!");
      return;
    }

    const a = this.radiusX;
    const b = this.radiusY;

    const x = this.getCenterX() + Math.cos(this.angle) * a;
    const y = this.getCenterY() + Math.sin(this.angle) * b;

    const startV = new UTILS.Vec2(x, y);

    this.gun.shoot(startV, this.angle, levelFunctions);
  }

  assignGun(gun) {
    this.gun = gun;
    this.gun.assignCanvas(this.canvas);
  }
}
