<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import type MeteoType from '@/utils/types/MeteoType'
import API from '@/utils/API'

const api = new API()
const countryName = ref<string>('')
const data = ref<MeteoType>({})
const displayCityInput = ref<boolean>(false)
const dataHistory = ref<[]>([])
const labelData = ref<[]>([])
const leftSide = ref([
  {
    title: 'Meteo',
    icon: '/icons/weather.svg',
    content: 'Découvrez notre offre de services et notre activité'
  },
  {
    title: 'Explorer',
    icon: '/icons/explore.svg',
    content: 'Consultez nos prestations et services'
  },
  {
    title: 'Villes',
    icon: '/icons/location.svg',
    content: 'Découvrez nos partenaires reconnus'
  },
  {
    title: 'Parametre',
    icon: '/icons/params.svg',
    content: 'Contactez-nous pour plus de détails'
  }
])
const rightSide = ref([
  {
    title: 'Temperature',
    value: data.value.temperature || 0 + ' °C',
    image: '/icons/temp.svg'
  },
  {
    title: 'Force du vent',
    value: data.value.wind_speed || 0 + 'Km/h',
    image: '/icons/wind_power.svg'
  },
  {
    title: 'Humidite',
    value: data.value.humidity || 0,
    image: '/icons/humidity.svg'
  },
  {
    title: 'Ultra violet',
    value: data.value.uv_index || 0,
    image: '/icons/u_v.svg'
  }
])

const chartData = ref()
const chartOptions = ref()

const setChartData = () => {
  return {
    labels: labelData.value,
    // labels: ['', '', '', '', '', '', ''],
    datasets: [
      {
        label: '',
        fill: true,
        borderColor: 'yellow',
        yAxisID: 'y1',
        tension: 0.4,
        data: dataHistory.value
      }
    ]
  }
}
const setChartOptions = () => {
  const documentStyle = getComputedStyle(document.documentElement)
  const surfaceBorder = documentStyle.getPropertyValue('--p-content-border-color')

  return {
    stacked: false,
    maintainAspectRatio: false,
    aspectRatio: 0.6,
    plugins: {
      legend: {
        labels: {
          color: 'white'
        }
      }
    },
    scales: {
      x: {
        ticks: {
          color: 'white'
        },
        grid: {
          color: surfaceBorder
        }
      },
      y: {
        type: 'linear',
        display: false,
        position: 'left',
        ticks: {
          color: 'white'
        },
        grid: {
          color: surfaceBorder
        }
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        ticks: {
          color: 'white'
        },
        grid: {
          drawOnChartArea: false,
          color: surfaceBorder
        }
      }
    }
  }
}

watch(data, () => {
  rightSide.value = [
    {
      title: 'Temperature',
      value: data.value.temperature || 0 + ' °C',
      image: '/icons/temp.svg'
    },
    {
      title: 'Force du vent',
      value: data.value.wind_speed || 0 + 'Km/h',
      image: '/icons/wind_power.svg'
    },
    {
      title: 'Humidite',
      value: data.value.humidity || 0,
      image: '/icons/humidity.svg'
    },
    {
      title: 'Ultra violet',
      value: data.value.uv_index || 0,
      image: '/icons/u_v.svg'
    }
  ]
})

// const computedRightSide = computed(() => {
//   console.log(rightSide.value)
//   return rightSide.value
// })

function getWaetherDatas() {
  api.getData(api.apiUrl + `/weather?city=${countryName.value}`).then((res) => {
    console.log(res)
    data.value = res
    api.getData(api.apiUrl + `/weather/UV?city=${countryName.value}`).then((res) => {
      console.log(res)
      data.value = { ...data.value, ...res }
      console.log(data.value)
      getTemperatureHistory().then(() => {
        console.log(dataHistory.value)
        dataHistory.value = dataHistory.value.map((element) => {
          labelData.value.push(getHourFromDateString(element.time))
          return element.temp
        })
        console.log(dataHistory.value)
        chartData.value = setChartData()
        // console.log(chartData.value)
        chartOptions.value = setChartOptions()
        // console.log(chartOptions.value)
      })
    })
  })
}
async function getTemperatureHistory() {
  await api
    .getData(api.apiUrl + `/weather/temperature?city=${countryName.value}`)
    .then((res) => {
      // console.log(res.temperature_data)
      dataHistory.value = res.temperature_data
    })
    .catch(() => {
      console.log('Failed to get temperature history')
    })
}

function getHourFromDateString(dateString: string): string {
  const date = new Date(dateString)
  const hours = date.getUTCHours().toString().padStart(2, '0')
  const minutes = date.getUTCMinutes().toString().padStart(2, '0')

  return `${hours}:${minutes}`
}

// onMounted(async () => {
//   getTemperatureHistory().then(() => {
//     console.log(dataHistory.value)
//     dataHistory.value = dataHistory.value.map((element) => {
//       labelData.value.push(getHourFromDateString(element.time))
//       return element.temp
//     })
//     console.log(dataHistory.value)
//     chartData.value = setChartData()
//     // console.log(chartData.value)
//     chartOptions.value = setChartOptions()
//     // console.log(chartOptions.value)
//   })
// })

// onMounted(() => {})
</script>

<template>
  <div class="w-screen text-white px-16 py-8 h-screen flex flex-col gap-10 main">
    <!-- First part -->
    <div class="flex justify-between">
      <div class="flex flex-col justify-between">
        <div class="flex flex-col gap-8">
          <div
            class="flex items-center w-fit gap-2 px-2 py-1 rounded-md blurEffect transition-all duration-150 ease-in-out"
          >
            <img src="/icons/location.svg" alt="location" />
            <div>
              <p>{{ data.city || 'Select city' }}</p>
              <!-- <img src="" alt="row_right" /> -->
            </div>
          </div>
          <div class="text-5xl">Nuageux</div>
        </div>
        <div>
          <p class="text-5xl font-medium">{{ data.temperature || 0 }} °C</p>
          <p>Sunday | 12 Dec 2023</p>
        </div>
      </div>
      <div><img src="/icons/weather.svg" alt="weather_icon" class="h-32" /></div>
    </div>
    <!-- Second part -->
    <div class="w-full h-full flex gap-4 justify-between">
      <div
        class="blurEffect h-full rounded-3xl min-w-16 flex flex-col justify-between items-center py-4"
      >
        <!--  -->
        <div class="border h-fit w-fit rounded-full">
          <img src="/images/bg.jpg" alt="profile" class="w-8 h-8 rounded-full" />
        </div>
        <!--  -->
        <div class="flex flex-col gap-4">
          <!--  -->
          <div
            v-for="(item, index) in leftSide"
            :key="index"
            @click="
              () => {
                if (item.title == 'Villes')
                  displayCityInput ? (displayCityInput = false) : (displayCityInput = true)
              }
            "
            class="flex flex-col hover:bg-gray-400 cursor-pointer relative z-40 w-14 h-14 hover:rounded-full items-center justify-center transition-all duration-150 ease-in-out"
          >
            <img :src="item.icon" :alt="item.title" class="w-6 h-6" />
            <p class="text-xs">{{ item.title }}</p>
          </div>
        </div>
      </div>
      <div
        :class="
          displayCityInput
            ? 'absolute scale-100 flex flex-col gap-2 left-32 bottom-24 ml-2 z-40 blurEffect px-2 rounded-lg py-2 transition-all duration-150 ease-in-out'
            : 'absolute scale-0 flex flex-col gap-2 left-32 bottom-24 ml-2 z-40 blurEffect px-2 rounded-lg py-2 transition-all duration-150 ease-in-out'
        "
      >
        <label for="country">Entrer le pays cible</label>
        <div class="flex items-center gap-2">
          <input
            v-model="countryName"
            type="text"
            name="country"
            id="country"
            class="rounded-lg pl-4 h-10 text-black outline-yellow-500"
          />
          <div
            class="bg-white rounded-lg min-w-10 min-h-10 flex items-center justify-center cursor-pointer"
            @click="
              () => {
                getWaetherDatas()
                displayCityInput = false
              }
            "
          >
            <img src="/icons/search.svg" alt="search" class="w-8 h-8" />
          </div>
        </div>
      </div>
      <div class="w-full h-full relative flex flex-col gap-4">
        <div class="blurEffect w-full pl-4 flex py-4 justify-around h-fit rounded-3xl">
          <div class="flex items-center py-4 px-4">
            <img src="/icons/location.svg" alt="location" />
            <p>{{ data.city || 'Select city' }}</p>
          </div>
          <div class="px-4 flex gap-16">
            <div class="flex flex-col">
              <p class="text-4xl font-semibold">{{ data.temperature || 0 }} °C</p>
              <p>Ensoleille</p>
            </div>
            <div class="flex items-center gap-2">
              <img src="/icons/humidity.svg" alt="humidity" class="w-10 h-10" />
              <div class="flex flex-col">
                <p class="">Humidite</p>
                <p>{{ data.humidity || 0 }} %</p>
              </div>
            </div>
            <div class="flex items-center gap-2">
              <img src="/icons/u_v.svg" alt="humidity" class="w-10 h-10" />
              <div class="flex flex-col">
                <p class="">UV</p>
                <p>{{ data.uv_index || 0 }}</p>
              </div>
            </div>
          </div>
        </div>
        <div class="blurEffect w-full h-full flex flex-col rounded-3xl pl-8 pr-8 pb-4 pt-4">
          <div class="flex items-center">
            <img src="/icons/clock.svg" alt="clock" />
            <p>Evolution de la temperature dans les 24 derniere heures</p>
          </div>
          <div class="pt-2 text-center h-full text-xl">
            <Chart type="line" :data="chartData" :options="chartOptions" class="h-full" />
          </div>
        </div>
      </div>
      <div class="blurEffect h-full min-w-72 flex flex-col gap-10 py-8 items-center rounded-3xl">
        <div class="flex items-center px-2 text-center">
          <img src="/icons/clock.svg" alt="clock" />
          <p>{{ new Date() }}</p>
        </div>
        <!--  -->
        <div class="w-full px-6 flex flex-col gap-2">
          <p class="font-semibold">AIR CONDITIONS</p>
          <div class="flex flex-col gap-6">
            <!--  -->
            <div
              v-for="(item, index) in rightSide"
              :key="index"
              class="flex items-center gap-2 hover:bg-gray-400 px-2 rounded-lg transition-all duration-150 ease-in-out cursor-pointer"
            >
              <img :src="item.image" :alt="item.title" />
              <div>
                <p>{{ item.title }}</p>
                <p>{{ item.value }}</p>
              </div>
            </div>
            <!--  -->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.main {
  background-image: url('/images/bg.jpg');
  background-size: cover;
}
.blurEffect {
  @apply bg-white/25 backdrop-blur-xl;
}
</style>
