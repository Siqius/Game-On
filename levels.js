class Level {
  static loadFromImage(level) {
    let img = new Image();
    img.crossOrigin = "anonymous";
    img.src = `./assets/level${level}.png`;

    const colors = [];

    img.onload = (e) => {
      Engine.ctx.clearRect(0, 0, Engine.canvas.width, Engine.canvas.height);
      Engine.ctx.drawImage(img, 0, 0);

      for (let x = 0; x < img.width; x++) {
        for (let y = 0; y < img.height; y++) {
          const pixelData = Engine.ctx.getImageData(x, y, 1, 1).data;
          const color = `rg(${pixelData[0]}, ${pixelData[1]})`;
          const blue = pixelData[2]
          colors.push({ x, y, color, blue });
        }
      }
      colors.forEach(pixel => {
        console.log(pixel.blue);
        if (pixel.color == "rg(0, 150)") {
          new Tile(pixel.x * 50, pixel.y * 50, 50, 50, false, true, Engine.overworldObjectSprites);
        }

        else if (pixel.color == "rg(50, 0)") {
          new Tile(pixel.x * 50, pixel.y * 50, 50, 50, true, true, Engine.shadowworldObjectSprites);
        }

        else if (pixel.color == "rg(100, 0)") {
          new Button(pixel.x * 50, pixel.y * 50, 50, 50, false, true, Engine.overworldObjectSprites, pixel.blue);
        }

        else if (pixel.color == "rg(150, 0)") {
          new Button(pixel.x * 50, pixel.y * 50, 50, 50, true, true, Engine.shadowworldObjectSprites, pixel.blue);
        }

        else if (pixel.color == "rg(200, 0)") {
          new linkedObject(pixel.x * 50, pixel.y * 50 + 10_000, 50, 50, false, true, Engine.overworldObjectSprites, "support", pixel.blue);
        }

        else if (pixel.color == "rg(250, 0)") {
          new linkedObject(pixel.x * 50, pixel.y * 50 + 10_000, 50, 50, true, true, Engine.shadowworldObjectSprites, "support", pixel.blue);
        }

        else if (pixel.color == "rg(0, 50)") {
          new linkedObject(pixel.x * 50, pixel.y * 50, 50, 50, false, true, Engine.overworldObjectSprites, "obstacle", pixel.blue);
        }

        else if (pixel.color == "rg(0, 100)") {
          new linkedObject(pixel.x * 50, pixel.y * 50, 50, 50, true, true, Engine.shadowworldObjectSprites, "obstacle", pixel.blue);
        }
      })
    }
  }
}