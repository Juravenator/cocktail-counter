<script>
  // @ts-ignore-next-line
  const audioCtx = new (window.AudioContext || window.webkitAudioContext)
  let beep15;
  function reqListener () {
    console.log(this.response);
    audioCtx.decodeAudioData(
      this.response,
      buffer => beep15 = buffer,
      err => console.error(`Error with decoding audio data: ${err.err}`)
    );
  }

  const req = new XMLHttpRequest();
  req.addEventListener("load", reqListener);
  req.responseType = "arraybuffer";
  req.open("GET", "/sounds/computerbeep_15.mp3");
  req.send();

  let count = 0;
  let debounce = false;
  const increment = (event) => {
    if (debounce) {
      return;
    }
    debounce = true;

    const source = audioCtx.createBufferSource();
    source.buffer = beep15;
    source.connect(audioCtx.destination);
    source.start(0);
    count += 1;
    setTimeout(() => {
      debounce = false;
    }, 100);
    event.preventDefault();
    return false;
  }
</script>

<button on:touchstart={increment} on:click={increment}>
  count is {count}
</button>
