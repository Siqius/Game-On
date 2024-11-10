class AudioLoader {
  static audios = {
    "sfx": {
      "jump": "./assets/jump.mp3"
    },
    "music": {
    }
  }


  static loadAudios() {
    let sfxVolume = document.querySelector("#sfx-volume").value / 100;
    let musicVolume = document.querySelector("#music-volume").value / 100;
    for (const [key, value] of Object.entries(AudioLoader.audios.sfx)) {
      let audio = new Audio(AudioLoader.audios.sfx[key]);
      audio.volume = sfxVolume;
      AudioLoader.audios.sfx[key] = audio;
    }

    for (const [key, value] of Object.entries(AudioLoader.audios.music)) {
      let audio = new Audio(AudioLoader.audios.music[key]);
      audio.volume = musicVolume;
      AudioLoader.audios.music[key] = audio;
    }
  }
}