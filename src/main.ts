import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import PrimeVue from 'primevue/config'
import Chart from 'primevue/chart'
import ToastService from 'primevue/toastservice'
import DialogService from 'primevue/dialogservice'
import ConfirmationService from 'primevue/confirmationservice'

const app = createApp(App)

app.use(router)
app.use(PrimeVue, {
  unstyled: true
})
//     , {
//   theme: {
//     // preset: Noir,
//     options: {
//       //   prefix: 'p',
//       //   darkModeSelector: '.p-dark',
//       cssLayer: false
//     }
//   }
// })
app.use(ConfirmationService)
app.use(ToastService)
app.use(DialogService)

// eslint-disable-next-line vue/multi-word-component-names
app.component('Chart', Chart)

app.mount('#app')
