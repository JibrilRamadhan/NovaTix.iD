<script setup>
import { computed } from 'vue'
import { Bar } from 'vue-chartjs'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
)

const props = defineProps({
  data: {
    type: Object, // { label: number }
    required: true
  },
  title: {
    type: String,
    default: ''
  },
  label: {
      type: String,
      default: 'Data'
  },
  color: {
      type: String,
      default: '#ffffff'
  }
})

const chartData = computed(() => {
  const backgrounds = []
  
  if (props.label === 'Visits') { // Traffic Sources Logic
      const labels = Object.keys(props.data)
      labels.forEach(l => {
          if (l === 'Instagram') backgrounds.push('#E1306C') // Instagram Color
          else if (l === 'Google') backgrounds.push('#4285F4') // Google Blue
          else if (l === 'Direct') backgrounds.push('#9ca3af') // Gray
          else backgrounds.push(props.color)
      })
  } else {
      // Default or prop color
       backgrounds.push(props.color)
  }

  return {
    labels: Object.keys(props.data),
    datasets: [
      {
        label: props.label,
        backgroundColor: backgrounds.length > 1 ? backgrounds : props.color,
        borderRadius: 6, // Rounded corners
        data: Object.values(props.data)
      }
    ]
  }
})

const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: 'rgba(0,0,0,0.8)',
      titleColor: '#ffffff',
      bodyColor: '#e5e7eb',
      borderColor: 'rgba(255,255,255,0.1)',
      borderWidth: 1,
      padding: 12,
      displayColors: true,
      boxPadding: 4,
      usePointStyle: true,
      callbacks: {
          label: (context) => {
              return ` ${context.parsed.y} ${props.label}`
          }
      }
    }
  },
  scales: {
    x: {
      grid: { display: false, drawBorder: false },
      ticks: { color: '#9ca3af', font: { size: 11 } }
    },
    y: {
      grid: { color: 'rgba(255, 255, 255, 0.05)', drawBorder: false },
      ticks: { color: '#9ca3af', font: { size: 10 } },
      beginAtZero: true
    }
  }
}
</script>

<template>
  <div class="h-64">
    <Bar :data="chartData" :options="options" />
  </div>
</template>
