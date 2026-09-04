const heartBtn = document.getElementById("heartBtn");
const phrasesBox = document.getElementById("phrases");
const audioPlayer = document.getElementById("audioPlayer");
const playBtn = document.getElementById("playBtn");
const progressBar = document.getElementById("progressBar");
const progressFill = document.getElementById("progressFill");
const currentTimeEl = document.getElementById("currentTime");
const durationEl = document.getElementById("duration");
const audioFile = document.getElementById("audioFile");

const messages = [
  "You make my heart happy ❤️",
  "I love you more every day",
  "You are my favorite person",
  "You are my safe place",
  "I am lucky to have you",
  "You make everything better",
  "Always you ❤️",
  "My heart chooses you",
  "You mean the world to me",
  "I will always be here for you",
  "You are the sweetest part of my life",
  "One heart. One person. You.",
  "Your smile lights up my life ☀️❤️",
  "By your side, I'm happy ❤️",
  "My love to you is forever ❤️",
  "With you time stops ⏲️❤️",
  "You're my favourite refuge",
  "You're my home",
  "❤️The one and only Fofo❤️"
];

let messageIndex = 0;

function random(min, max) {
  return Math.random() * (max - min) + min;
}

function createPhrase(text = messages[messageIndex]) {
  messageIndex = (messageIndex + 1) % messages.length;
  const el = document.createElement("div");
  el.className = "phrase";
  el.textContent = text;

  // Keep the messages around the center, like the Reel.
  const angle = random(0, Math.PI * 2);
  const distance = random(115, 250);

  el.style.left = `${random(40, 60)}%`;
  el.style.top = `${random(42, 55)}%`;
  el.style.setProperty("--x", `${Math.cos(angle) * distance}px`);
  el.style.setProperty("--y", `${Math.sin(angle) * distance}px`);
  el.style.setProperty("--r", `${random(-18, 18)}deg`);
  el.style.setProperty("--life", `${random(3.0, 4.6)}s`);

  phrasesBox.appendChild(el);

  setTimeout(() => el.remove(), 5000);
}

function createParticlesBurst() {
  for (let i = 0; i < 28; i++) {
    const p = document.createElement("span");
    p.className = "particle";

    const angle = (Math.PI * 2 * i) / 28 + random(-.15, .15);
    const distance = random(70, 180);

    p.style.setProperty("--px", `${Math.cos(angle) * distance}px`);
    p.style.setProperty("--py", `${Math.sin(angle) * distance}px`);
    p.style.transform = "translate(0, 0)";

    phrasesBox.appendChild(p);
    setTimeout(() => p.remove(), 900);
  }
}

function releasePhrase() {
  heartBtn.classList.add("clicked");

  setTimeout(() => {
    heartBtn.classList.remove("clicked");
  }, 700);

  createParticlesBurst();

  // Each click creates exactly ONE new message.
  createPhrase();
}

function formatTime(seconds) {
  if (!Number.isFinite(seconds)) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60).toString().padStart(2, "0");
  return `${mins}:${secs}`;
}

function seekAudio(e) {
  const rect = progressBar.getBoundingClientRect();
  const clickX = e.clientX - rect.left;

  if (!audioPlayer.duration) return;

  const newTime = (clickX / rect.width) * audioPlayer.duration;
  audioPlayer.currentTime = newTime;
}

heartBtn.addEventListener("click", () => {
  releasePhrase();

  // Browsers normally block autoplay with sound until the user interacts.
  if (audioPlayer.paused) {
    audioPlayer.play().then(() => {
      playBtn.textContent = "❚❚";
    }).catch(() => {});
  }
});

playBtn.addEventListener("click", () => {
  if (audioPlayer.paused) {
    audioPlayer.play().then(() => {
      playBtn.textContent = "❚❚";
    }).catch(() => {});
  } else {
    audioPlayer.pause();
    playBtn.textContent = "▶";
  }
});

progressBar.addEventListener("click", seekAudio);

audioPlayer.addEventListener("timeupdate", () => {
  if (!audioPlayer.duration) return;

  const percent = (audioPlayer.currentTime / audioPlayer.duration) * 100;
  progressFill.style.width = `${percent}%`;
  currentTimeEl.textContent = formatTime(audioPlayer.currentTime);
});

audioPlayer.addEventListener("loadedmetadata", () => {
  durationEl.textContent = formatTime(audioPlayer.duration);
});

audioPlayer.addEventListener("play", () => {
  playBtn.textContent = "❚❚";
});

audioPlayer.addEventListener("pause", () => {
  playBtn.textContent = "▶";
});

audioPlayer.addEventListener("ended", () => {
  playBtn.textContent = "▶";
  progressFill.style.width = "0%";
  currentTimeEl.textContent = "0:00";
});

// Messages appear only when the heart is clicked.
