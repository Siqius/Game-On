class Tile extends GameObject {
  constructor(x, y, width, height, shadow, canCollide, sprites) {
    super(x, y, width, height, shadow, canCollide, sprites);

    this.activeImage = sprites.tile;
  }
}