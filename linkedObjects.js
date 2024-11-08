class linkedObject extends GameObject {
  constructor(x, y, width, height, shadow, canCollide, sprites, type, serialNumber) {
    super(x, y, width, height, shadow, canCollide, sprites);

    this.type = type;
    this.activeImage = sprites.tile;
    this.serialNumber = serialNumber;

    Engine.linkedObjects.push(this);
  }

  activate() {
    if (this.type == "obstacle") {
      let index = Engine.gameObjects.indexOf(this);
      Engine.gameObjects.splice(index, 1);
      index = Engine.linkedObjects.indexOf(this);
      Engine.linkedObjects.splice(index, 1);
      delete this;
    }
    if (this.type == "support") {
      this.y -= 10000;
    }
  }
}