class Portal extends GameObject {
  constructor(x, y, width, height, shadow, canCollide, sprites) {
    super(x, y, width, height, shadow, canCollide, sprites);

    this.activated = false;
    this.activeImage = sprites.portal;
  }

  activate() {
    if (this.activated) return;
    this.activated = true;
    this.activeImage = this.sprites.activatedPortal;
    //play activate sound
    Engine.portals.forEach(portal => {
      if (portal == this) return;
      if (portal.activated) {
        Engine.nextLevel();
      }
    })
  }
}