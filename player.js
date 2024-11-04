class Player extends GameObject {
  constructor(x, y, width, height, shadow, canCollide, speed, jumpPower, standingImage) {
    super(x, y, width, height, shadow, canCollide);
    this.speed = speed;
    this.jumpPower = jumpPower;
    this.activeImage = standingImage
    this.xVel = 0;
    this.yVel = 0;
    this.timeSinceLastJump = 0;
    this.gravityMultiplier = this.shadow ? -1 : 1;

    this.keys = {
      "left": false,
      "right": false,
      "jump": false,
      "attack": false,
      "swap": false,
    }

    Engine.players.push(this);
  }

  update() {
    if (this != Engine.active) return;
    this.yVel += 1 * this.gravityMultiplier;
    this.y += this.yVel > 0.5 || this.yVel < -0.5 ? this.yVel : 0;
    Engine.gameObjects.forEach(object => {
      if (this.shadow) {
      }
      if (Engine.isStandingOn(this, object)) {
        this.yVel = 0;
        this.y = !this.shadow ? object.y - this.height : object.y + object.height;
        if (this.keys.jump) {
          this.yVel -= this.jumpPower * this.gravityMultiplier;
        }
      }
      if (object.shadow != this.shadow) return;
      object.x += this.speed * this.xVel
    })
  }
}