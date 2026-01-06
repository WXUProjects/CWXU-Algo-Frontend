import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

// JetBrains Mono 字体
import "@fontsource/jetbrains-mono"; // Defaults to weight 400
import "@fontsource/jetbrains-mono/400.css"; // Specify weight
import "@fontsource/jetbrains-mono/400-italic.css"; // Specify weight and style

// noto sans sc 字体
import "@fontsource/noto-sans-sc"; // Defaults to weight 400
import "@fontsource/noto-sans-sc/400.css"; // Specify weight

// FontAwesome 图标库
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faUser, faHome, faSun, faMoon, faTrophy, faCrosshairs, faGlobe, faGaugeHigh, faChartLine, faPeopleGroup, } from '@fortawesome/free-solid-svg-icons'

// 主题
import './assets/css/theme.css'

library.add(
    faUser,
    faHome,
    faSun,
    faMoon,
    faTrophy,
    faCrosshairs,
    faGlobe,
    faGaugeHigh,
    faChartLine,
    faPeopleGroup
)

const app = createApp(App)

app.component('font-awesome-icon', FontAwesomeIcon)
app.use(createPinia())
app.use(router)

app.mount('#app')
