<script setup>
import Navbar from '../components/navbar.vue';
import Footer from '../components/footer.vue';
import TeamMembers from '../components/teamMembers.vue';
import Marquee from '../components/Marquee.vue';
import TestimonialCard from '../components/TestimonialCard.vue';
import { Icon } from '@iconify/vue';
import { supabase } from '../lib/supabase';
import { useScrollReveal } from '../composables/useScrollReveal';
import { useLanguage } from '../composables/useLanguage';

import { ref, onMounted, onUnmounted, nextTick, computed } from 'vue';
const sectionRef = ref(null);
// Portfolio data
const featuredPortfolios = ref([])
const portfolioLoading = ref(true)
const isVisible = ref(false);
const scrollReveal = useScrollReveal()
let observer = null;

// --- LANGUAGE STATE ---
const { lang, useT } = useLanguage();
const t = useT('home');
const tTeam = useT('team');

const services = computed(() => [
  {
    icon: 'ph:code-bold',
    title: 'Quantum Web Dev',
    desc: t.value.serviceWebDesc,
    link: '#',
    highlight: false
  },
  {
    icon: 'ph:lightning-bold',
    title: t.value.serviceJoki,
    desc: t.value.serviceJokiDesc,
    link: '#',
    highlight: true
  },
  {
    icon: 'ph:chats-circle-bold',
    title: t.value.serviceConsult,
    desc: t.value.serviceConsultDesc,
    link: '#',
    highlight: false
  }
]);

const features = computed(() => [
  { icon: 'ph:globe', title: 'Domain & Hosting', desc: t.value.featureDomain },
  { icon: 'ph:rocket-launch', title: 'SEO Optimization', desc: t.value.featureSeo },
  { icon: 'ph:shield-check', title: 'Security Audit', desc: t.value.featureSecurity },
]);

const teamMembers = computed(() => [
  {
    name: 'Ahmad Haikal Rizal',
    role: 'Full Stack Engineer',
    image: '/img/haikal.png',
    bio: tTeam.value.bios?.[0] || '',
    skills: ['Vue.js', 'React', 'Node.js', 'PostgreSQL'],
    social: { linkedin: '#', github: '#' }
  },
  {
    name: 'Jibril Ramadhan',
    role: 'Frontend Engineer',
    image: '/img/jib2.png',
    bio: tTeam.value.bios?.[1] || '',
    skills: ['Vue.js', 'React', 'Tailwind', 'TypeScript'],
    social: { linkedin: '#', github: '#' }
  },
  {
    name: 'Muhammad Farelino Hendika',
    role: 'Head of Marketing & Client Relations',
    image: '/img/dika2.jpeg',
    bio: tTeam.value.bios?.[2] || '',
    skills: ['Social Media Strategy', 'Customer Service', 'Sales', 'Public Relations'],
    social: { linkedin: '#', github: '#' }
  },
  {
    name: 'Niko Budi Prasetyo',
    role: 'Backend Engineer',
    image: '/img/niko.PNG',
    bio: tTeam.value.bios?.[3] || '',
    skills: ['Golang', 'Python', 'Docker', 'PHP', 'JavaScript'],
    social: { linkedin: '#', github: '#' }
  }
]);

// Pricing data
const pricingPlans = ref([])
const pricingLoading = ref(true)
const testimonials = ref([])

const fetchTestimonials = async () => {
  const { data } = await supabase
    .from('testimonials')
    .select('*, portfolios(live_url, title)')
    .eq('is_visible', true)
    .order('created_at', { ascending: false })
    .limit(10)
  
  if (data) {
    testimonials.value = data.map(item => ({
        ...item,
        projectLink: item.portfolios?.live_url || null,
        projectTitle: item.portfolios?.title || null
    }))
  }
}

const heroVideo = ref(null);

const fetchFeaturedPortfolios = async () => {
  try {
    let { data, error } = await supabase
      .from('portfolios')
      .select('*')
      .eq('is_featured', true)
      .eq('is_visible', true)
      .order('display_order', { ascending: true })
      .limit(6)

    if (!error && (!data || data.length === 0)) {
      console.log('No featured portfolios found, fetching fallback...')
      const fallback = await supabase
        .from('portfolios')
        .select('*')
        .eq('is_visible', true)
        .order('created_at', { ascending: false })
        .limit(6)
      
      data = fallback.data
      error = fallback.error
    }

    if (!error) {
      featuredPortfolios.value = data || []
      nextTick(() => {
        if (scrollReveal && scrollReveal.observe) {
            scrollReveal.observe()
        }
      })
    } else {
      console.error('Error loading portfolios:', error)
    }
  } catch (e) {
    console.error('Failed to fetch portfolios:', e)
  } finally {
    portfolioLoading.value = false
  }
}

const fetchPricing = async () => {
  try {
    const { data, error } = await supabase
      .from('pricing_packages')
      .select('*')
      .eq('is_visible', true)
      .order('display_order', { ascending: true })
      .order('created_at', { ascending: true })

    if (!error) {
        pricingPlans.value = data || []
        nextTick(() => {
            if (scrollReveal && scrollReveal.observe) {
                scrollReveal.observe()
            }
        })
    }
  } catch (e) {
    console.error('Failed to fetch pricing:', e)
  } finally {
    pricingLoading.value = false
  }
}

onMounted(() => {
  observer = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) {
      isVisible.value = true;
    } else {
      isVisible.value = false;
    }
  }, {
    threshold: 0.15, 
    rootMargin: "50px" 
  });

  if (sectionRef.value) {
    observer.observe(sectionRef.value);
  }

  fetchFeaturedPortfolios()
  fetchPricing()
  fetchTestimonials()
});

onUnmounted(() => {
  if (observer) observer.disconnect();
});
</script>
<template>
  <Navbar />
  
  <main class="grow bg-black text-white">
      
    <!-- ═══════════════════════════════════════════ -->
    <!-- HERO SECTION                                -->
    <!-- ═══════════════════════════════════════════ -->
    <section class="relative min-h-screen flex items-center justify-center overflow-hidden">
  
      <video 
        src="/video/bghero3.mp4" 
        autoplay loop muted playsinline
        class="absolute inset-0 object-cover w-full h-full z-0"
        style="filter: brightness(0.4);" 
      ></video>
      
      <div class="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black z-0"></div>
      
      <div class="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 z-0 pointer-events-none"></div>

      <div class="relative z-10 max-w-4xl mx-auto px-6 text-center flex flex-col items-center">

        <div data-reveal class="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight text-white mb-6 leading-[1.1]">
          <Transition name="fade-up" mode="out-in">
            <h1 :key="t.heroTitle">
              {{ t.heroTitle }} <br class="hidden md:block" />
              <span class="text-transparent bg-clip-text bg-gradient-to-b from-white to-indigo-800">
                & Coding Solutions
              </span>
            </h1>
          </Transition>
        </div>

        <Transition name="fade-up" mode="out-in">
          <p :key="t.heroSubtitle" data-reveal data-delay="150" class="text-lg md:text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed font-light">
            {{ t.heroSubtitle }}
          </p>
        </Transition>

        <div data-reveal data-delay="300" class="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          
          <a href="#" class="group relative inline-flex items-center justify-center gap-2 bg-white text-black px-8 py-3.5 rounded-full font-semibold transition-all duration-300 hover:scale-105 hover:shadow-[0_0_20px_rgba(255,255,255,0.3)]">
            <Transition name="fade" mode="out-in"><span :key="t.heroBtnStart">{{ t.heroBtnStart }}</span></Transition>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="group-hover:translate-x-1 transition-transform"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
          </a>

          <router-link to="/portofolio" class="group inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full font-medium text-white border border-white/20 bg-white/5 backdrop-blur-sm transition-all duration-300 hover:bg-white/10 hover:border-white/40">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-gray-400 group-hover:text-white transition-colors"><circle cx="12" cy="12" r="10"></circle><polygon points="10 8 16 12 10 16"></polygon></svg>
            <Transition name="fade" mode="out-in"><span :key="t.heroBtnPort">{{ t.heroBtnPort }}</span></Transition>
          </router-link>

        </div>

      </div>

      <div class="absolute bottom-0 left-0 w-full h-40 bg-gradient-to-t from-black via-black/80 to-transparent z-10 pointer-events-none"></div>

    </section>

    <!-- ═══════════════════════════════════════════ -->
    <!-- SECTION 2: SERVICES & FEATURES             -->
    <!-- ═══════════════════════════════════════════ -->
    <section id="services" class="relative pt-24 z-20 px-6 md:px-12 max-w-7xl mx-auto pb-28">
      
      <!-- Section Header -->
      <div class="text-center mb-16">
        <Transition name="fade-up" mode="out-in">
          <span :key="t.servicesLabel" data-reveal class="inline-block px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold tracking-widest uppercase mb-6">
            {{ t.servicesLabel }}
          </span>
        </Transition>
        <Transition name="fade-up" mode="out-in">
          <h2 :key="t.servicesTitle" data-reveal data-delay="100" class="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
            {{ t.servicesTitle }} <span class="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-indigo-300">{{ t.servicesTitleHighlight }}</span>
          </h2>
        </Transition>
        <Transition name="fade-up" mode="out-in"><p :key="t.servicesDesc" data-reveal data-delay="200" class="text-gray-400 max-w-2xl mx-auto text-lg">{{ t.servicesDesc }}</p></Transition>
      </div>

      <!-- Service Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
        <div
          v-for="(service, index) in services" 
          :key="service.title"
          data-reveal
          :data-delay="index * 120"
          class="relative p-8 rounded-3xl transition-all duration-500 flex flex-col border group overflow-hidden"
          :class="[
            service.highlight 
              ? 'bg-gradient-to-br from-indigo-600/20 via-indigo-900/10 to-black border-indigo-500/50 shadow-lg shadow-indigo-500/10 md:-translate-y-4 hover:shadow-indigo-500/20 hover:border-indigo-400/60' 
              : 'bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.05] hover:border-white/[0.12] hover:shadow-xl hover:shadow-white/5'
          ]"
        >
          <!-- Hover glow effect -->
          <div 
            class="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none rounded-3xl"
            :class="service.highlight ? 'bg-gradient-to-br from-indigo-500/10 via-transparent to-transparent' : 'bg-gradient-to-br from-white/5 via-transparent to-transparent'"
          ></div>

          <!-- Popular badge -->
          <div v-if="service.highlight" class="absolute -top-px left-1/2 -translate-x-1/2">
            <Transition name="fade" mode="out-in">
              <div :key="t.badgeMostPopular" class="px-4 py-1 bg-indigo-500 text-white text-[10px] font-bold tracking-wider uppercase rounded-b-lg shadow-lg shadow-indigo-500/30">
                {{ t.badgeMostPopular }}
              </div>
            </Transition>
          </div>

          <div class="relative z-10 flex flex-col h-full">
            <!-- Icon -->
            <div 
              class="w-16 h-16 rounded-2xl flex items-center justify-center mb-8 text-3xl transition-all duration-500 group-hover:scale-110 group-hover:rotate-3"
              :class="service.highlight ? 'bg-indigo-500/20 text-indigo-400 group-hover:bg-indigo-500/30' : 'bg-white/5 text-gray-400 group-hover:text-indigo-400 group-hover:bg-indigo-500/10'"
            >
              <Icon :icon="service.icon" />
            </div>
            
            <!-- Title -->
            <h3 class="text-xl font-bold mb-3 text-white group-hover:text-indigo-300 transition-colors duration-300">
              {{ service.title }}
            </h3>

            <!-- Description -->
            <p class="text-gray-400 text-sm mb-8 leading-relaxed flex-grow group-hover:text-gray-300 transition-colors duration-300">
              {{ service.desc }}
            </p>
            
            <!-- CTA Button -->
            <a 
              :href="service.link" 
              class="inline-flex items-center gap-2 text-sm font-semibold transition-all duration-300 mt-auto"
              :class="service.highlight 
                ? 'bg-indigo-500 hover:bg-indigo-400 w-full justify-center py-3.5 rounded-xl text-white shadow-lg shadow-indigo-500/25 hover:shadow-indigo-400/30 hover:scale-[1.02] active:scale-[0.98]' 
                : 'text-gray-400 hover:text-white group-hover:gap-3'"
            >
              {{ service.highlight ? t.btnOrderNow : t.btnLearnMore }}
              <Icon icon="ph:arrow-right" class="transition-transform duration-300" :class="!service.highlight && 'group-hover:translate-x-1'" />
            </a>
          </div>
        </div>
      </div>

      <!-- Divider -->
      <div class="flex items-center gap-6 mt-28 mb-16">
        <div class="flex-1 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
        <span class="inline-block px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-gray-500 text-xs font-semibold tracking-widest uppercase">
          {{ t.featuresLabel }}
        </span>
        <div class="flex-1 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
      </div>

      <!-- Section Title -->
      <div class="text-center mb-16">
        <h2 class="text-3xl md:text-4xl font-bold text-white tracking-tight">
          {{ t.featuresTitle }} <span class="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-indigo-300">{{ t.featuresTitleHighlight }}</span>
        </h2>
        <p class="text-gray-400 mt-4 max-w-2xl mx-auto text-lg">{{ t.featuresDesc }}</p>
      </div>

      <!-- Feature Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
         <div 
            v-for="(feature, index) in features" 
            :key="feature.title"
            class="relative bg-white/[0.02] p-8 rounded-3xl border border-white/[0.06] transition-all duration-500 group overflow-hidden hover:bg-white/[0.05] hover:border-white/[0.12] hover:shadow-2xl hover:shadow-indigo-500/5 hover:-translate-y-1"
          >
            <!-- Hover glow -->
            <div class="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none bg-gradient-to-br from-indigo-500/5 via-transparent to-transparent rounded-3xl"></div>

            <!-- Top accent line -->
            <div class="absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-indigo-500/0 to-transparent group-hover:via-indigo-500/40 transition-all duration-700"></div>

            <div class="relative z-10">
              <!-- Icon -->
              <div class="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-indigo-500 mb-6 text-3xl transition-all duration-500 group-hover:scale-110 group-hover:bg-indigo-500/10 group-hover:text-indigo-400 group-hover:rotate-6">
                <Icon :icon="feature.icon" />
              </div>
              
              <h3 class="text-lg font-bold text-white mb-3 group-hover:text-indigo-300 transition-colors duration-300">{{ feature.title }}</h3>
              <p class="text-gray-400 text-sm mb-8 leading-relaxed group-hover:text-gray-300 transition-colors">{{ feature.desc }}</p>
              
              <button class="px-5 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 border bg-white/[0.03] text-gray-400 border-white/[0.08] hover:bg-indigo-500 hover:text-white hover:border-indigo-500 hover:shadow-lg hover:shadow-indigo-500/25 hover:scale-105 active:scale-95">
                {{ t.btnViewDetail }}
              </button>
            </div>
          </div>
      </div>

    </section>

    <!-- ═══════════════════════════════════════════ -->
    <!-- SECTION: PORTFOLIO SHOWCASE                 -->
    <!-- ═══════════════════════════════════════════ -->
    <section v-if="featuredPortfolios.length > 0 || portfolioLoading" class="relative py-28 px-6 md:px-12 overflow-hidden">
      <!-- Background effect -->
      <div class="absolute top-1/3 right-0 w-[500px] h-[500px] bg-indigo-600/5 rounded-full blur-[150px] pointer-events-none"></div>

      <div class="max-w-7xl mx-auto relative z-10">
        <!-- Header -->
        <div class="text-center mb-16">
          <span data-reveal class="inline-block px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold tracking-widest uppercase mb-6">
            {{ t.portfolioLabel }}
          </span>
          <h2 data-reveal data-delay="100" class="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
            {{ t.portfolioTitle }} <span class="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-indigo-300">{{ t.portfolioTitleHighlight }}</span>
          </h2>
          <p data-reveal data-delay="200" class="text-gray-400 max-w-2xl mx-auto text-lg">{{ t.portfolioDesc }}</p>
        </div>

        <!-- Loading -->
        <div v-if="portfolioLoading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div v-for="i in 3" :key="i" class="bg-white/[0.02] border border-white/[0.06] rounded-2xl overflow-hidden animate-pulse">
            <div class="h-52 bg-white/5"></div>
            <div class="p-6 space-y-3">
              <div class="h-5 bg-white/5 rounded w-2/3"></div>
              <div class="h-3 bg-white/5 rounded w-full"></div>
            </div>
          </div>
        </div>

        <!-- Portfolio Grid -->
        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="(portfolio, idx) in featuredPortfolios"
            :key="portfolio.id"
            data-reveal
            :data-delay="idx * 100"
            class="group bg-white/[0.02] border border-white/[0.06] rounded-2xl overflow-hidden hover:bg-white/[0.04] hover:border-white/[0.12] hover:shadow-2xl hover:shadow-indigo-500/5 hover:-translate-y-2 transition-all duration-500"
          >
            <!-- Image -->
            <div class="relative h-52 bg-white/[0.03] overflow-hidden">
              <img 
                v-if="portfolio.image_url" 
                :src="portfolio.image_url"
                :alt="portfolio.title"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                :style="{ objectPosition: portfolio.image_position || 'center center' }"
              />
              <div v-else class="w-full h-full flex items-center justify-center">
                <Icon icon="ph:code-bold" class="text-4xl text-gray-700" />
              </div>
              
              <!-- Hover overlay -->
              <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-5">
                <div class="flex gap-2">
                  <a 
                    v-if="portfolio.live_url" 
                    :href="portfolio.live_url" 
                    target="_blank"
                    class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/20 backdrop-blur-sm text-white text-xs font-medium hover:bg-white/30 transition-all"
                  >
                    <Icon icon="ph:globe" class="text-sm" />
                    Live Demo
                  </a>
                  <a 
                    v-if="portfolio.github_url" 
                    :href="portfolio.github_url" 
                    target="_blank"
                    class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/20 backdrop-blur-sm text-white text-xs font-medium hover:bg-white/30 transition-all"
                  >
                    <Icon icon="ph:github-logo" class="text-sm" />
                    Code
                  </a>
                </div>
              </div>

              <!-- Category badge -->
              <div class="absolute top-3 right-3">
                <span class="px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-sm text-white text-[10px] font-bold uppercase tracking-wider border border-white/10">
                  {{ portfolio.category }}
                </span>
              </div>
            </div>

            <!-- Content -->
            <div class="p-6">
              <h3 class="text-lg font-bold text-white mb-2 group-hover:text-indigo-300 transition-colors duration-300">
                {{ portfolio.title }}
              </h3>
              <p v-if="portfolio.description" class="text-gray-400 text-sm mb-4 leading-relaxed" style="display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">
                {{ portfolio.description }}
              </p>

              <!-- Tech stack -->
              <div v-if="portfolio.tech_stack && portfolio.tech_stack.length" class="flex flex-wrap gap-1.5">
                <span 
                  v-for="tech in portfolio.tech_stack.slice(0, 3)" 
                  :key="tech"
                  class="px-2 py-0.5 rounded-md bg-indigo-500/8 text-indigo-300 text-[11px] font-medium border border-indigo-500/15"
                >
                  {{ tech }}
                </span>
                <span 
                  v-if="portfolio.tech_stack.length > 3"
                  class="px-2 py-0.5 rounded-md bg-white/[0.04] text-gray-500 text-[11px] font-medium"
                >
                  +{{ portfolio.tech_stack.length - 3 }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- View All Button -->
        <div class="text-center mt-12">
          <router-link 
            to="/portofolio" 
            class="group inline-flex items-center gap-3 px-8 py-3.5 rounded-full font-semibold text-white border border-white/15 bg-white/5 backdrop-blur-sm transition-all duration-300 hover:bg-white/10 hover:border-white/30 hover:scale-105"
          >
            <Transition name="fade" mode="out-in">
              <span :key="t.btnViewAllPortfolio">{{ t.btnViewAllPortfolio }}</span>
            </Transition>
            <Icon icon="ph:arrow-right-bold" class="text-lg group-hover:translate-x-1 transition-transform duration-300" />
          </router-link>
        </div>
      </div>
    </section>

    <!-- ═══════════════════════════════════════════ -->

    <!-- SECTION: PRICELIST                          -->
    <!-- ═══════════════════════════════════════════ -->
    <section v-if="pricingPlans.length > 0 || pricingLoading" id="pricing" class="relative py-28 px-6 md:px-12 overflow-hidden">
      <!-- Background effects -->
      <div class="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-indigo-600/5 rounded-full blur-[150px] pointer-events-none"></div>

      <div class="max-w-7xl mx-auto relative z-10">
        <!-- Header -->
        <div class="text-center mb-16">
          <h2 data-reveal class="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
            {{ t.pricingTitle }} <span class="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-indigo-300">{{ t.pricingTitleHighlight }}</span>
          </h2>
          <p data-reveal data-delay="100" class="text-gray-400 max-w-2xl mx-auto text-lg">
            {{ t.pricingDesc }}
          </p>
        </div>

        <!-- Pricing Cards -->
        <div v-if="pricingLoading" class="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-0 items-stretch">
            <div v-for="i in 3" :key="i" class="h-[500px] rounded-3xl border border-white/10 bg-white/5 animate-pulse"></div>
        </div>

        <div v-else class="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-0 items-stretch">
          <div
            v-for="(plan, index) in pricingPlans" 
            :key="plan.id"
            data-reveal
            :data-delay="index * 120"
            class="relative flex flex-col rounded-3xl border transition-all duration-500 group overflow-hidden"
            :class="[
              plan.is_popular 
                ? 'z-10 -my-4 bg-indigo-900/40 border-indigo-500/50 shadow-2xl shadow-indigo-500/10 scale-105' 
                : 'bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.04] hover:border-white/[0.1] hover:-translate-y-2'
            ]"
          >
            <!-- Popular Badge -->
            <div v-if="plan.is_popular" class="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500"></div>
            <div v-if="plan.is_popular" class="absolute top-4 right-4">
              <span class="px-3 py-1 rounded-full bg-indigo-500 text-white text-[10px] font-bold uppercase tracking-wider shadow-lg shadow-indigo-500/25 flex items-center gap-1">
                <Icon icon="ph:star-fill" /> {{ t.badgeBestSeller }}
              </span>
            </div>

            <div class="p-8 flex-1 flex flex-col">
              <h3 class="text-xl font-bold text-white mb-2">{{ plan.title }}</h3>
              <p class="text-gray-400 text-sm mb-6 h-10 line-clamp-2">{{ plan.description }}</p>

              <!-- Price -->
              <div class="mb-8">
                <div class="flex items-baseline gap-1">
                  <span class="text-4xl lg:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400 font-shlomo-stam">
                    {{ plan.price }}
                  </span>
                  <span class="text-gray-500 text-sm font-medium">{{ plan.period }}</span>
                </div>
              </div>

              <!-- Features -->
              <div class="space-y-4 mb-8 flex-1">
                <div v-for="feature in (plan.features || [])" :key="feature" class="flex items-start gap-3 text-sm text-gray-300">
                  <div class="mt-0.5 p-0.5 rounded-full bg-indigo-500/20 text-indigo-400">
                    <Icon icon="ph:check-bold" class="text-xs" />
                  </div>
                  <span>{{ feature }}</span>
                </div>
              </div>

              <!-- CTA Button -->
              <a 
                href="#contact" 
                class="w-full py-4 rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-2 group-hover:gap-3"
                :class="plan.is_popular
                  ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/25' 
                  : 'bg-white text-black hover:bg-gray-200'"
              >
                <span>{{ t.btnSelectPlan }}</span>
                <Icon icon="ph:arrow-right-bold" />
              </a>

            </div>
          </div>
        </div>
      </div>
    </section>
     
    <TeamMembers :members="teamMembers" :title="tTeam.title" />

    <!-- ═══════════════════════════════════════════ -->
    <!-- SECTION: TESTIMONIALS                       -->
    <!-- ═══════════════════════════════════════════ -->
    <section v-if="testimonials.length > 0" class="relative py-24 overflow-hidden border-t border-white/[0.05]">
      <!-- Background glow -->
      <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-indigo-600/5 rounded-full blur-[100px] pointer-events-none"></div>

      <div class="relative z-10">
        <!-- Header -->
        <div class="text-center mb-16 px-6">
          <Transition name="fade" mode="out-in">
            <span :key="t.testimonialLabel" data-reveal class="inline-block px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold tracking-widest uppercase mb-6">
              {{ t.testimonialLabel }}
            </span>
          </Transition>
          <Transition name="fade-up" mode="out-in">
            <h2 :key="t.testimonialTitle" data-reveal data-delay="100" class="text-3xl md:text-5xl font-bold text-white mb-4 tracking-tight">
              {{ t.testimonialTitle }} <span class="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-indigo-300">{{ t.testimonialHighlight }}</span>
            </h2>
          </Transition>
        </div>

        <!-- Case 1: Less than 5 items (Display Grid/Flex) -->
        <div v-if="testimonials.length < 5" class="flex flex-wrap justify-center gap-6">
            <TestimonialCard
                v-for="item in testimonials"
                :key="item.id"
                :img="item.image_url"
                :name="item.name"
                :username="item.role"
                :body="item.content"
                :rating="item.rating"
                :projectLink="item.projectLink"
                :projectTitle="item.projectTitle"
                class="w-full md:w-[350px]" 
            />
        </div>

        <!-- Case 2: 5 or more items (Display Marquee) -->
        <div v-else class="relative flex h-[500px] w-full flex-col items-center justify-center overflow-hidden">
            <Marquee pauseOnHover class="[--duration:40s]">
                <TestimonialCard
                    v-for="item in testimonials"
                    :key="item.id"
                    :img="item.image_url"
                    :name="item.name"
                    :username="item.role"
                    :body="item.content"
                    :rating="item.rating"
                />
            </Marquee>
            
            <Marquee reverse pauseOnHover class="[--duration:40s] mt-6">
                <TestimonialCard
                    v-for="item in testimonials"
                    :key="item.id + '-rev'"
                    :img="item.image_url"
                    :name="item.name"
                    :username="item.role"
                    :body="item.content"
                    :rating="item.rating"
                    :projectLink="item.projectLink"
                    :projectTitle="item.projectTitle"
                />
            </Marquee>

             <div class="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-black via-black/50 to-transparent z-10"></div>
             <div class="pointer-events-none absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-black via-black/50 to-transparent z-10"></div>
        </div>
      </div>
    </section>

    <!-- ═══════════════════════════════════════════ -->
    <!-- SECTION: CONTACT / WHATSAPP CTA             -->
    <!-- ═══════════════════════════════════════════ -->
    <section id="contact" class="relative py-28 px-6 md:px-12 overflow-hidden">
      <!-- Background effects -->
      <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-green-600/5 rounded-full blur-[120px] pointer-events-none"></div>
      <div class="absolute bottom-0 right-0 w-[300px] h-[300px] bg-indigo-600/5 rounded-full blur-[100px] pointer-events-none"></div>

      <div class="max-w-4xl mx-auto relative z-10 text-center">

        <!-- Headline -->
        <h2 data-reveal class="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight">
          {{ t.contactTitle }} <br class="hidden md:block" />
          <span class="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-300">
            {{ t.contactTitleHighlight }}
          </span>
        </h2>

        <!-- Description -->
        <p class="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed">
          {{ t.contactDesc }}
        </p>

        <!-- WhatsApp Button -->
        <div class="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <a 
            href="https://wa.me/6281330659888?text=Halo%20Novatix!%20Saya%20tertarik%20dengan%20layanan%20Anda" 
            target="_blank"
            class="group relative inline-flex items-center gap-3 bg-green-500 hover:bg-green-400 text-white px-10 py-4 rounded-full font-bold text-lg transition-all duration-300 hover:scale-105 hover:shadow-[0_0_40px_rgba(34,197,94,0.3)] active:scale-95"
          >
            <Icon icon="ic:baseline-whatsapp" class="text-2xl group-hover:rotate-12 transition-transform duration-300" />
            <span>{{ t.contactBtn }}</span>
            <Icon icon="ph:arrow-right-bold" class="text-lg group-hover:translate-x-1 transition-transform duration-300" />
          </a>
        </div>

        <!-- Trust indicators -->
        <div class="flex flex-wrap items-center justify-center gap-8 mt-12 text-sm text-gray-500">
          <div class="flex items-center gap-2">
            <Icon icon="ph:clock-bold" class="text-green-400" />
            <span>{{ t.trustResponse }}</span>
          </div>
          <div class="flex items-center gap-2">
            <Icon icon="ph:shield-check-bold" class="text-green-400" />
            <span>{{ t.trustFree }}</span>
          </div>
          <div class="flex items-center gap-2">
            <Icon icon="ph:handshake-bold" class="text-green-400" />
            <span>{{ t.trustNoCommit }}</span>
          </div>
        </div>
      </div>
    </section>

  </main>

  <Footer />
</template>

<style>
::-webkit-scrollbar {
  display: none;
}
html {
  -ms-overflow-style: none;  
  scrollbar-width: none;  
}
</style>
