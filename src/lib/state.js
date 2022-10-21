export const sounds = {
  beep: [],
  // @ts-ignore-next-line
  audioCtx: new (window.AudioContext || window.webkitAudioContext)
}

const req = new XMLHttpRequest();
req.addEventListener("load", function() {
  sounds.audioCtx.decodeAudioData(
    this.response,
    buffer => sounds.beep = buffer,
    err => console.error(`Error with decoding audio data: ${err.err}`)
  );
});
req.responseType = "arraybuffer";
req.open("GET", "/sounds/computerbeep_15.mp3");
req.send();