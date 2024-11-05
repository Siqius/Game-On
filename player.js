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
  update() {
    if (!Engine.running) return;
    //gravity
    this.yVel += 1 * this.gravityMultiplier;
    this.y += this.yVel > 0.5 || this.yVel < -0.5 ? this.yVel : 0;
    //collisions
    Engine.gameObjects.forEach(object => {
      if (Engine.isStandingOn(this, object)) {
        this.yVel = 0;
        this.y = !this.shadow ? object.y - this.height : object.y + object.height;
        //jumping
        if (Engine.playerControls.controls.jump) {
          if (this == Engine.active) {
            this.yVel -= this.jumpPower * this.gravityMultiplier;
          }
        }
      }
      if (object.shadow != this.shadow) return;
      if (Engine.isCollidingWithWall(this, object)) {

      }
      //moving
      object.x += this.speed * (this.xVel * -1)
    })
  }

  //Handles every keydown event
  keydown(action) {
    if (this.shadow != Engine.active.shadow) return;
    if (action == "swap") {
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
    }
    else if (action == "jump") {
      Engine.playerControls.controls.jump = true;
    }
    else if (action == "left") {
      Engine.playerControls.controls.left = true;
      this.xVel = -1;
    }
    else if (action == "right") {
      Engine.playerControls.controls.right = true;
      this.xVel = 1;
    }
  }

  //Handles every keyup event
  keyup(action) {
    if (action == "jump") {
      Engine.playerControls.controls.jump = false;
    }

    else if (action == "left") {
      Engine.playerControls.controls.left = false;
      if (Engine.playerControls.controls.right) return;
      this.xVel = 0;
    }

    else if (action == "right") {
      Engine.playerControls.controls.right = false;
      if (Engine.playerControls.controls.left) return;
      this.xVel = 0;
    }
  }
}