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
      "tile": "./assets/tile.png",
      "unpressedButton": "./assets/unpressedButton.png",
      "pressedButton": "./assets/pressedButton.png",
      "obstacleTile": "./assets/shadowworldObstacleTile.png",
      "supportTile": "./assets/shadowworldSupportTile.png",
      "spike": "./assets/overworldSpikes.png",
      "border": "./assets/border.png",
      "topParallax": "./assets/topParallax.png",
      "portal": "./assets/overworldPortal.png",
      "splitter": "./assets/splitter.png",
      "portalPopup": "./assets/portalPopup.png"
    },
    "shadowworld": {
      "tile": "./assets/shadowTile.png",
      "unpressedButton": "./assets/shadowUnpressedButton.png",
      "pressedButton": "./assets/shadowPressedButton.png",
      "obstacleTile": "./assets/overworldObstacleTile.png",
      "supportTile": "./assets/overworldSupportTile.png",
      "spike": "./assets/shadowworldSpikes.png",
      "bottomParallax": "./assets/bottomParallax.png",
      "portal": "./assets/shadowworldPortal.png"
    },
    "scenes": {

    }
  }

  // Loads all the images from characterSprites and objectSprites using their path values
  static async init() {

    await Promise.all([
      Images.loadSprites(Images.characterSprites.overworld),
      Images.loadSprites(Images.characterSprites.shadowworld),
      Images.loadSprites(Images.objectSprites.overworld),
      Images.loadSprites(Images.objectSprites.shadowworld),
      Images.loadSprites(Images.objectSprites.scenes)
    ]);

    Engine.overworldCharacterSprites = Images.characterSprites.overworld;
    Engine.shadowWorldCharacterSprites = Images.characterSprites.shadowworld;
    Engine.overworldObjectSprites = Images.objectSprites.overworld;
    Engine.shadowworldObjectSprites = Images.objectSprites.shadowworld;
    Engine.scenes = Images.objectSprites.scenes;
  }

  static loadSprites(spriteObject) {
    return Promise.all(
      Object.entries(spriteObject).map(([key, value]) => {
        return new Promise((resolve) => {
          let img = new Image();
          img.src = value;
          img.onload = () => {
            spriteObject[key] = img;
            resolve();
          };
        });
      })
    );
  }
}