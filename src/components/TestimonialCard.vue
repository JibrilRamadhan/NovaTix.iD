<script setup>
import { Icon } from '@iconify/vue'

defineProps({
  img: {
    type: String,
    default: ''
  },
  name: {
    type: String,
    required: true
  },
  username: {
    type: String,
    default: ''
  },
  body: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    default: 5
  },
  projectLink: {
    type: String,
    default: ''
  },
  projectTitle: {
    type: String,
    default: ''
  }
})
</script>

<template>
  <figure
  class="relative w-96 cursor-pointer overflow-hidden rounded-3xl border p-8 transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] group"
  :class="projectLink 
    ? 'border-indigo-500/30 bg-gradient-to-br from-indigo-500/[0.05] to-indigo-500/[0.01] hover:from-indigo-500/[0.08] hover:to-indigo-500/[0.02]' 
    : 'border-white/[0.08] bg-gradient-to-br from-white/[0.03] to-white/[0.005] hover:border-indigo-500/30 hover:from-white/[0.05] hover:to-white/[0.01]'"
  >
    <!-- Verified Badge -->
    <div v-if="projectLink" class="absolute top-0 right-0 p-6 z-20">
        <div class="px-3 py-1.5 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-lg shadow-indigo-500/10 backdrop-blur-sm">
            <Icon icon="ph:seal-check-fill" />
            Verified Order
        </div>
    </div>

    <!-- Giant Quote Icon Background -->
    <div class="absolute top-16 right-6 text-8xl font-serif leading-none pointer-events-none transition-colors duration-500 z-0"
      :class="projectLink ? 'text-indigo-500/10 group-hover:text-indigo-500/20' : 'text-white/5 group-hover:text-white/10'"
    >
      &rdquo;
    </div>

    <!-- Header: Profile & Rating -->
    <div class="flex items-center justify-between mb-6 relative z-10">
      <div class="flex items-center gap-4">
        <div class="relative">
            <div class="w-12 h-12 rounded-full bg-indigo-500/20 p-0.5 border border-white/10 group-hover:border-indigo-500/50 transition-colors duration-300">
                <img
                v-if="img"
                :src="img"
                class="w-full h-full object-cover rounded-full"
                alt=""
                />
                <div v-else class="w-full h-full flex items-center justify-center text-indigo-400 font-bold bg-black/40 rounded-full text-sm">
                {{ name.charAt(0) }}
                </div>
            </div>
             <!-- Type Icon Badge (optional, e.g. linkedin or verified) -->
            <div class="absolute -bottom-1 -right-1 bg-black rounded-full p-0.5 border border-black">
                 <Icon icon="ph:check-circle-fill" class="text-indigo-400 text-xs" />
            </div>
        </div>
        
        <div class="flex flex-col">
            <h4 class="text-base font-bold text-white group-hover:text-indigo-300 transition-colors duration-300 leading-tight">
            {{ name }}
            </h4>
            <p class="text-xs font-medium text-gray-500 flex items-center gap-1">
                {{ username }}
            </p>
        </div>
      </div>
    </div>
    
    <!-- Content -->
    <blockquote class="relative z-10 text-sm text-gray-300 leading-relaxed font-light tracking-wide">
      {{ body }}
    </blockquote>

    <div class="mt-6 pt-6 border-t border-white/[0.05] flex items-center justify-between">
        <div class="flex items-center gap-1">
            <Icon v-for="i in 5" :key="i" :icon="i <= rating ? 'ph:star-fill' : 'ph:star'" class="text-sm" :class="i <= rating ? 'text-amber-400' : 'text-gray-700'" />
        </div>

        <a 
            v-if="projectLink" 
            :href="projectLink" 
            target="_blank"
            class="text-[10px] font-bold text-indigo-400 hover:text-indigo-300 uppercase tracking-wider flex items-center gap-1 transition-colors"
        >
            <span class="truncate max-w-[150px]">{{ projectTitle || 'Lihat Project' }}</span> <Icon icon="ph:arrow-right-bold" />
        </a>
    </div>
  </figure>
</template>
