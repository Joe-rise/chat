import { createApp } from 'vue'
import App from './App.vue'
import * as ELIcons from '@element-plus/icons-vue'
const app = createApp(App)
for (let iconName in ELIcons) {
	app.component(iconName, ELIcons[iconName])
}
app.mount('#app')
