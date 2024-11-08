class AudioLoader {
  static audios = {
    "jump": "./assets/jump.mp3"
  }

  static masterVolume = document.querySelector("#master-volume").value / 100;

  static loadAudios() {
    for (const [key, value] of Object.entries(AudioLoader.audios)) {
      let audio = new Audio(AudioLoader.audios[key]);
      audio.volume = AudioLoader.masterVolume;
      AudioLoader.audios[key] = audio;
      console.log(AudioLoader.audios);
    }
  }
}