class Cutscene {
  constructor(scenes) {
    this.currentScene = 1;
    this.scenes = scenes;
    this.load = false;
  }
  loadScene() {
    this.load = true;
    Engine.ctx.drawImage(this.scenes[`scene${this.currentScene}`], 0, 0, Engine.canvas.width, Engine.canvas.height);
  }

  nextScene() {
    this.currentScene += 1;
    if (!(this.scenes[`scene${this.currentScene}`] instanceof Image)) {
      this.load = false;
      Engine.running = true;
    }
  }
}