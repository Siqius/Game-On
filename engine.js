class Engine {
  // declare static game variables
  static frameRate = 30;
  static running = true;
  static canvas = document.querySelector("canvas");
  static ctx = Engine.canvas.getContext("2d");
  static players = [];
  static gameObjects = [];
  static playerOne;
  static playerTwo;
  static active;
  static timeSinceWorldSwitch = 0;
  static worldSwitchDelay = 1000;
  static worldSwitchTimeout = 1000;
  static playerControls = new Controls({ "d": "left", "a": "right", "s": "jump", "q": "attack", " ": "swap" });
  static overworldCharacterSprites;
  static shadowWorldCharacterSprites;
  static overworldObjectSprites;
  static shadowworldObjectSprites;
  static levelMap;
  static globalY = 0;
  static worldSwitchTimer = 2000;
  static gravityStrength = 1;
  static backgroundImage;
  static shouldMoveTiles = true;

  //static method to initialize the engine
  static init() {
    //load all images from sources
    Images.init();
    //load the first level (will be revamped in the future)
    Level.loadFromImage(1);

    Engine.backgroundImage = new Image();
    Engine.backgroundImage.src = "./assets/background.png";

    //create the two characters, set the first one to be active
    Engine.playerOne = new Player(150, 100, 50, 50, false, true, 5, 15, Engine.overworldCharacterSprites);
    Engine.active = Engine.playerOne;
    Engine.playerTwo = new Player(150, 1000, 50, 50, true, true, 5, 15, Engine.shadowWorldCharacterSprites);

    //initialize keylisteners and gameloop
    Engine.keyListeners();
    Engine.gameLoop();
  }

  //gameloop, self explanatory
  static gameLoop() {
    let start = Engine.getTime();

    Engine.superMove();
    Engine.superRender(Engine.ctx);

    // calculate when next frame should be handled
    let end = Engine.getTime();
    let msToNextFrame = Engine.frameRate - (end - start);
    setTimeout(Engine.gameLoop, msToNextFrame);
  }

  static getTime() {
    return Date.now();
  }

  static sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  static superRender(ctx) {
    ctx.drawImage(Engine.backgroundImage, 0, Engine.globalY, Engine.canvas.width, Engine.canvas.height + 400);
    Engine.gameObjects.forEach(object => {
      object.render(ctx);
    });
    Engine.players.forEach(player => {
      player.render(ctx);
    })
  }

  static superMove() {
    Engine.players.forEach(player => {
      player.update();
    })
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
    if (!(player.canCollide && object.canCollide)) return;
    if (player.shadow != object.shadow) return;
    let isOverlappingHorizontally =
      player.x < object.x + object.width &&
      player.x + player.width > object.x;

    let isOverlappingVertically =
      player.y < object.y + object.height &&
      player.y + player.height > object.y;

    return isOverlappingHorizontally && isOverlappingVertically;
  }
}