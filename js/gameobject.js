class GameObject {
  constructor(x, y, width, height, shadow, canCollide, sprites) {
    this._x = x;
    this._y = y;
    this.width = width;
    this.height = height;
    this.shadow = shadow;
    this.canCollide = canCollide;
    this.sprites = sprites;
    if (this instanceof Player) return;
    Engine.gameObjects.push(this);
  }

  get x() {
    return this._x;
  }

  get y() {
    return this._y;
  }

  // Setters for x and y
  set x(value) {
    this._x = value;
  }

  set y(value) {
    this._y = value;
  }

  //Renders all gameobjects
  render(ctx) {
    //if object is a shadow object (shadowworld) rotate it 180 degrees and also mirror it
    this.y += Engine.globalY;
    if (this.shadow) {
      ctx.save();
      ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
      ctx.scale(-1, 1);
      ctx.rotate(Math.PI);
      ctx.drawImage(this.activeImage, -this.width / 2, -this.height / 2, this.width, this.height);
      ctx.restore();
      this.y -= Engine.globalY;
      return;
    }
    ctx.drawImage(this.activeImage, this.x, this.y, this.width, this.height);
    this.y -= Engine.globalY;

    if (!(this instanceof Portal)) return;
    if (!this.playerInRange) return;
    //draw image "E to activate"
  }
}