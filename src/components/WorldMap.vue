<script setup>
import { computed } from 'vue';

const props = defineProps({
  dots: {
    type: Array,
    required: true
  }
});

// Fungsi sederhana konversi Lat/Long ke posisi X/Y (Proyeksi Mercator Sederhana untuk SVG)
const project = (lat, lng) => {
  const x = (lng + 180) * (800 / 360);
  const latRad = (lat * Math.PI) / 180;
  const mercN = Math.log(Math.tan((Math.PI / 4) + (latRad / 2)));
  const y = (400 / 2) - (400 * mercN) / (2 * Math.PI);
  return { x, y };
};

const paths = computed(() => {
  return props.dots.map(dot => {
    const start = project(dot.start.lat, dot.start.lng);
    const end = project(dot.end.lat, dot.end.lng);
    return { 
      d: `M${start.x},${start.y} Q${(start.x + end.x)/2},${start.y - 50} ${end.x},${end.y}`, // Kurva Quadratic
      start, 
      end 
    };
  });
});
</script>

<template>
  <div class="relative w-full h-full flex items-center justify-center overflow-hidden bg-[#111827]">
    <svg viewBox="0 0 800 400" class="w-full h-auto opacity-20 pointer-events-none fill-gray-500">
      <path d="M50,100 Q150,50 250,100 T450,100 T650,100 T750,150 V300 H50 Z" /> <text x="400" y="200" text-anchor="middle" class="text-[100px] font-bold opacity-10">WORLD MAP</text>
      <image href="https://upload.wikimedia.org/wikipedia/commons/8/80/World_map_-_low_resolution.svg" x="0" y="0" width="800" height="400" />
    </svg>

    <svg viewBox="0 0 800 400" class="absolute inset-0 w-full h-full pointer-events-none">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style="stop-color:#3b82f6;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#60a5fa;stop-opacity:1" />
        </linearGradient>
      </defs>

      <g v-for="(path, i) in paths" :key="i">
        <circle :cx="path.start.x" :cy="path.start.y" r="3" fill="#60a5fa">
          <animate attributeName="r" values="3;6;3" dur="2s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="1;0.5;1" dur="2s" repeatCount="indefinite" />
        </circle>

        <path :d="path.d" fill="none" stroke="url(#grad)" stroke-width="2" stroke-linecap="round" stroke-dasharray="5,5">
           <animate attributeName="stroke-dashoffset" from="100" to="0" dur="3s" repeatCount="indefinite" />
        </path>

        <circle :cx="path.end.x" :cy="path.end.y" r="3" fill="#3b82f6" />
      </g>
    </svg>
  </div>
</template>