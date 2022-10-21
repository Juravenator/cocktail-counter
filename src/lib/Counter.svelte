<script>
  import { sounds } from './state';

  export let name = "unknown";
  $: url_name = name.replaceAll(' ', '-');

  let count = 0;
  const REFRESH_INTERVAL = 10000;
  const refreshCount = () => {
    const apicall = new XMLHttpRequest();
    apicall.responseType = "text"; // old browsers don't support 'json'
    apicall.onreadystatechange = () => {
      if(apicall.readyState == 4 && apicall.status == 200) {
        const r = JSON.parse(apicall.responseText);
        count = r[url_name];
      }
    }
    apicall.open("GET", "/api/counter/" + url_name);
    apicall.send();
  }
  let refresh_timer = setInterval(refreshCount, REFRESH_INTERVAL);
  setTimeout(refreshCount, 0);


  let debounce = false;
  const increment = (event) => {
    if (debounce) {
      return;
    }
    debounce = true;
    clearInterval(refresh_timer);

    const source = sounds.audioCtx.createBufferSource();
    source.buffer = sounds.beep;
    source.connect(sounds.audioCtx.destination);
    source.start(0);
    count += 1;

    try {
      const apicall = new XMLHttpRequest();
      apicall.responseType = "text"; // old browsers don't support 'json'
      apicall.onreadystatechange = () => {
        if(apicall.readyState == 4 && apicall.status == 200) {
          const r = JSON.parse(apicall.responseText);
          count = r[url_name];
        }
      }
      apicall.open("POST", "/api/counter/" + url_name);
      apicall.send();
    } catch (e) {
      alert(e)
    }

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