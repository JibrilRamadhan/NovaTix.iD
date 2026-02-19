<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { Icon } from '@iconify/vue';
import { useLanguage } from '../composables/useLanguage';
const { lang, toggleLang, useT } = useLanguage();
const t = useT('navbar');
const isMenuOpen = ref(false);
const isScrolled = ref(false);

const navItems = [
  { label: 'Home', path: '/' },
  { label: 'Portfolio', path: '/portofolio' },
  { label: 'Services', path: '/services' },
  { label: 'Pricing', path: '/pricing' },
];

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};

const closeMenu = () => {
  isMenuOpen.value = false;
};

const handleScroll = () => {
  isScrolled.value = window.scrollY > 20;
  if (isMenuOpen.value && window.scrollY > 50) {
    isMenuOpen.value = false;
  }
};

const navigateTo = (path) => {
  closeMenu();
  if (path.startsWith('/#')) {
    const hash = path.substring(1);
    const currentPath = window.location.pathname;
    if (currentPath === '/') {
      const el = document.querySelector(hash);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.location.href = path;
    }
  }
};

onMounted(() => {
  window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>

<style scoped>
.font-shlomo-stam {
  font-family: 'Shlomo Stam', sans-serif;
}
</style>

<template>
  <nav 
    class="fixed w-full z-50 top-0 transition-all duration-500 ease-in-out"
    :class="[
      isScrolled 
        ? 'backdrop-blur-lg shadow-md py-3' 
        : 'bg-transparent py-4 sm:py-6'
    ]"
  >
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center">
        
        <!-- Logo -->
        <router-link to="/" class="flex-shrink-0 flex items-center gap-2 cursor-pointer group">
          <img 
            class="w-auto object-contain transition-all duration-500"
            :class="isScrolled ? 'h-5 sm:h-6' : 'h-7 sm:h-9'"
            src="/img/logo.png" 
            alt="NovaTix Logo" 
          />
          <span 
            class="font-bold tracking-tight text-white transition-all duration-500 font-shlomo-stam"
            :class="isScrolled ? 'text-base sm:text-lg' : 'text-xl sm:text-2xl'"
          >
            NovaTix.ID
          </span>
        </router-link>

        <!-- Desktop Nav Links -->
        <div class="hidden md:flex space-x-6 lg:space-x-8 items-center">
          <template v-for="item in navItems" :key="item.label">
            <!-- Regular route links -->
            <router-link 
              v-if="!item.path.includes('#')"
              :to="item.path"
              class="group relative text-white hover:text-gray-400 font-medium transition-colors duration-300 text-sm uppercase tracking-wider"
              active-class="text-indigo-400"
            >
              {{ item.label }}
              <span class="absolute -bottom-1 left-0 w-0 h-0.5 bg-indigo-600 transition-all duration-300 ease-out group-hover:w-full"></span>
            </router-link>
            <!-- Hash/anchor links -->
            <a 
              v-else
              :href="item.path"
              @click.prevent="navigateTo(item.path)"
              class="group relative text-white hover:text-gray-400 font-medium transition-colors duration-300 text-sm uppercase tracking-wider"
            >
              {{ item.label }}
              <span class="absolute -bottom-1 left-0 w-0 h-0.5 bg-indigo-600 transition-all duration-300 ease-out group-hover:w-full"></span>
            </a>
          </template>
        </div>

        <!-- Desktop CTA -->
        <div class="hidden md:flex items-center">
          <a 
            href="https://wa.me/6281330659888?text=Halo%20Novatix!%20Saya%20tertarik%20dengan%20layanan%20Anda"
            target="_blank"
            class="group text-white rounded-full font-semibold hover:shadow-lg hover:scale-105 border border-white/20 hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-2 active:scale-95"
            :class="isScrolled ? 'py-2 px-4 lg:px-5 text-xs lg:text-sm' : 'py-2.5 px-5 lg:px-6 text-sm'"
          >
            <Icon icon="ic:baseline-whatsapp" class="text-lg" />
            <Transition name="fade" mode="out-in">
              <span :key="t.cta" class="hidden lg:inline">{{ t.cta }}</span>
            </Transition>
            <Transition name="fade" mode="out-in">
              <span :key="t.ctaShort" class="lg:hidden">{{ t.ctaShort }}</span>
            </Transition>
            <Icon icon="ph:arrow-right-bold" class="text-xs group-hover:translate-x-0.5 transition-transform duration-300" />
          </a>

          <button 
            @click="toggleLang" 
            class="flex items-center gap-2 px-3 py-2 rounded-full border border-white/10 hover:bg-white/10 transition-all text-sm font-bold text-white ml-4"
          >
            <Icon icon="ph:globe" class="text-lg" />
            <Transition name="fade" mode="out-in">
              <span :key="lang">{{ lang === 'id' ? 'ID' : 'EN' }}</span>
            </Transition>
          </button>

        </div>


        <!-- Mobile Hamburger -->
        <div class="flex items-center md:hidden">
          <button 
            @click="toggleMenu" 
            class="focus:outline-none p-2 rounded-full transition-all duration-300 ease-in-out text-white hover:bg-white/10"
          >
            <div class="relative w-6 h-6 flex justify-center items-center overflow-hidden">
               <Icon 
                 icon="ph:list-bold" 
                 class="absolute transition-all duration-300 transform"
                 :class="isMenuOpen ? 'rotate-90 opacity-0 scale-50' : 'rotate-0 opacity-100 scale-100'"
                 size="24"
               />
               <Icon 
                 icon="ph:x-bold" 
                 class="absolute transition-all duration-300 transform"
                 :class="isMenuOpen ? 'rotate-0 opacity-100 scale-100' : '-rotate-90 opacity-0 scale-50'"
                 size="24"
               />
            </div>
          </button>
        </div>
      </div>
    </div>

    <!-- Mobile Menu -->
    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="transform -translate-y-4 opacity-0 scale-95"
      enter-to-class="transform translate-y-0 opacity-100 scale-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="transform translate-y-0 opacity-100 scale-100"
      leave-to-class="transform -translate-y-4 opacity-0 scale-95"
    >
      <div 
        v-show="isMenuOpen" 
        class="md:hidden absolute top-full left-0 w-full bg-black/95 backdrop-blur-xl border-t border-white/[0.06] shadow-2xl"
      >
        <div class="px-4 sm:px-6 py-4 sm:py-6 space-y-1">
          <template v-for="item in navItems" :key="item.label">
            <router-link 
              v-if="!item.path.includes('#')"
              :to="item.path"
              @click="closeMenu"
              class="block text-gray-300 hover:text-white hover:bg-white/[0.06] px-4 py-3 rounded-xl text-base font-medium transition-all duration-300 border border-transparent hover:border-white/[0.08]"
              active-class="!text-indigo-400 !bg-indigo-500/10 !border-indigo-500/20"
            >
              {{ item.label }}
            </router-link>
            <a 
              v-else
              :href="item.path"
              @click.prevent="navigateTo(item.path)"
              class="block text-gray-300 hover:text-white hover:bg-white/[0.06] px-4 py-3 rounded-xl text-base font-medium transition-all duration-300 border border-transparent hover:border-white/[0.08]"
            >
              {{ item.label }}
            </a>
          </template>
          
          <!-- Mobile Language Toggle -->
          <button 
            @click="toggleLang" 
            class="flex items-center gap-3 w-full text-gray-300 hover:text-white hover:bg-white/[0.06] px-4 py-3 rounded-xl text-base font-medium transition-all duration-300 border border-transparent hover:border-white/[0.08]"
          >
            <Icon icon="ph:globe" class="text-lg" />
            <span>{{ lang === 'id' ? '🇮🇩 Bahasa Indonesia' : '🇬🇧 English' }}</span>
          </button>

          <!-- Mobile CTA -->
          <div class="pt-3 mt-2 border-t border-white/[0.06]">
            <a 
              href="https://wa.me/6281330659888?text=Halo%20Novatix!%20Saya%20tertarik%20dengan%20layanan%20Anda" 
              target="_blank"
              @click="closeMenu"
              class="flex items-center justify-center gap-3 bg-green-500 hover:bg-green-400 text-white w-full px-6 py-3.5 rounded-xl font-bold text-sm transition-all duration-300 hover:shadow-lg hover:shadow-green-500/20 active:scale-95"
            >
              <Icon icon="ic:baseline-whatsapp" class="text-xl" />
              <Transition name="fade" mode="out-in">
                <span :key="t.mobileCta">{{ t.mobileCta }}</span>
              </Transition>
              <Icon icon="ph:arrow-right-bold" class="text-sm" />
            </a>
          </div>
        </div>
      </div>
    </Transition>
  </nav>
</template>