import { defineComponent, h, onBeforeUnmount, PropType, ref } from 'vue'
import ChartStreaming from 'chartjs-plugin-streaming'
import 'chartjs-adapter-luxon'
import { api } from 'src/boot/axios'

import { Line as LineChart } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  CategoryScale
} from 'chart.js'

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  CategoryScale,
  ChartStreaming
)

ChartJS.defaults.set('plugins.streaming', {
  duration: 40000
});

export default defineComponent({
  name: 'LineChart',
  components: {
    LineChart
  },
  props: {
    chartId: {
      type: String,
      default: 'line-chart'
    },
    width: {
      type: Number,
      default: 700
    },
    height: {
      type: Number,
      default: 300
    },
    cssClasses: {
      default: '',
      type: String
    },
    styles: {
      type: Object,
      default: () => { }
    },
    plugins: {
      type: Array,
      default: () => []
    },
    capKey: {
      type: String
    },
    capChanelId: {
      type: String
    },
    field: {
      type: String
    },
    unity: {
      type: String
    },
    stepSize: {
      type: Number
    },
    name: {
      type: String
    },
    backgroundColor: {
      type: String
    },
    borderColor: {
      type: String
    }
  },
  setup(props) {

    const onPause = ref(false)
    const chartData = {
      labels: [],
      datasets: [
        {
          label: props.name,
          backgroundColor: 'rgba(237, 146, 41, 0.5)',
          borderColor: 'rgba(237, 146, 10, 0.2)',
          data: []
        }
      ]
    }

    const chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      tension: 0.2,
      scales: {
        x: {
          type: 'realtime',
          realtime: {
            pause: onPause.value,
            duration: 40000,
            delay: 10000,
            refresh: 4000,
            frameRate: 60,
            ttl: 60000,
            onRefresh: async chart => {
              await api.get(`channels/${props.capChanelId}/feeds/last`, {
                params: {
                  key: props.capKey
                }
              }).then(({ data }) => {
                if (data != -1) {
                  let field = 0
                  switch (props.field) {
                    case "field1":
                      field = Number(data.field1)
                      break;
                    case "field2":
                      field = Number(data.field2)
                      break;
                    case "field4":
                      field = Number(data.field4)
                      break;

                    default:
                      field = Number(data.field1)
                  }
                  chart.data.datasets[0].data.push({ x: data.created_at, y: field })
                  chart.update('quiet');
                }
              })
            }
          }
        },
        y: {
          beginAtZero: true,
          ticks: {
            callback: (value) => {
              if (value === 0) return ''
              return `${value} ${props.unity}`
            },
            stepSize: props.stepSize,
          },
        },
      },
    }

    onBeforeUnmount(() => {
      onPause.value = true
    })

    return () =>
      h(LineChart, {
        chartData,
        chartOptions,
        chartId: props.chartId,
        width: props.width,
        height: props.height,
        cssClasses: props.cssClasses,
        styles: props.styles,
        plugins: props.plugins
      })
  }
})
