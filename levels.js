class Level {
  static levels = [...levelList]
  /*
  new Tile(300, 300, 50, 50, false, true, Engine.overworldObjectSprites);
new Tile(350, 300, 50, 50, false, true, Engine.overworldObjectSprites);
new Tile(400, 300, 50, 50, false, true, Engine.overworldObjectSprites);
new Tile(450, 300, 50, 50, false, true, Engine.overworldObjectSprites);
new Tile(500, 300, 50, 50, false, true, Engine.overworldObjectSprites);
new Tile(550, 300, 50, 50, false, true, Engine.overworldObjectSprites);
new Tile(600, 300, 50, 50, false, true, Engine.overworldObjectSprites);
new Tile(650, 300, 50, 50, false, true, Engine.overworldObjectSprites);
new Tile(700, 300, 50, 50, false, true, Engine.overworldObjectSprites);
new Tile(750, 300, 50, 50, false, true, Engine.overworldObjectSprites);
new Tile(800, 300, 50, 50, false, true, Engine.overworldObjectSprites);
new Tile(850, 300, 50, 50, false, true, Engine.overworldObjectSprites);
new Tile(900, 300, 50, 50, false, true, Engine.overworldObjectSprites);
new Tile(950, 300, 50, 50, false, true, Engine.overworldObjectSprites);
new Tile(1000, 300, 50, 50, false, true, Engine.overworldObjectSprites);
new Tile(1050, 300, 50, 50, false, true, Engine.overworldObjectSprites);
new Tile(1100, 300, 50, 50, false, true, Engine.overworldObjectSprites);
new Tile(1150, 300, 50, 50, false, true, Engine.overworldObjectSprites);
*/
  static load(level) {
    let levelMap = Level.levels[level]
    console.log(levelMap);
    levelMap.forEach(map => {
      for (const [key, value] of Object.entries(map)) {
        new map[key].type(map[key].x * 50, map[key].y * 50, map[key].width * 50, map[key].height * 50, map[key].shadow, map[key].canCollide, map[key].sprites == "overworldObjectSprites" ? Engine.overworldObjectSprites : Engine.shadowworldObjectSprites)
      }
    })
  }
}