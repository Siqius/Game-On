class Button extends GameObject {
  constructor(x, y, width, height, shadow, canCollide, sprites, serialNumber) {
    super(x, y, width, height, shadow, canCollide, sprites);

    this.serialNumber = serialNumber;
    this.pressed = false;
    this.activeImage = sprites.unpressedButton;

    Engine.buttons.push(this);
  }

  press() {
    if (this.pressed) return;
    this.activeImage = this.sprites.pressedButton;
    this.pressed = true;
    let singleButton = true;
    Engine.buttons.forEach(button => {

      if (button.serialNumber != this.serialNumber) return;
      if (this == button) return;
      singleButton = false;
      if (!button.pressed) return;
      let copyToIterate = [...Engine.linkedObjects];
      copyToIterate.forEach(linkedObject => {

        if (linkedObject.serialNumber != this.serialNumber) return;
        linkedObject.activate();
      })
    })
    if (singleButton) {
      let copyToIterate = [...Engine.linkedObjects]
      copyToIterate.forEach(linkedObject => {

        if (linkedObject.serialNumber != this.serialNumber) return;
        linkedObject.activate();
      })
    }
  }
}