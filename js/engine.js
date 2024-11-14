class Engine {
  // declare static game variables
  static frameRate = 25;
  static timeBetweenFramesInMs = 1000 / Engine.frameRate;
  static frame = 0;
  static running = true;
  static canvas = document.querySelector("canvas");
  static ctx = Engine.canvas.getContext("2d", { willReadFrequently: true });
  static players = [];
  static gameObjects = [];
  static buttons = [];
  static linkedObjects = [];
  static portals = [];
  static parallaxes = [];
  static playerOne;
  static playerTwo;
  static active;
  static timeSinceWorldSwitch = 0;
  static worldSwitchDelay = 1000;
  static worldSwitchTimeout = 1000;
  static playerControls = new Controls({ "a": "left", "d": "right", "w": "jump", " ": "swap" });
  static overworldCharacterSprites;
  static shadowWorldCharacterSprites;
  static overworldObjectSprites;
  static shadowworldObjectSprites;
  static cutScene;
  static scenes;
  static globalY = 0;
  static overworldX = -10000;
  static shadowworldX = -10000;
  static worldSwitchTimer = 2000;
  static gravityStrength = 1;
  static backgroundImage;
  static borderImage;
  static parallax1;
  static parallax2;
  static backgroundMusic;
  static currentLevel = 1;
  static lastLevel = 5;
  static cutSceneFrameInterval = 1000;
  static timeSinceLastCutSceneFrame = 0;

  //static method to initialize the engine
  static async init() {
    document.querySelector(".menu-container").style.display = "none";
    document.querySelector("#canvas-div").style.display = "flex";
    AudioLoader.loadAudios();

    //load all images from sources
    await Images.init();

    Level.loadFromImage(Engine.currentLevel);

    Engine.cutScene = new Cutscene(Engine.scenes);

    new Parallax(Engine.overworldObjectSprites.topParallax, 0.01, false);
    new Parallax(Engine.shadowworldObjectSprites.bottomParallax, 0.01, true);

    //load backgroundmusic
    Engine.backgroundMusic = AudioLoader.audios.music.backgroundmusic.cloneNode(true);
    Engine.backgroundMusic.volume = AudioLoader.audios.music.backgroundmusic.volume;
    Engine.backgroundMusic.play();
    Engine.backgroundMusic.addEventListener("ended", function () {
      Engine.backgroundMusicFunction()
    }, false);

    //create the two characters, set the first one to be active
    Engine.playerOne = new Player(150, 300, 50, 50, false, true, 5, 15, Engine.overworldCharacterSprites);
    Engine.active = Engine.playerOne;
    Engine.playerTwo = new Player(150, 750, 50, 50, true, true, 5, 15, Engine.shadowWorldCharacterSprites);

    //initialize keylisteners and gameloop
    Engine.keyListeners();
    Engine.gameLoop();
  }

  static reset() {
    Engine.players = [];
    Engine.gameObjects = [];
    Engine.buttons = [];
    Engine.linkedObjects = [];
    Engine.portals = [];
    Engine.playerOne;
    Engine.playerTwo;
    Engine.active;
    Engine.playerControls = new Controls({ "a": "left", "d": "right", "w": "jump", "q": "attack", " ": "swap" });
    Engine.globalY = 0;
    Engine.gravityStrength = 1;
    Engine.cutScene.currentScene = 1;

    document.querySelector("#movement").src = "./assets/movement.png";
    document.querySelector("#worldjump").src = "./assets/worldJump.png";

    Level.loadFromImage(Engine.currentLevel);

    //create the two characters, set the first one to be active
    Engine.playerOne = new Player(150, 300, 50, 50, false, true, 5, 15, Engine.overworldCharacterSprites);
    Engine.active = Engine.playerOne;
    Engine.playerTwo = new Player(150, 750, 50, 50, true, true, 5, 15, Engine.shadowWorldCharacterSprites);
  }

  static restart() {
    Engine.reset();

    document.querySelector(".game-over-container").style.display = "none";
    document.querySelector("#canvas-div").style.display = "flex";

    Engine.backgroundMusic.play();
    Engine.backgroundMusic.addEventListener("ended", function () {
      Engine.backgroundMusicFunction()
    }, false);

    Engine.running = true;
    Engine.gameLoop();
  }


  static nextLevel() {
    let audio = AudioLoader.audios.sfx.nextLevel.cloneNode(true);
    audio.volume = AudioLoader.audios.sfx.nextLevel.volume;
    audio.play();

    if (Engine.currentLevel == Engine.lastLevel) {
      Engine.running = false;
      document.querySelector("#canvas-div").style.display = "none";
      document.querySelector(".win-container").style.display = "block";
      Engine.backgroundMusic.removeEventListener("ended", function () {
        Engine.backgroundMusicFunction()
      }, false);
      return;
    }

    Engine.currentLevel += 1;
    Engine.reset();
  }

  static stop() {
    Engine.running = false;
    document.querySelector("#canvas-div").style.display = "none";
    document.querySelector(".game-over-container").style.display = "block";
    Engine.backgroundMusic.removeEventListener("ended", function () {
      Engine.backgroundMusicFunction()
    }, false);
  }

  //gameloop, self explanatory
  static gameLoop() {
    if (Engine.running) {
      Engine.frame = Engine.frame % Engine.frameRate == 0 ? 1 : Engine.frame + 1; // count frames
      let start = Engine.getTime();

      //logic
      Engine.superMove();

      //render
      Engine.superRender(Engine.ctx);

      // calculate when next frame should be handled
      let end = Engine.getTime();
      let msToNextFrame = Engine.frameRate - (end - start);
      setTimeout(Engine.gameLoop, msToNextFrame);
    }
  }

  static getTime() {
    return Date.now();
  }

  static sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  static superRender(ctx) {
    ctx.clearRect(0, 0, Engine.canvas.width, Engine.canvas.height);

    if (Engine.cutScene.load) {
      Engine.cutScene.loadScene();
      return;
    }

    Engine.parallaxes.forEach(parallax => {
      parallax.render(ctx);
    })

    //render gameObjects 
    Engine.gameObjects.forEach(object => {
      object.render(ctx);
    });

    //render players
    Engine.players.forEach(player => {
      player.render(ctx);
    })

    Engine.portals.forEach(portal => {
      if (Engine.active.shadow != portal.shadow) return;
      if (!portal.activated)
        if (Engine.active.x + (Engine.active.width / 2) - portal.x + (portal.width / 2) < 100 && Engine.active.x + (Engine.active.width / 2) - portal.x + (portal.width / 2) > 0 && Engine.active.shadow == portal.shadow) {
          if (portal.shadow) {
            if (portal.y + 50 > Engine.active.y && portal.y - 50 < Engine.active.y) {
              Engine.ctx.drawImage(Engine.overworldObjectSprites.portalPopup, portal.x - 25, portal.y + 50 + Engine.globalY);
            }
          } else {
            if (Engine.active.y + (Engine.active.height / 2) - portal.y + (portal.height / 2) < 100 && Engine.active.y + (Engine.active.height / 2) - portal.y + (portal.height / 2) > -50) {
              Engine.ctx.drawImage(Engine.overworldObjectSprites.portalPopup, portal.x - 25, portal.y - 50);
            }
          }
        }
    })
    ctx.drawImage(Engine.overworldObjectSprites.splitter, 0, (Engine.globalY + ((Engine.canvas.height + 300) / 2)) - Engine.overworldObjectSprites.splitter.height / 2);
  }

  static superMove() {
    Engine.players.forEach(player => {
      player.update();
    })
  }

  static backgroundMusicFunction() {
    Engine.backgroundMusic.play();
  }

  static keyListeners() {
    document.addEventListener("keydown", event => {
      let button = event.key.toLowerCase();
      if (button in Engine.playerControls.keys)
        Engine.playerControls.controls[Engine.playerControls.keys[button]] = true;
      else if (button == "e") {
        Engine.portals.forEach(portal => {
          portal.activate();
        })
      }
      if (Engine.getTime() - Engine.timeSinceLastCutSceneFrame > Engine.cutSceneFrameInterval) {
        Engine.cutScene.nextScene();
      }
    });

    document.addEventListener("keyup", event => {
      let button = event.key.toLowerCase();
      if (!(button in Engine.playerControls.keys)) return;

      Engine.playerControls.controls[Engine.playerControls.keys[button]] = false;
    });
  }

  static isTouchingCeiling(player, platform) {
    if (!(player.canCollide && platform.canCollide)) return false;
    if (player.shadow !== platform.shadow) return false;

    if (player.shadow) {
      let isOverlappingHorizontally =
        player.x < platform.x + platform.width &&
        player.x + player.width > platform.x;

      const isTouchingVertically =
        player.y + player.height >= platform.y &&
        player.y + player.height <= platform.y + 25;

      return isOverlappingHorizontally && isTouchingVertically && player.yVel > 0;
    }

    let isOverlappingHorizontally =
      player.x < platform.x + platform.width &&
      player.x + player.width > platform.x;

    let isTouchingVertically =
      player.y <= platform.y + platform.height &&
      player.y >= platform.y + platform.height - 25;

    return isOverlappingHorizontally && isTouchingVertically && player.yVel < 0;
  }

  static isStandingOn(player, platform) {
    if (!(player.canCollide && platform.canCollide)) return;
    if (!(player.shadow == platform.shadow)) return;
    if (player.shadow) {
      let isOverlappingHorizontally =
        player.x < platform.x + platform.width &&
        player.x + player.width > platform.x;

      let isTouchingVertically =
        player.y <= platform.y + platform.height &&
        player.y >= platform.y + platform.height - 25; // 5 pixels as margin

      return isOverlappingHorizontally && isTouchingVertically;
    }


    let isOverlappingHorizontally =
      player.x < platform.x + platform.width &&
      player.x + player.width > platform.x;

    let isTouchingVertically =
      player.y + player.height >= platform.y &&
      player.y + player.height <= platform.y + 25; // 5 pixels as margin

    return isOverlappingHorizontally && isTouchingVertically && player.yVel >= 0;
  }

  static isCollidingWithWall(player, object) {
    if (!(player.canCollide && object.canCollide)) return false;
    if (player.shadow != object.shadow) return false;

    if (player.shadow) {
      let isOverlappingHorizontally =
        player.x < object.x + object.width &&
        player.x + player.width > object.x;

      let isOverlappingVertically =
        player.y < object.y + object.height &&
        player.y + player.height > object.y;

      if (isOverlappingHorizontally && isOverlappingVertically)
        return isOverlappingHorizontally && isOverlappingVertically;
    }

    let isOverlappingHorizontally =
      player.x < object.x + object.width &&
      player.x + player.width > object.x;

    let isOverlappingVertically =
      player.y < object.y + object.height &&
      player.y + player.height > object.y;

    if (isOverlappingHorizontally && isOverlappingVertically)
      return isOverlappingHorizontally && isOverlappingVertically
  }
}