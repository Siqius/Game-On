class Portal extends GameObject {
  constructor(x, y, width, height, shadow, canCollide, sprites) {
    super(x, y, width, height, shadow, false, sprites);

    this.activated = false;
    this.activeImage = sprites.portal;
    this.playerInRange = false;

    Engine.portals.push(this);
  }

  activate() {
    console.log("1");
    if (this.activated) return;
    if (!this.playerInRange) return;
    console.log("2")
    let audio = AudioLoader.audios.sfx.portal.cloneNode(true);
    audio.volume = AudioLoader.audios.sfx.portal.volume;
    audio.play();

    this.activated = true;
    Engine.portals.forEach(portal => {
      if (portal == this) return;
      console.log("3")
      if (portal.activated) {
        console.log("4");
        Engine.nextLevel();
      }
    })
  }
}