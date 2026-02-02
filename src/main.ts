import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import ToastPlugin from './plugins/toast'

// JetBrains Mono 字体
import "@fontsource/jetbrains-mono"; // Defaults to weight 400
import "@fontsource/jetbrains-mono/400.css"; // Specify weight
import "@fontsource/jetbrains-mono/400-italic.css"; // Specify weight and style

import "@chinese-fonts/maple-mono-cn/dist/MapleMono-CN-Regular/result.css";

// FontAwesome 图标库
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faUser, faHome, faSun, faMoon, faTrophy, faCrosshairs, faGlobe, faGaugeHigh, faChartLine, faPeopleGroup, faFlag, faStar, faList, faComment, faCalendarDays, } from '@fortawesome/free-solid-svg-icons'

// 主题
import './assets/css/theme.css'
// 字号
import './assets/css/fontsize.css'

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
    faPeopleGroup,
    faFlag,
    faStar,
    faList,
    faComment,
    faCalendarDays
)

const pinia = createPinia()
const app = createApp(App)

app.component('font-awesome-icon', FontAwesomeIcon)
app.use(pinia)
app.use(router)
app.use(ToastPlugin)

app.mount('#app')
