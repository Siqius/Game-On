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
      let audio = new Audio(AudioLoader.audios.sfx.blockBroken).cloneNode(true);
      audio.volume = AudioLoader.audios.sfx.blockBroken.volume;
      audio.play();

      let index = Engine.gameObjects.indexOf(this);
      Engine.gameObjects.splice(index, 1);
      index = Engine.linkedObjects.indexOf(this);
      Engine.linkedObjects.splice(index, 1);
      delete this;
    }
    if (this.type == "support") {
      let audio = new Audio(AudioLoader.audios.sfx.blockPlaced).cloneNode(true);
      audio.volume = AudioLoader.audios.sfx.blockPlaced.volume;
      audio.play();

      this.y -= 10000;
    }
  }
}