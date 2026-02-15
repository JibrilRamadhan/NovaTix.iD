<script setup>
import { computed } from 'vue'
import { PolarArea } from 'vue-chartjs'
import {
  Chart as ChartJS,
  RadialLinearScale,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js'

ChartJS.register(RadialLinearScale, ArcElement, Tooltip, Legend)

const props = defineProps({
  data: { type: Object, required: true },
  label: { type: String, default: 'Visits' }
})

// Custom Plugin untuk Glow
const whiteGlowPlugin = {
  id: 'whiteGlow',
  beforeDatasetsDraw: (chart) => {
    const ctx = chart.ctx;
    ctx.save();
    ctx.shadowColor = 'rgba(255, 255, 255, 0.5)';
    ctx.shadowBlur = 15;
  },
  afterDatasetsDraw: (chart) => chart.ctx.restore()
};

const chartData = computed(() => {
  return {
    labels: Object.keys(props.data),
    datasets: [
      {
        label: props.label,
        // Opasitas bertingkat untuk efek monokrom yang elegan
        backgroundColor: [
          'rgba(255, 255, 255, 0.8)',
          'rgba(255, 255, 255, 0.5)',
          'rgba(255, 255, 255, 0.2)',
          'rgba(255, 255, 255, 0.05)'
        ],
        borderColor: '#ffffff',
        borderWidth: 1,
        hoverBackgroundColor: '#ffffff',
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
      grid: { color: 'rgba(255, 255, 255, 0.1)', borderDash: [5, 5] },
      angleLines: { color: 'rgba(255, 255, 255, 0.1)' },
      ticks: { display: false, backdropColor: 'transparent' }
    }
  }
}
</script>

<template>
  <div class="h-full w-full">
    <PolarArea :data="chartData" :options="options" :plugins="[whiteGlowPlugin]" />
  </div>
</template>