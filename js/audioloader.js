class AudioLoader {
  static audios = {
    "sfx": {
      "jump": "./assets/jump.mp3",
      "walk": "./assets/walk.mp3",
      "buttonPress": "./assets/buttonPress.mp3",
      "spikeDeath": "./assets/spikeDeath.mp3",
      "blockBroken": "./assets/blockBroken.mp3",
      "blockPlaced": "./assets/blockPlaced.mp3",
      "portal": "./assets/portal.mp3",
      "nextLevel": "./assets/nextLevel.mp3"
    },
    "music": {
      "backgroundmusic": "./assets/backgroundmusic.mp3"
    }
  }


  static loadAudios() {
    let sfxVolume = document.querySelector("#sfx-volume").value / 100;
    for (const [key, value] of Object.entries(AudioLoader.audios.sfx)) {
      let audio = new Audio(AudioLoader.audios.sfx[key]);
      audio.volume = sfxVolume;
      AudioLoader.audios.sfx[key] = audio;
    }

    for (const [key, value] of Object.entries(AudioLoader.audios.music)) {
      let musicVolume = document.querySelector("#music-volume").value / 200;
      let audio = new Audio(AudioLoader.audios.music[key]);
      audio.volume = musicVolume;
      AudioLoader.audios.music[key] = audio;
    }
  }
}