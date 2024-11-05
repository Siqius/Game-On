class Images {
  static characterSprites = {
    "overworld": {
      "idleLookingRight": "./assets/overworld_character_idle_looking_right.png"
    },
    "shadowworld": {
      "idleLookingRight": "./assets/shadowworld_character_idle_looking_right.png"
    }
  }

  static objectSprites = {
    "overworld": {
      "tile": "./assets/tile.png"
    },
    "shadowworld": {
      "tile": "./assets/shadowTile.png"
    }
  }

  // Loads all the images from characterSprites and objectSprites using their path values
  static init() {
    for (const [key, value] of Object.entries(Images.characterSprites.overworld)) {
      let img = new Image()
      img.src = value;
      Images.characterSprites.overworld[key] = img;
    }

    Engine.overworldCharacterSprites = Images.characterSprites.overworld;

    for (const [key, value] of Object.entries(Images.characterSprites.shadowworld)) {
      let img = new Image()
      img.src = value;
      Images.characterSprites.shadowworld[key] = img;
    }

    Engine.shadowWorldCharacterSprites = Images.characterSprites.shadowworld;

    for (const [key, value] of Object.entries(Images.objectSprites.overworld)) {
      let img = new Image()
      img.src = value;
      Images.objectSprites.overworld[key] = img;
    }

    Engine.overworldObjectSprites = Images.objectSprites.overworld;

    for (const [key, value] of Object.entries(Images.objectSprites.shadowworld)) {
      let img = new Image()
      img.src = value;
      Images.objectSprites.shadowworld[key] = img;
    }

    Engine.shadowworldObjectSprites = Images.objectSprites.shadowworld;
  }
}