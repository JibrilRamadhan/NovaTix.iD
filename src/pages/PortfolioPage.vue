<script setup>
import { ref, onMounted, computed, onUnmounted } from 'vue'
import { supabase } from '../lib/supabase'
import { Icon } from '@iconify/vue'
import Navbar from '../components/navbar.vue'
import Footer from '../components/footer.vue'
import { useScrollReveal } from '../composables/useScrollReveal'

useScrollReveal()

const portfolios = ref([])
const loading = ref(true)
const activeCategory = ref('Semua')
const categories = ref(['Semua'])

// --- REVISI 1: TYPEWRITER EFFECT LOGIC ---
const heroWords = ['Terbaik', 'Kreatif', 'Modern', 'Inovatif']
const displayedText = ref('')
const isDeleting = ref(false)
const loopNum = ref(0)
const typingSpeed = ref(150)
const deletingSpeed = ref(100)
let typingTimeout = null

const handleTypewriter = () => {
  const i = loopNum.value % heroWords.length
  const fullText = heroWords[i]

  if (isDeleting.value) {
    // Sedang menghapus
    displayedText.value = fullText.substring(0, displayedText.value.length - 1)
  } else {
    // Sedang mengetik
    displayedText.value = fullText.substring(0, displayedText.value.length + 1)
  }

  // Atur kecepatan dinamis
  let typeSpeed = isDeleting.value ? deletingSpeed.value : typingSpeed.value

  // Jika kata selesai diketik
  if (!isDeleting.value && displayedText.value === fullText) {
    typeSpeed = 2000 // Tahan sebentar sebelum menghapus (pause)
    isDeleting.value = true
  } 
  // Jika kata selesai dihapus
  else if (isDeleting.value && displayedText.value === '') {
    isDeleting.value = false
    loopNum.value++
    typeSpeed = 500 // Jedah sedikit sebelum mengetik kata baru
  }

  typingTimeout = setTimeout(handleTypewriter, typeSpeed)
}

// --- Tech Icon Mapper (Tetap sama) ---
const getTechIcon = (tech) => {
  const t = tech.toLowerCase()
  if (t.includes('vue')) return 'logos:vue'
  if (t.includes('tailwind')) return 'logos:tailwindcss-icon'
  if (t.includes('react')) return 'logos:react'
  if (t.includes('node')) return 'logos:nodejs-icon'
  if (t.includes('postgres')) return 'logos:postgresql'
  if (t.includes('mysql')) return 'logos:mysql-icon'
  if (t.includes('laravel')) return 'logos:laravel'
  if (t.includes('php')) return 'logos:php'
  if (t.includes('js') || t.includes('javascript')) return 'logos:javascript'
  if (t.includes('ts') || t.includes('typescript')) return 'logos:typescript-icon'
  if (t.includes('html')) return 'logos:html-5'
  if (t.includes('css')) return 'logos:css-3'
  if (t.includes('figma')) return 'logos:figma'
  return 'ph:code-bold'
}

onMounted(async () => {
  handleTypewriter() // Mulai efek mengetik

  try {
    const { data, error } = await supabase
      .from('portfolios')
      .select('*')
      .eq('is_visible', true)
      .order('display_order', { ascending: true })
      .order('created_at', { ascending: false })

    if (!error && data) {
      portfolios.value = data
      const cats = [...new Set(data.map(p => p.category))]
      categories.value = ['Semua', ...cats]
    }
  } catch (e) {
    console.error('Failed to load portfolio:', e)
  } finally {
    loading.value = false
  }
})

onUnmounted(() => {
  clearTimeout(typingTimeout)
})

const filteredPortfolios = computed(() => {
  if (activeCategory.value === 'Semua') return portfolios.value
  return portfolios.value.filter(p => p.category === activeCategory.value)
})
</script>

<template>
  <Navbar />
  <main class="bg-black text-white min-h-screen font-sans">
    
    <section class="relative pt-32 pb-32 px-6 md:px-12 overflow-hidden">
      
      <div class="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-indigo-600/15 rounded-full blur-[120px] pointer-events-none animate-float opacity-80"></div>
      
      <div class="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.04] pointer-events-none"></div>
      
      <div class="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black via-black/80 to-transparent z-10 pointer-events-none"></div>

      <div class="max-w-6xl mx-auto relative z-20 text-center">
        <span data-reveal class="inline-block px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold tracking-widest uppercase mb-6 shadow-[0_0_20px_rgba(99,102,241,0.1)]">
          Portfolio
        </span>
        
        <h1 data-reveal data-delay="100" class="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 tracking-tight flex flex-col md:flex-row items-center justify-center gap-3">
          <span>Karya</span>
          
          <span class="inline-flex items-center text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 min-w-[200px] md:min-w-[280px] h-[1.2em] justify-start">
            {{ displayedText }}
            <span class="ml-1 w-1 h-[1em] bg-indigo-400 animate-blink"></span>
          </span>
          
          <span>Kami</span>
        </h1>
        
        <p data-reveal data-delay="200" class="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
          Koleksi project yang telah kami selesaikan dengan kualitas premium dan teknologi modern.
        </p>
      </div>
    </section>

    <section class="px-6 md:px-12 max-w-6xl mx-auto mb-12 relative z-30 -mt-10">
      <div class="flex flex-wrap justify-center gap-3">
        <button
          v-for="cat in categories"
          :key="cat"
          @click="activeCategory = cat"
          class="px-6 py-2.5 rounded-full text-sm font-medium border transition-all duration-300 backdrop-blur-md"
          :class="activeCategory === cat
            ? 'bg-indigo-500 text-white border-indigo-500 shadow-[0_0_25px_rgba(99,102,241,0.5)] scale-105'
            : 'bg-black/50 text-gray-400 border-white/[0.08] hover:bg-white/[0.08] hover:text-white hover:border-white/[0.2] hover:scale-105'"
        >
          {{ cat }}
        </button>
      </div>
    </section>

    <section v-if="loading" class="px-6 md:px-12 max-w-6xl mx-auto pb-28 relative z-20">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="i in 6" :key="i" class="bg-white/[0.02] border border-white/[0.06] rounded-3xl overflow-hidden animate-pulse">
          <div class="h-52 bg-white/5"></div>
          <div class="p-6 space-y-3">
            <div class="h-5 bg-white/5 rounded w-2/3"></div>
            <div class="h-3 bg-white/5 rounded w-full"></div>
            <div class="flex gap-2 pt-4">
              <div class="h-8 w-20 bg-white/5 rounded-lg"></div>
              <div class="h-8 w-20 bg-white/5 rounded-lg"></div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section v-else-if="filteredPortfolios.length === 0" class="px-6 md:px-12 max-w-6xl mx-auto pb-28 text-center relative z-20">
      <div class="py-20 bg-white/[0.02] border border-white/[0.06] rounded-3xl backdrop-blur-sm">
        <Icon icon="ph:folder-open-duotone" class="text-6xl text-indigo-500/50 mx-auto mb-4" />
        <h3 class="text-xl font-bold text-white mb-2">Belum ada project</h3>
        <p class="text-gray-500">Portfolio sedang dalam proses penambahan. Stay tuned!</p>
      </div>
    </section>

    <section v-else class="px-6 md:px-12 max-w-6xl mx-auto pb-28 relative z-20">
      <TransitionGroup 
        tag="div" 
        name="portfolio-list" 
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 grid-flow-dense relative"
      >
        <div
          v-for="(portfolio, index) in filteredPortfolios"
          :key="portfolio.id"
          :class="[
            'group bg-white/[0.02] border border-white/[0.06] rounded-3xl overflow-hidden hover:bg-white/[0.04] hover:border-indigo-500/30 hover:shadow-[0_8px_40px_-12px_rgba(99,102,241,0.3)] hover:-translate-y-2 transition-all duration-500 flex flex-col',
            index === 0 && activeCategory === 'Semua' ? 'lg:col-span-2 lg:row-span-2' : ''
          ]"
        >
          <div 
            :class="[
              'relative bg-white/[0.03] overflow-hidden shrink-0',
              index === 0 && activeCategory === 'Semua' ? 'h-64 lg:h-[400px]' : 'h-52'
            ]"
          >
            <img 
              v-if="portfolio.image_url" 
              :src="portfolio.image_url"
              :alt="portfolio.title"
              class="w-full h-full object-cover group-hover:scale-110 group-hover:rotate-1 transition-all duration-700 ease-out"
              :style="{ objectPosition: portfolio.image_position || 'center center' }"
            />
            <div v-else class="w-full h-full flex items-center justify-center">
              <Icon icon="ph:image-duotone" class="text-5xl text-gray-700 group-hover:text-indigo-500/50 transition-colors" />
            </div>
            
            <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-6">
              <div class="flex gap-3 translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-100">
                <a 
                  v-if="portfolio.live_url" 
                  :href="portfolio.live_url" 
                  target="_blank"
                  class="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-500 text-white text-sm font-semibold hover:bg-indigo-600 hover:shadow-lg hover:shadow-indigo-500/30 transition-all"
                >
                  <Icon icon="ph:globe" class="text-lg" />
                  Live Demo
                </a>
                <a 
                  v-if="portfolio.github_url" 
                  :href="portfolio.github_url" 
                  target="_blank"
                  class="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 backdrop-blur-md text-white text-sm font-semibold hover:bg-white/20 border border-white/10 transition-all"
                >
                  <Icon icon="ph:github-logo" class="text-lg" />
                  Code
                </a>
              </div>
            </div>

            <div class="absolute top-4 right-4">
              <span class="px-3 py-1.5 rounded-xl bg-black/40 backdrop-blur-md text-white text-[11px] font-bold uppercase tracking-widest border border-white/10 shadow-lg">
                {{ portfolio.category }}
              </span>
            </div>
          </div>

          <div class="p-6 md:p-8 flex flex-col flex-grow">
            <h3 class="text-xl font-bold text-white mb-3 group-hover:text-indigo-400 transition-colors duration-300 line-clamp-1">
              {{ portfolio.title }}
            </h3>
            <p v-if="portfolio.description" class="text-gray-400 text-sm mb-6 leading-relaxed line-clamp-2">
              {{ portfolio.description }}
            </p>

            <div v-if="portfolio.tech_stack && portfolio.tech_stack.length" class="mt-auto flex flex-wrap gap-2 pt-2">
              <div 
                v-for="tech in portfolio.tech_stack.slice(0, 4)" 
                :key="tech"
                class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.08] group-hover:border-indigo-500/20 group-hover:bg-indigo-500/5 transition-all duration-300"
              >
                <Icon :icon="getTechIcon(tech)" class="text-base" />
                <span class="text-gray-300 text-xs font-medium">{{ tech }}</span>
              </div>
              <span 
                v-if="portfolio.tech_stack.length > 4"
                class="flex items-center px-3 py-1.5 rounded-lg bg-white/[0.02] border border-white/[0.05] text-gray-500 text-xs font-medium"
              >
                +{{ portfolio.tech_stack.length - 4 }}
              </span>
            </div>
          </div>
        </div>
      </TransitionGroup>
    </section>
  </main>
  <Footer />
</template>

<style scoped>
.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

@keyframes float {
  0% { transform: translate(-50%, 0px) scale(1); }
  33% { transform: translate(-50%, -30px) scale(1.1); }
  66% { transform: translate(-50%, 20px) scale(0.9); }
  100% { transform: translate(-50%, 0px) scale(1); }
}
.animate-float {
  animation: float 10s ease-in-out infinite;
}

/* Cursor Blink Animation */
@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}
.animate-blink {
  animation: blink 1s step-end infinite;
}

.portfolio-list-move,
.portfolio-list-enter-active,
.portfolio-list-leave-active {
  transition: all 0.6s cubic-bezier(0.25, 1, 0.33, 1);
}
.portfolio-list-enter-from {
  opacity: 0;
  transform: translateY(30px) scale(0.95);
}
.portfolio-list-leave-to {
  opacity: 0;
  transform: scale(0.95);
}
.portfolio-list-leave-active {
  position: absolute;
}
</style>