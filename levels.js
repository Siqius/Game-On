class Level {
  static loadFromImage(level) {
    let img = new Image();
    img.crossOrigin = "anonymous";
    img.src = `./assets/level${level}.png`;
    console.log(img);
    const colors = [];

    img.onload = (e) => {
      Engine.ctx.clearRect(0, 0, Engine.canvas.width, Engine.canvas.height);
      Engine.ctx.drawImage(img, 0, 0);

      for (let y = 0; y < img.height; y++) {
        for (let x = 0; x < img.width; x++) {
          const pixelData = Engine.ctx.getImageData(x, y, 1, 1).data;
          const color = `rgb(${pixelData[0]}, ${pixelData[1]}, ${pixelData[2]})`;
          colors.push({ x, y, color });
        }
      }

      colors.forEach(pixel => {
        if (pixel.color == "rgb(0, 0, 0)") {
          new Tile(pixel.x * 50, pixel.y * 50, 50, 50, false, true, Engine.overworldObjectSprites);
        }

        else if (pixel.color == "rgb(50, 0, 0)") {
          new Tile(pixel.x * 50, pixel.y * 50, 50, 50, true, true, Engine.shadowworldObjectSprites);
        }

      })
    }
  }
}