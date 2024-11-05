class GameObject {
  constructor(x, y, width, height, shadow, canCollide, sprites) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.shadow = shadow;
    this.canCollide = canCollide;
    this.sprites = sprites;
    if (this instanceof Player) return;
    Engine.gameObjects.push(this);
  }

  //Renders all gameobjects
  render(ctx) {
    //if object is a shadow object (shadowworld) rotate it 180 degrees and also mirror it
    if (this.shadow) {
      ctx.save();
      ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
      ctx.scale(-1, 1);
      ctx.rotate(Math.PI);
      ctx.drawImage(this.activeImage, -this.width / 2, -this.height / 2, this.width, this.height);
      ctx.restore();
      return;
    }
    ctx.drawImage(this.activeImage, this.x, this.y, this.width, this.height);
  }
}