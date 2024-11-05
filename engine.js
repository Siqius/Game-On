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

  //static method to initialize the engine
  static init() {
    Images.init();
    console.log(Engine.overworldObjectSprites);
    Level.load(0);
    Engine.playerOne = new Player(300, 100, 50, 50, false, true, 10, 15, Engine.overworldCharacterSprites);
    Engine.active = Engine.playerOne;
    Engine.playerTwo = new Player(300, 500, 50, 50, true, true, 10, 15, Engine.shadowWorldCharacterSprites);

    //(temporary) create tiles for testing purposes

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

  static superRender(ctx) {
    ctx.clearRect(0, 0, Engine.canvas.width, Engine.canvas.height);
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
      let button = event.key;
      if (!(button in Engine.playerControls.keys)) return;

      Engine.players.forEach(player => {
        player.keydown(Engine.playerControls.keys[button])
      })
    });

    document.addEventListener("keyup", event => {
      let button = event.key;
      if (!(button in Engine.playerControls.keys)) return;

      Engine.players.forEach(player => {
        player.keyup(Engine.playerControls.keys[button]);
      })
    });
  }

  static collision(o1, o2) {
    return (o1.x + o1.width + (o2.speed * o2.xVel) >= o2.x &&
      o1.x + (o2.speed * o2.xVel) <= o2.x + o2.width &&
      o1.y + o1.height >= o2.y &&
      o1.y <= o2.y + o2.height)
  }

  static collisionY(o1, o2) {
    return (
      o1.y < o2.y + o2.height &&
      o1.y + o1.height > o2.y
    );
  }

  static collisionX(o1, o2) {
    return (
      o1.x < o2.x + o2.width &&
      o1.x + o1.width > o2.x
    );
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