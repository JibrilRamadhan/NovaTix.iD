<script setup lang="ts">
import { Motion } from "motion-v";
import { Icon } from '@iconify/vue';

// --- Types ---
interface TeamMember {
  name: string;
  role: string;
  image: string;
  bio: string;
  skills: string[];
  social: { linkedin: string; github: string };
}

interface Props {
  title?: string;
  members: TeamMember[];
}

// --- Props ---
const { title = "Meet Our Team", members } = defineProps<Props>();

// --- Variants untuk Animasi Scroll ---
const cardVariants = {
  hidden: { 
    opacity: 0, 
    y: 80, 
    scale: 0.92,
    filter: "blur(12px)",
    transition: { duration: 0.5, ease: "easeInOut" }
  },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    filter: "blur(0px)",
    transition: { duration: 0.7, ease: "easeOut" }
  }
};
</script>

<template>
  <div class="bg-black min-h-screen py-24 px-6 md:px-12 flex justify-center relative overflow-hidden">
    <!-- Background Effects -->
    <div class="absolute top-1/4 left-1/4 w-[350px] h-[350px] bg-blue-600/5 rounded-full blur-[120px] pointer-events-none"></div>
    <div class="absolute bottom-1/3 right-1/4 w-[300px] h-[300px] bg-purple-600/5 rounded-full blur-[100px] pointer-events-none"></div>
    
    <div class="relative w-full max-w-5xl">
      
      <!-- Sticky Header -->
      <div class="sticky top-10 z-20 mb-20 mix-blend-difference">
         <Motion
          as="h2"
          class="text-4xl md:text-6xl font-bold tracking-tighter text-white mb-4"
          :initial="{ opacity: 0, x: -20 }"
          :animate="{ opacity: 1, x: 0 }"
          :transition="{ duration: 0.8 }"
        >
          {{ title }}
        </Motion>
        <div class="h-1.5 w-28 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
      </div>

      <!-- Team Members Scroll List -->
      <div class="flex flex-col gap-40 pb-40">
        <Motion
          v-for="(member, index) in members"
          :key="member.name"
          as="div"
          :initial="'hidden'"
          :while-in-view="'visible'"
          :viewport="{ once: false, amount: 0.3, margin: '-10% 0px -10% 0px' }"
          :variants="cardVariants"
          class="relative group"
        >
          
          <!-- Large Background Number -->
          <span 
            class="absolute -top-16 -left-4 md:-left-16 text-[10rem] md:text-[14rem] font-black text-white/[0.02] select-none pointer-events-none z-0 leading-none transition-transform duration-700 group-hover:translate-x-6"
          >
            {{ String(index + 1).padStart(2, '0') }}
          </span>

          <!-- Content Card -->
          <div class="relative z-10 pl-6 md:pl-16 border-l-[3px] border-white/10 hover:border-blue-500/40 transition-colors duration-500">
            
            <div class="grid md:grid-cols-[300px_1fr] gap-8 items-start">
              
              <!-- Image Section -->
              <div class="relative group/img">
                <div class="relative w-full aspect-[3/4] rounded-2xl overflow-hidden">
                  <img 
                    :src="member.image" 
                    :alt="member.name"
                    class="w-full h-full object-cover filter grayscale group-hover/img:grayscale-0 group-hover/img:scale-105 transition-all duration-700 ease-out"
                  />
                  <!-- Gradient overlay -->
                  <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                </div>
                
                <!-- Role Badge -->
                <div class="absolute top-4 left-4">
                  <span class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/70 backdrop-blur-md border border-white/10 text-[11px] font-mono text-blue-300 tracking-wider uppercase">
                    <span class="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
                    {{ member.role }}
                  </span>
                </div>
              </div>

              <!-- Info Section -->
              <div class="space-y-6">
                
                <!-- Name -->
                <div>
                  <h3 class="text-3xl md:text-5xl font-bold text-white tracking-tight mb-2 group-hover:text-blue-400 transition-colors duration-300">
                    {{ member.name }}
                  </h3>
                  <div class="h-px w-16 bg-white/20"></div>
                </div>

                <!-- Bio -->
                <p class="text-gray-400 text-base md:text-lg leading-relaxed">
                  {{ member.bio }}
                </p>

                <!-- Skills -->
                <div class="space-y-3">
                  <div class="text-xs font-mono text-gray-500 tracking-widest uppercase">
                    Tech Stack
                  </div>
                  <div class="flex flex-wrap gap-2">
                    <span 
                      v-for="skill in member.skills" 
                      :key="skill"
                      class="px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.08] text-sm font-mono text-gray-300 transition-all duration-300 hover:border-blue-500/40 hover:text-blue-300 hover:bg-blue-500/10"
                    >
                      {{ skill }}
                    </span>
                  </div>
                </div>

                <!-- Social Links -->
                <div class="flex items-center gap-4 pt-4">
                  <div class="h-px flex-1 bg-white/10"></div>
                  <div class="flex gap-3">
                    <a 
                      :href="member.social.linkedin" 
                      class="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/[0.08] flex items-center justify-center text-gray-400 hover:text-white hover:bg-blue-600/20 hover:border-blue-500/40 transition-all duration-300 group/link"
                    >
                      <Icon icon="ph:linkedin-logo-bold" class="text-lg group-hover/link:scale-110 transition-transform" />
                    </a>
                    <a 
                      :href="member.social.github" 
                      class="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/[0.08] flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all duration-300 group/link"
                    >
                      <Icon icon="ph:github-logo-bold" class="text-lg group-hover/link:scale-110 transition-transform" />
                    </a>
                  </div>
                </div>

              </div>

            </div>

          </div>

        </Motion>
      </div>

    </div>
  </div>
</template>
