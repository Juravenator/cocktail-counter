import './app.css'
import App from './App.svelte'
import 'audioContext-polyfill'

const app = new App({
  target: document.getElementById('app')
})

export default app
