<script>
  export let counter_name = "unknown";

  // @ts-ignore-next-line
  const audioCtx = new (window.AudioContext || window.webkitAudioContext)
  let beep15;
  function reqListener () {
    audioCtx.decodeAudioData(
      this.response,
      buffer => beep15 = buffer,
      err => console.error(`Error with decoding audio data: ${err.err}`)
    );
  }

  let count = 0;
  const REFRESH_INTERVAL = 10000;
  const refreshCount = () => {
    const apicall = new XMLHttpRequest();
    apicall.responseType = "json";
    apicall.onreadystatechange = () => {
      if(apicall.readyState == 4 && apicall.status == 200) {
        count = apicall.response[counter_name];
      }
    }
    apicall.open("GET", "/api/counter/" + counter_name);
    apicall.send();
  }
  let refresh_timer = setInterval(refreshCount, REFRESH_INTERVAL);
  refreshCount();

  const req = new XMLHttpRequest();
  req.addEventListener("load", reqListener);
  req.responseType = "arraybuffer";
  req.open("GET", "/sounds/computerbeep_15.mp3");
  req.send();


  let debounce = false;
  const increment = (event) => {
    if (debounce) {
      return;
    }
    debounce = true;
    clearInterval(refresh_timer);

    const source = audioCtx.createBufferSource();
    source.buffer = beep15;
    source.connect(audioCtx.destination);
    source.start(0);
    count += 1;

    const apicall = new XMLHttpRequest();
    apicall.responseType = "json";
    apicall.onreadystatechange = () => {
      if(apicall.readyState == 4 && apicall.status == 200) {
        count = apicall.response[counter_name];
      }
    }
    apicall.open("POST", "/api/counter/" + counter_name);
    apicall.send();

    setTimeout(() => {
      debounce = false;
    }, 100);
    refresh_timer = setInterval(refreshCount, REFRESH_INTERVAL);
    event.preventDefault();
    return false;
  }
</script>

<button on:touchstart={increment} on:click={increment}>
  <p>{counter_name}</p>
  <img src="/img/cocktails/{counter_name}.jpg" alt="{counter_name} pic">
  <p>{count}</p>
</button>

<style lang="scss">
button {
  img {
    display: block;
    width: 200px;
  }
}
</style>