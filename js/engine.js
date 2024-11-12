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
  static globalY = 0;
  static globalX = 0;
  static worldSwitchTimer = 2000;
  static gravityStrength = 1;
  static backgroundImage;
  static borderImage;
  static parallax1;
  static parallax2;
  static backgroundMusic;
  static currentLevel = 1;

  //static method to initialize the engine
  static async init() {
    document.querySelector(".menu-container").style.display = "none";
    document.querySelector("#canvas-div").style.display = "block";
    AudioLoader.loadAudios();

    //load all images from sources
    await Images.init();

    Level.loadFromImage(Engine.currentLevel);

    Engine.parallax1 = new Image();
    Engine.parallax1.src = "./assets/parallax1.png";
    Engine.parallax2 = new Image();
    Engine.parallax2.src = "./assets/parallax2.png";

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

    Level.loadFromImage(Engine.currentLevel);

    //create the two characters, set the first one to be active
    Engine.playerOne = new Player(150, -100, 50, 50, false, true, 5, 15, Engine.overworldCharacterSprites);
    Engine.active = Engine.playerOne;
    Engine.playerTwo = new Player(150, 1000, 50, 50, true, true, 5, 15, Engine.shadowWorldCharacterSprites);
  }

  static restart() {
    Engine.reset();

    document.querySelector(".game-over-container").style.display = "none";
    document.querySelector("#canvas-div").style.display = "block";

    Engine.backgroundMusic.play();
    Engine.backgroundMusic.addEventListener("ended", function () {
      Engine.backgroundMusicFunction()
    }, false);

    Engine.running = true;
    Engine.gameLoop();
  }


  static nextLevel() {
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
    Engine.frame = Engine.frame % Engine.frameRate == 0 ? 1 : Engine.frame + 1; // count frames
    let start = Engine.getTime();

    //logic
    Engine.superMove();

    //render
    Engine.superRender(Engine.ctx);

    // calculate when next frame should be handled
    let end = Engine.getTime();
    let msToNextFrame = Engine.frameRate - (end - start);
    if (Engine.running) {
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
    ctx.clearRect(0, 0, Engine.canvas.width, Engine.canvas.height)
    ctx.drawImage(Engine.overworldObjectSprites.border, 0, Engine.globalY, Engine.canvas.width, Engine.canvas.height + 400);
    //ctx.drawImage(Engine.parallax1, 0, Engine.globalY, Engine.canvas.width, Engine.canvas.height + 400);
    //ctx.drawImage(Engine.parallax2, 0, Engine.globalY, Engine.canvas.width, Engine.canvas.height + 400);

    //render gameObjects 
    Engine.gameObjects.forEach(object => {
      object.render(ctx);
    });

    //render players
    Engine.players.forEach(player => {
      player.render(ctx);
    })
  }

  static superMove() {
    Engine.players.forEach(player => {
      player.update();
    })
  }

  static backgroundMusicFunction() {
    console.log("HELLO")
    Engine.backgroundMusic.play();
  }

  static keyListeners() {
    document.addEventListener("keydown", event => {
      let button = event.key.toLowerCase();
      if (!(button in Engine.playerControls.keys)) return;

      Engine.playerControls.controls[Engine.playerControls.keys[button]] = true;
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