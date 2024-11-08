function startGame() {
  document.querySelector("#canvas-div").style.display = "block";
  AudioLoader.loadAudios();
  Engine.init(); //Initializes the game
}