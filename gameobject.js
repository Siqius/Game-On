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
    if (this.shadow) {
      ctx.drawImage(this.activeImage, this.x, this.y, this.width, this.height);
    }
    ctx.drawImage(this.activeImage, this.x, this.y, this.width, this.height);
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
    this.x += Engine.active.speed * Engine.active.xVel;
  }
}