import { createApp } from "vue"
import "./styles/main.css"
import App from "./App.vue"
import { createHead, createPinia, createRouter } from "~/modules"

const app = createApp(App)

app.use(createHead()).use(createPinia()).use(createRouter())

app.mount("#app")
