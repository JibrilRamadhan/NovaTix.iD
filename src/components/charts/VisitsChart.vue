<script setup>
import { computed } from 'vue'
import { Line } from 'vue-chartjs'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

const props = defineProps({
  visits: {
    type: Array,
    required: true
  }
})

const chartData = computed(() => {
  // Group visits by date (YYYY-MM-DD)
  const grouped = {}
  
  // Initialize last 7 days with 0
  for (let i = 6; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    const key = d.toISOString().split('T')[0]
    grouped[key] = 0
  }

  // Count visits
  props.visits.forEach(v => {
    const date = new Date(v.created_at).toISOString().split('T')[0]
    if (Object.prototype.hasOwnProperty.call(grouped, date)) {
        grouped[date]++
    }
  })

  // Format date labels nicely
  const labels = Object.keys(grouped).map(dateStr => {
    const d = new Date(dateStr)
    return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })
  })

  return {
    labels,
    datasets: [
      {
        label: 'Kunjungan',
        backgroundColor: (ctx) => {
          const canvas = ctx.chart.ctx;
          const gradient = canvas.createLinearGradient(0, 0, 0, 400);
          gradient.addColorStop(0, 'rgba(255, 255, 255, 0.2)'); // White 20%
          gradient.addColorStop(1, 'rgba(255, 255, 255, 0.0)');
          return gradient;
        },
        borderColor: '#ffffff', // White
        pointBackgroundColor: '#ffffff',
        pointBorderColor: '#000000',
        pointHoverBackgroundColor: '#000000',
        pointHoverBorderColor: '#ffffff',
        fill: true,
        tension: 0.4,
        data: Object.values(grouped)
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
      mode: 'index',
      intersect: false,
      backgroundColor: 'rgba(0,0,0,0.9)',
      titleColor: '#ffffff',
      bodyColor: '#9ca3af',
      borderColor: 'rgba(255,255,255,0.1)',
      borderWidth: 1,
      padding: 10,
      displayColors: false
    }
  },
  scales: {
    x: {
      grid: { display: false, drawBorder: false },
      ticks: { color: '#9ca3af' }
    },
    y: {
      grid: { color: 'rgba(255, 255, 255, 0.05)', drawBorder: false },
      ticks: { stepSize: 1, color: '#9ca3af' },
      beginAtZero: true
    }
  },
  interaction: {
    mode: 'nearest',
    axis: 'x',
    intersect: false
  }
}
</script>

<template>
  <div class="h-64">
    <Line :data="chartData" :options="options" />
  </div>
</template>
