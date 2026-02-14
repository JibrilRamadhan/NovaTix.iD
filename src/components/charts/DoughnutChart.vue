<script setup>
import { computed } from 'vue'
import { Doughnut } from 'vue-chartjs'
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js'

ChartJS.register(ArcElement, Tooltip, Legend)

const props = defineProps({
  visits: {
    type: Array,
    required: true
  },
  type: {
    type: String, // 'device' or 'os' or 'browser'
    default: 'device'
  }
})

const chartData = computed(() => {
  const counts = {}
  
  props.visits.forEach(v => {
    let key = 'Unknown'
    if (props.type === 'device') key = v.device_type || 'Desktop'
    else if (props.type === 'os') key = v.os.split(' ')[0] || 'Unknown' // Capture just OS name
    else if (props.type === 'browser') key = v.browser.split(' ')[0] || 'Unknown' // Capture just Browser name
    
    // Capitalize
    key = key.charAt(0).toUpperCase() + key.slice(1)
    
    counts[key] = (counts[key] || 0) + 1
  })

  // Colors - Monochrome Grayscale
  const colors = [
    '#ffffff', // White
    '#d1d5db', // Gray 300
    '#9ca3af', // Gray 400
    '#6b7280', // Gray 500
    '#4b5563', // Gray 600
    '#374151', // Gray 700
  ]

  return {
    labels: Object.keys(counts),
    datasets: [
      {
        backgroundColor: colors,
        borderWidth: 0,
        data: Object.values(counts)
      }
    ]
  }
})

const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'right',
      labels: {
        color: '#9ca3af',
        usePointStyle: true,
        padding: 20
      }
    }
  },
  cutout: '75%'
}
</script>

<template>
  <div class="h-48">
    <Doughnut :data="chartData" :options="options" />
  </div>
</template>
