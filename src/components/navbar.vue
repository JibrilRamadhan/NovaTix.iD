<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { Icon } from '@iconify/vue';

const isMenuOpen = ref(false);
const isScrolled = ref(false);

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};

// Fungsi untuk menutup menu saat link diklik (UX yang lebih baik)
const closeMenu = () => {
  isMenuOpen.value = false;
};

const handleScroll = () => {
  // Mengubah state scroll jika turun lebih dari 20px
  isScrolled.value = window.scrollY > 20;
  
  // Opsional: Tutup menu mobile jika user scroll saat menu terbuka
  if (isMenuOpen.value && window.scrollY > 50) {
    isMenuOpen.value = false;
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
    class="fixed w-full z-50 top-0 transition-all duration-500 ease-in-out border-gray-100"
    :class="[
      isScrolled 
        ? ' backdrop-blur-lg shadow-md  py-3' 
        : 'bg-transparent border-b-0 py-6'
    ]"
  >
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center">
        
        <div class="flex-shrink-0 flex items-center gap-2 cursor-pointer group">
          <img 
            class="w-auto object-contain transition-all duration-500"
            :class="isScrolled ? 'h-6' : 'h-9'"
            src="/img/logo.png" 
            alt="NovaTix Logo" 
          />
          <span 
            class="font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r text-white transition-all duration-500 font-shlomo-stam"

            :class="isScrolled ? 'text-lg' : 'text-2xl'"
          >
            NovaTix.ID
          </span>
        </div>

        <div class="hidden md:flex space-x-8 items-center">
          <a v-for="item in ['Home', 'Services', 'Pricing', 'Contact']" 
             :key="item"
             href="#" 
             class="group relative text-white hover:text-gray-400 font-medium transition-colors duration-300 text-sm uppercase tracking-wider"
          >
            {{ item }}
            <span class="absolute -bottom-1 left-0 w-0 h-0.5 bg-indigo-600 transition-all duration-300 ease-out group-hover:w-full"></span>
          </a>
        </div>

        <div class="hidden md:flex items-center">
            <a 
              href="https://wa.me/6281330659888?text=Halo%20Novatix!%20Saya%20tertarik%20dengan%20layanan%20Anda"
              target="_blank"
              class="group text-white rounded-full font-semibold hover:shadow-lg hover:scale-105 border border-white/20 hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-2 active:scale-95"
              :class="isScrolled ? 'py-2 px-5 text-sm' : 'py-2.5 px-6 text-sm'"
            >
              <Icon icon="ic:baseline-whatsapp" class="text-lg" />
              <span>Konsultasi Gratis</span>
              <Icon icon="ph:arrow-right-bold" class="text-xs group-hover:translate-x-0.5 transition-transform duration-300" />
            </a>
        </div>
        <div class="flex items-center md:hidden">
          <button 
            @click="toggleMenu" 
            class="focus:outline-none p-2 rounded-full transition-all duration-300 ease-in-out"
            :class="[
              isScrolled ? 'text-gray-900 bg-gray-100/50 hover:bg-gray-200' : 'text-gray-800 hover:bg-white/20'
            ]"
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
        class="md:hidden absolute top-full left-0 w-full bg-white/95 backdrop-blur-xl border-t border-gray-100 shadow-xl"
      >
        <div class="px-6 py-6 space-y-4">
          <a 
            v-for="item in ['Home', 'Services', 'Pricing', 'Contact']" 
            :key="item"
            href="#" 
            @click="closeMenu"
            class="block text-gray-600 hover:text-indigo-600 hover:bg-indigo-50/50 hover:pl-6 px-4 py-3 rounded-xl text-lg font-medium transition-all duration-300 border border-transparent hover:border-indigo-100"
          >
            {{ item }}
          </a>
          
        <div class="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <a 
            href="https://wa.me/6281330659888?text=Halo%20Novatix!%20Saya%20tertarik%20dengan%20layanan%20Anda" 
            target="_blank"
            class="group relative inline-flex items-center gap-3 bg-green-500 hover:bg-green-400 text-white px-10 py-4 rounded-full font-bold text-lg transition-all duration-300 hover:scale-105 hover:shadow-[0_0_40px_rgba(34,197,94,0.3)] active:scale-95"
          >
            <Icon icon="ic:baseline-whatsapp" class="text-2xl group-hover:rotate-12 transition-transform duration-300" />
            <span>Chat via WhatsApp</span>
            <Icon icon="ph:arrow-right-bold" class="text-lg group-hover:translate-x-1 transition-transform duration-300" />
          </a>
        </div>
        </div>
      </div>
    </Transition>
  </nav>
</template>