class Player extends GameObject {
  constructor(x, y, width, height, shadow, canCollide, speed, jumpPower, sprites) {
    super(x, y, width, height, shadow, canCollide, sprites);
    this.speed = speed;
    this.jumpPower = jumpPower;
    this.xVel = 0;
    this.yVel = 0;
    this.timeSinceLastJump = 0;
    this.gravityMultiplier = this.shadow ? -1 : 1;
    this.activeImage = sprites.idleLookingRight;
    this.status = "idle";
    this.direction = "none";
    this.animationFrame = 0;

    Engine.players.push(this);
  }

  //Handles gravity, collissions, jumping and moving
  async update() {
    if (!Engine.running) return;

    //checks for swap
    if (Engine.playerControls.controls.swap) {
      if (Engine.getTime() - Engine.timeSinceWorldSwitch < Engine.worldSwitchDelay) return;
      Engine.running = false;

      Engine.timeSinceWorldSwitch = Engine.getTime();
      let tempxVel = Engine.active.xVel;
      Engine.active.xVel = 0;
      Engine.active.yVel = 0;
      Engine.active = Engine.playerOne == Engine.active ? Engine.playerTwo : Engine.playerOne;
      Engine.active.xVel = tempxVel;
      Engine.playerControls.controls.jump = false;

      //swap jump key
      if (Engine.playerControls.keys.hasOwnProperty("s")) {
        Engine.playerControls.keys["w"] = Engine.playerControls.keys["s"];
        delete Engine.playerControls.keys["s"];
      }
      else if (Engine.playerControls.keys.hasOwnProperty("w")) {
        Engine.playerControls.keys["s"] = Engine.playerControls.keys["w"];
        delete Engine.playerControls.keys["w"];
      }

      while (true) {
        let mult = 1
        let range = 0;

        if (Engine.active.shadow) {
          mult = -1;
          range = 400;
        }

        console.log(mult);
        Engine.globalY += 20 * mult;

        if (Math.abs(Engine.globalY) == range) {
          break
        }

        await Engine.sleep(Engine.worldSwitchTimer / 100);
      }
      Engine.running = true;
    }

    //movement keys, if both are held down then dont move
    if (Engine.playerControls.controls.left) {
      this.xVel = -1;
      this.direction = "left";
    }
    else {
      if (Engine.playerControls.controls.right) {
        this.xVel = 1;
        this.direction = "right";
      }
      else {
        this.xVel = 0;
        this.direction = "none";
      }
    }
    if (Engine.playerControls.controls.right) {
      this.xVel = 1;
      this.direction = "right";
    }
    else {
      if (Engine.playerControls.controls.left) {
        this.xVel = -1;
        this.direction = "left";
      }
      else {
        this.xVel = 0;
        this.direction = "none";
      }
    }
    if ((Engine.playerControls.controls.left && Engine.playerControls.controls.right) || (!Engine.playerControls.controls.left && !Engine.playerControls.controls.right)) this.xVel = 0;

    if (this.xVel == 0) this.status = "idle";
    else if (this.xVel == 1 || this.xVel == -1) this.status = "running";

    //gravity
    this.yVel += Engine.gravityStrength * this.gravityMultiplier;
    this.y += this.yVel > 0.5 || this.yVel < -0.5 ? this.yVel : 0;
    //checks floor collision
    Engine.gameObjects.forEach(object => {
      let collidingWithGround = false;
      if (Engine.isStandingOn(this, object)) {
        if (this.status == "jumping") this.status = "idle";
        collidingWithGround = true;
        this.yVel = 0;
        this.y = !this.shadow ? object.y - this.height : object.y + object.height;
        if (this != Engine.active) return;
        //jumping
        if (Engine.playerControls.controls.jump) {
          this.status = "jumping";
          this.yVel -= this.jumpPower * this.gravityMultiplier;
        }

        if (object instanceof Button) {
          object.press();
        }
      } else {
        this.status == "jumping";
      }
      if (object.shadow != Engine.active.shadow) return;
      if (this != Engine.active) return;
      object.x += this.speed * (this.xVel * - 1);
    })
    //checks wall collision
    let wallCollissionDetectedThisFrame = false;
    Engine.gameObjects.forEach(object => {
      if (Engine.isCollidingWithWall(this, object)) {
        if (object.shadow != Engine.active.shadow) return;
        if (this != Engine.active) return;
        wallCollissionDetectedThisFrame = true;
      }
    })
    if (wallCollissionDetectedThisFrame) {
      Engine.gameObjects.forEach(object => {
        if (object.shadow != Engine.active.shadow) return;
        if (this != Engine.active) return;
        object.x -= this.speed * (this.xVel * -1);
      })
    }

    //this.animate();  
  }

  animate() {
    if (Engine.frame % 5 != 0) return;

    if (this.status == "jumping") {
      if (this.yVel < -2) {
        this.activeImage = this.sprites.rising;
      } else if (this.yVel > 2) {
        this.activeImage = this.sprites.falling;
      } else {
        this.activeImage = this.sprites.still;
      }
    } else if (this.status == "running") {
      if (this.xVel == 1) {
        if (this.direction != "right") return;
        if (this.animationFrame == 0) this.activeImage = this.sprites.runningRight1;
        else if (this.animationFrame == 1) this.activeImage = this.sprites.runningRight2;
      } else if (this.xVel == -1) {
        if (this.direction != "left") return;
        if (this.animationFrame == 0) this.activeImage = this.sprites.runningLeft1;
        else if (this.animationFrame == 1) this.activeImage = this.sprites.runningLeft2;
      }
    } else if (this.status == "idle") {
      if (this.animationFrame == 0) this.activeImage = this.sprites.idleAnimation1;
      else if (this.animationFrame == 1) this.activeImage = this.sprites.idleAnimation2;
    }
    this.animationFrame = this.animationFrame + 1 % 2 == 0 ? 0 : this.animationFrame + 1;
  }
}