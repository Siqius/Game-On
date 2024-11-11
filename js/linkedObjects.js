class LinkedObject extends GameObject {
  constructor(x, y, width, height, shadow, canCollide, sprites, type, serialNumber) {
    super(x, y, width, height, shadow, canCollide, sprites);

    this.type = type;
    this.serialNumber = serialNumber;
    if (this.type == "obstacle")
      this.activeImage = sprites.obstacleTile;
    else
      this.activeImage = sprites.supportTile;

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