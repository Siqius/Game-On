class Engine {
  static frameRate = 30;
  static canvas = document.querySelector("canvas");
  static ctx = Engine.canvas.getContext("2d");
  static players = [];
  static gameObjects = [];
  static active;
  static leftKey = "d";
  static rightKey = "a";
  static jumpKey = " ";
  static switchKey = "q";
  static playerOne;
  static playerTwo;
  static timeSinceWorldSwitch = 0;
  static worldSwitchDelay = 2000;

  static init() {
    let img = new Image();
    img.src = "./assets/mario.png";
    Engine.playerOne = new Player(300, 100, 50, 50, false, true, 10, 15, img);
    Engine.active = Engine.playerOne;
    Engine.playerTwo = new Player(300, 500, 50, 50, true, true, 10, 15, img)
    let img2 = new Image();
    img2.src = "./assets/tile.png"
    let img3 = new Image();
    img3.src = "./assets/black.png"
    new GameObject(300, 300, 50, 50, false, true, img2);
    new GameObject(350, 300, 50, 50, false, true, img2);
    new GameObject(400, 300, 50, 50, false, true, img2);
    new GameObject(450, 300, 50, 50, false, true, img2);
    new GameObject(500, 300, 50, 50, false, true, img2);
    new GameObject(550, 300, 50, 50, false, true, img2);
    new GameObject(600, 300, 50, 50, false, true, img2);
    new GameObject(650, 300, 50, 50, false, true, img2);
    new GameObject(700, 300, 50, 50, false, true, img2);
    new GameObject(300, 350, 50, 50, true, true, img3);
    new GameObject(350, 350, 50, 50, true, true, img3);
    new GameObject(400, 350, 50, 50, true, true, img3);
    new GameObject(450, 350, 50, 50, true, true, img3);
    new GameObject(500, 350, 50, 50, true, true, img3);
    new GameObject(550, 350, 50, 50, true, true, img3);
    new GameObject(600, 350, 50, 50, true, true, img3);
    new GameObject(650, 350, 50, 50, true, true, img3);
    new GameObject(700, 350, 50, 50, true, true, img3);
    this.keyListeners();
    Engine.gameLoop();
  }

  static gameLoop() {
    let start = Engine.getTime();

    Engine.superMove();
    Engine.superDraw(Engine.ctx);

    // calculate when next frame should be handled
    let end = Engine.getTime();
    let msToNextFrame = Engine.frameRate - (end - start);
    setTimeout(Engine.gameLoop, msToNextFrame);
  }

  static getTime() {
    return Date.now();
  }

  static superDraw(ctx) {
    ctx.clearRect(0, 0, Engine.canvas.width, Engine.canvas.height)
    Engine.gameObjects.forEach(object => {
      object.draw(ctx);
    });
    Engine.players.forEach(player => {
      player.draw(ctx);
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

      if (button == Engine.switchKey) {
        if (Engine.getTime() - Engine.timeSinceWorldSwitch < Engine.worldSwitchDelay) return;
        Engine.timeSinceWorldSwitch = Engine.getTime();
        Engine.active.xVel = 0;
        Engine.active.yVel = 0;
        Engine.active = Engine.active.shadow ? Engine.playerOne : Engine.playerTwo;
      }
      if (button == Engine.jumpKey) {
        Engine.active.keys.jump = true;
      }
      if (button == Engine.leftKey) {
        Engine.active.keys.left = true;
        Engine.active.xVel = 1;
      }
      if (button == Engine.rightKey) {
        Engine.active.keys.right = true;
        Engine.active.xVel = -1;
      }
    })

    document.addEventListener("keyup", event => {
      let button = event.key;

      if (button == Engine.jumpKey) {
        Engine.active.keys.jump = false;
      }
      if (button == Engine.leftKey) {
        Engine.active.keys.left = false;
        if (Engine.active.keys.right) return;
        Engine.active.xVel = 0;
      }
      if (button == Engine.rightKey) {
        Engine.active.keys.right = false;
        if (Engine.active.keys.left) return;
        Engine.active.xVel = 0;
      }
    })
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

      // Check if player's head is touching the bottom of the platform within a small margin (y-axis)
      let isTouchingVertically =
        player.y <= platform.y + platform.height &&
        player.y >= platform.y + platform.height - 5; // 5 pixels as margin for standing

      return isOverlappingHorizontally && isTouchingVertically;
    }


    let isOverlappingHorizontally =
      player.x < platform.x + platform.width &&
      player.x + player.width > platform.x;

    let isTouchingVertically =
      player.y + player.height >= platform.y &&
      player.y + player.height <= platform.y + 5; // 5 pixels as margin for standing

    return isOverlappingHorizontally && isTouchingVertically;
  }
}