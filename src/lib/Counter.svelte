<script>
  export let name = "unknown";
  $: url_name = name.replaceAll(' ', '-');

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
        count = apicall.response[url_name];
      }
    }
    apicall.open("GET", "/api/counter/" + url_name);
    apicall.send();
  }
  let refresh_timer = setInterval(refreshCount, REFRESH_INTERVAL);
  setTimeout(refreshCount, 0);

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
        count = apicall.response[url_name];
      }
    }
    apicall.open("POST", "/api/counter/" + url_name);
    apicall.send();

    setTimeout(() => {
      debounce = false;
    }, 100);
    refresh_timer = setInterval(refreshCount, REFRESH_INTERVAL);
    event.preventDefault();
    return false;
  }
</script>

<div button on:touchstart={increment} on:click={increment}>
  <div title>
    <h2>{name}</h2>
  </div>
  <div img>
    <img src="/img/cocktails/{url_name}.jpg" alt="{name} pic">
  </div>
  <p>{count}</p>
</div>

<style lang="scss">
[button] {
  width: 220px;
  // display: table;
  height: 320px;
  // display: block;
  // height: 50px;
  display: inline-block;
  background-color: rgb(213, 155, 48);
  color: black;
  text-align: center;
  margin-bottom: 10px;

  & > div[title] {
    height: 53px; // 2*line-height + 5px
  }

  & > div[img] {
    width: 200px;
    height: 200px;
    margin-left: auto;
    margin-right: auto;
    img {
      display: block;
      max-width: 200px;
      max-height: 200px;
      margin-left: auto;
      margin-right: auto;
    }
  }
  h2 {
    text-transform: capitalize;
  }
}
</style>