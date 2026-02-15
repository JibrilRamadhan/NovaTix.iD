<script setup>
import { computed } from 'vue'
import { Radar } from 'vue-chartjs'
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
} from 'chart.js'

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend)

const props = defineProps({
  data: { type: Object, required: true },
  label: { type: String, default: 'Value' }
})

const whiteGlowPlugin = {
  id: 'whiteGlow',
  beforeDatasetsDraw: (chart) => {
    const ctx = chart.ctx;
    ctx.save();
    ctx.shadowColor = 'rgba(255, 255, 255, 0.8)';
    ctx.shadowBlur = 10;
  },
  afterDatasetsDraw: (chart) => chart.ctx.restore()
};

const chartData = computed(() => {
  return {
    labels: Object.keys(props.data),
    datasets: [
      {
        label: props.label,
        backgroundColor: 'rgba(255, 255, 255, 0.05)', // Isi area jaring
        borderColor: '#ffffff',
        borderWidth: 1.5,
        pointBackgroundColor: '#000000',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
        pointHoverBackgroundColor: '#ffffff',
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
      backgroundColor: 'rgba(0,0,0,0.9)',
      titleColor: '#ffffff',
      bodyColor: '#e5e7eb',
      borderColor: 'rgba(255,255,255,0.2)',
      borderWidth: 1,
      padding: 12,
      displayColors: false
    }
  },
  scales: {
    r: {
      grid: { color: 'rgba(255, 255, 255, 0.1)', borderDash: [4, 4] },
      angleLines: { color: 'rgba(255, 255, 255, 0.1)' },
      pointLabels: { color: '#9ca3af', font: { size: 10, family: 'monospace' } },
      ticks: { display: false, backdropColor: 'transparent', min: 0, max: 100 } // Karena persentase scroll
    }
  }
}
</script>

<template>
  <div class="h-full w-full flex items-center justify-center p-2">
    <Radar :data="chartData" :options="options" :plugins="[whiteGlowPlugin]" />
  </div>
</template>