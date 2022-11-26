import { defineComponent, h, onMounted, PropType, reactive, ref } from 'vue'
import { api } from 'src/boot/axios'
import moment from 'moment'

import { Line as LineChart } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  CategoryScale,
  Plugin
} from 'chart.js'

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  CategoryScale
)

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
      default: 400
    },
    height: {
      type: Number,
      default: 400
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
    field: {
      type: String
    },
    unity: {
      type: String
    },
    name: {
      type: String
    },
    capKey: {
      type: String
    },
    capChanelId: {
      type: String
    },
    stepSize: {
      type: Number
    },
  },
  setup(props) {

    const start = ref(`${moment(new Date()).format("YYYY-MM-DD")} 00:00:00`)
    const end = ref(`${moment(new Date()).format("YYYY-MM-DD")} ${moment(new Date()).format("HH:mm:ss")}`)
    const chartData = reactive({
      labels: [
        "00:00",
        "01:00",
        "02:00",
        "03:00",
        "04:00",
        "05:00",
        "06:00",
        "07:00",
        "08:00",
        "09:00",
        "10:00",
        "11:00",
        "12:00",
        "13:00",
        "14:00",
        "15:00",
        "16:00",
        "17:00",
        "18:00",
        "19:00",
        "20:00",
        "21:00",
        "22:00",
        "23:00",
      ],
      datasets: [
        {
          label: props.name,
          backgroundColor: 'rgba(37, 146, 241, 0.5)',
          borderColor: 'rgba(37, 146, 221, 0.2)',
          data: []
        }
      ]
    })

    const chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      tension: 0.2,
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
    }

    onMounted(async () => {
      // channels/10/feed.json?key=CY7O2AQ8OITRL253
      await api.get(`channels/${props.capChanelId}/feeds.json`, {
        params: {
          key: props.capKey,
          start: start.value,
          end: end.value
        }
      }).then(({ data }) => {
        if (data) {
          let value = []
          data.feeds.forEach(element => {
            value.push(Number(element[props.field]))
          })
          chartData.datasets[0].data = value
        }
      })
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
