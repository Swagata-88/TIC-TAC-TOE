function safelyPlay(audio) {
  if (!audio) return;

  audio.currentTime = 0;
  audio.play().catch(() => {
    // Browsers may block audio until the user interacts with the page.
  });
}

function playBackground(audio) {
  if (!audio) return;

  audio.play().catch(() => {
    // Ignore autoplay restrictions safely.
  });
}

export function createAudioController() {
  const backgroundMusic = document.getElementById("bgMusic");
  const clickSound = document.getElementById("clickSound");
  const winSound = document.getElementById("winSound");

  backgroundMusic.volume = 0.35;

  return {
    playClick() {
      safelyPlay(clickSound);
    },

    playWin() {
      safelyPlay(winSound);
    },

    startMusic() {
      playBackground(backgroundMusic);
    },

    toggleMusic() {
      if (backgroundMusic.paused) {
        playBackground(backgroundMusic);
        return true;
      }

      backgroundMusic.pause();
      return false;
    },
  };
}