<script setup lang="ts">
import { AnimatePresence, Motion } from "motion-v";
import { ref } from "vue";

// --- Types ---
interface TestimonialItem {
  quote: string;
  author: string;
  role: string;
  company: string;
}

interface Props {
  title?: string;
  testimonials: TestimonialItem[];
}

// --- Props ---
const { title = "Testimonials", testimonials } = defineProps<Props>();

// --- Variants untuk Animasi Scroll ---
const cardVariants = {
  hidden: { 
    opacity: 0, 
    y: 50, 
    scale: 0.95,
    filter: "blur(10px)",
    transition: { duration: 0.5, ease: "easeInOut" }
  },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    filter: "blur(0px)",
    transition: { duration: 0.6, ease: "easeOut" }
  }
};
</script>

<template>
  <div class="bg-background min-h-screen py-24 px-6 md:px-12 flex justify-center">
    <div class="relative w-full max-w-4xl">
      
      <div class="sticky top-10 z-20 mb-16 mix-blend-difference">
         <Motion
          as="h2"
          class="text-4xl md:text-6xl font-bold tracking-tighter text-foreground mb-4"
          :initial="{ opacity: 0, x: -20 }"
          :animate="{ opacity: 1, x: 0 }"
          :transition="{ duration: 0.8 }"
        >
          {{ title }}
        </Motion>
        <div class="h-1 w-24 bg-primary/50 rounded-full"></div>
      </div>

      <div class="flex flex-col gap-32 pb-40">
        <Motion
          v-for="(item, index) in testimonials"
          :key="index"
          as="div"
          :initial="'hidden'"
          :while-in-view="'visible'"
          :viewport="{ once: false, amount: 0.3, margin: '-10% 0px -10% 0px' }"
          :variants="cardVariants"
          class="relative group"
        >
          
          <span 
            class="absolute -top-12 -left-4 md:-left-12 text-[8rem] md:text-[10rem] font-bold text-foreground/5 select-none pointer-events-none z-0 leading-none transition-transform duration-700 group-hover:translate-x-4"
          >
            {{ String(index + 1).padStart(2, '0') }}
          </span>

          <div class="relative z-10 pl-4 md:pl-12 border-l-2 border-border/50 hover:border-primary/50 transition-colors duration-500">
            
            <div class="mb-6">
              <span class="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-background/50 backdrop-blur-sm text-xs font-mono text-muted-foreground">
                <span class="w-1.5 h-1.5 rounded-full bg-primary"></span>
                {{ item.company }}
              </span>
            </div>

            <blockquote class="text-2xl md:text-4xl font-light leading-tight tracking-tight text-foreground mb-8">
              "{{ item.quote }}"
            </blockquote>

            <div class="flex items-center gap-4">
              <div class="h-px w-12 bg-foreground/30"></div>
              <div>
                <div class="text-lg font-medium text-foreground">{{ item.author }}</div>
                <div class="text-sm text-muted-foreground font-mono">{{ item.role }}</div>
              </div>
            </div>

          </div>

        </Motion>
      </div>

    </div>
  </div>
</template>