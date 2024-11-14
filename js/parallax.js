class Parallax {
  constructor(image, strength, shadow) {
    this.activeImage = image;
    this.strength = strength;
    this.shadow = shadow;

    Engine.parallaxes.push(this);
  }

  render(ctx) {
    if (this.shadow) {
      ctx.save();
      ctx.translate(Engine.shadowworldX * this.strength + this.activeImage.width / 2, (Engine.globalY + ((Engine.canvas.height + 300) / 2)) + this.activeImage.height / 2);
      ctx.scale(-1, 1);
      ctx.rotate(Math.PI);
      ctx.drawImage(this.activeImage, -this.activeImage.width / 2, -this.activeImage.height / 2, this.activeImage.width, this.activeImage.height);
      ctx.restore();
      return;
    }
    ctx.drawImage(this.activeImage, Engine.overworldX * this.strength, Engine.globalY);
  }
}