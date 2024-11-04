class GameObject {
  constructor(x, y, width, height, shadow, canCollide, image) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.shadow = shadow;
    this.canCollide = canCollide;
    this.activeImage = image;
    if (this instanceof Player) return;
    Engine.gameObjects.push(this);
  }

  draw(ctx) {
    ctx.drawImage(this.activeImage, this.x, this.y, this.width, this.height)
  }

  update() {
    if (Engine.collisionX(this, Engine.active)) return;
    if (Engine.active.keys.left) {
      this.move("right");
    }
    if (Engine.active.keys.right) {
      this.move("left");
    }
  }

  move(direction) {
    if (direction === "left") this.xVel = -1;
    if (direction === "right") this.xVel = 1;
    this.x += Engine.active.speed * Engine.active.xVel
  }
}