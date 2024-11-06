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

    Engine.players.push(this);
  }

  //Handles gravity, collissions, jumping and moving
  async update() {
    if (!Engine.running) return;

    //checks for swap
    if (Engine.playerControls.controls.swap) {
      if (Engine.getTime() - Engine.timeSinceWorldSwitch < Engine.worldSwitchDelay) return;
      Engine.running = false;
      setTimeout(() => {
        Engine.running = true;
      }, Engine.worldSwitchTimeout);
      Engine.timeSinceWorldSwitch = Engine.getTime();
      let tempxVel = Engine.active.xVel;
      Engine.active.xVel = 0;
      Engine.active.yVel = 0;
      Engine.active = Engine.playerOne == Engine.active ? Engine.playerTwo : Engine.playerOne;
      Engine.active.xVel = tempxVel;

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
    }

    //movement keys, if both are held down then dont move
    if (Engine.playerControls.controls.left) this.xVel = -1;
    else {
      if (Engine.playerControls.controls.right) this.xVel = 1;
      else this.xVel = 0;
    }
    if (Engine.playerControls.controls.right) this.xVel = 1;
    else {
      if (Engine.playerControls.controls.left) this.xVel = -1;
      else this.xVel = 0;
    }
    if ((Engine.playerControls.controls.left && Engine.playerControls.controls.right) || (!Engine.playerControls.controls.left && !Engine.playerControls.controls.right)) this.xVel = 0;

    //gravity
    this.yVel += Engine.gravityStrength * this.gravityMultiplier;
    this.y += this.yVel > 0.5 || this.yVel < -0.5 ? this.yVel : 0;
    //collisions
    let collissionDetectedThisFrame = false;
    Engine.gameObjects.forEach(object => {
      let collidingWithGround = false;
      if (Engine.isStandingOn(this, object)) {
        collidingWithGround = true;
        this.yVel = 0;
        this.y = !this.shadow ? object.y - this.height : object.y + object.height;
        if (this != Engine.active) return;
        //jumping
        if (Engine.playerControls.controls.jump) {
          this.yVel -= this.jumpPower * this.gravityMultiplier;
        }
      }
      if (Engine.isCollidingWithWall(this, object)) {
        collissionDetectedThisFrame = true;
      }
    })
    if (this != Engine.active) return;
    console.log(collissionDetectedThisFrame);
    if (!collissionDetectedThisFrame) {
      Engine.gameObjects.forEach(object => {
        if (object.shadow != Engine.active.shadow) return;
        object.x += this.speed * (this.xVel * -1);
      })
    } else if (collissionDetectedThisFrame) {
      Engine.gameObjects.forEach(object => {
        if (object.shadow != Engine.active.shadow) return;
        object.x += this.speed * (this.xVel) * 1;
      })
    }
  }
}