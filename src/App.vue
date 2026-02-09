<script setup>
import Navbar from './components/navbar.vue';
import Footer from './components/footer.vue';
import { Icon } from '@iconify/vue';

const services = [
  {
    icon: 'ph:code-bold',
    title: 'Quantum Web Dev',
    desc: 'Pembuatan website responsif, modern, dan SEO friendly dengan teknologi terbaru.',
    link: '#',
    highlight: false
  },
  {
    icon: 'ph:lightning-bold',
    title: 'Joki Tugas Coding',
    desc: 'Bantuan pengerjaan tugas kuliah, skripsi, atau error fixing. Cepat & Aman.',
    link: '#',
    highlight: true
  },
  {
    icon: 'ph:chats-circle-bold',
    title: 'Konsultasi Gratis',
    desc: 'Bingung mulai dari mana? Diskusi gratis mengenai project sebelum memesan.',
    link: '#',
    highlight: false
  }
];

const features = [
  { icon: 'ph:globe', title: 'Domain & Hosting', desc: 'Bantuan setup server & deploy.' },
  { icon: 'ph:rocket-launch', title: 'SEO Optimization', desc: 'Naikkan ranking Google bisnis Anda.' },
  { icon: 'ph:shield-check', title: 'Security Audit', desc: 'Cek celah keamanan website.' },
];
</script>

<template>
  <div class="min-h-screen flex flex-col font-sans bg-[#fdfbf7]">
    <Navbar />
    <main class="grow">
      
  <section class="bg-[#111827] text-white pt-28 pb-16 md:px-12 relative">
    
    <div class="max-w-7xl mx-auto flex flex-col-reverse md:flex-row items-center gap-8 md:gap-16">
      
      <div class="w-full md:w-1/2 space-y-6 text-center md:text-left z-10">
        <h1 class="text-4xl md:text-6xl font-bold leading-tight">
          Web Development & <br>
          <span class="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600">
            Joki Service
          </span>
        </h1>

        <p class="text-gray-400 text-lg leading-relaxed max-w-lg mx-auto md:mx-0">
          Solusi pembuatan website profesional dan joki tugas coding terpercaya.
          Dikerjakan oleh expert, hasil rapi, dan tepat waktu.
        </p>

        <div class="flex flex-col sm:flex-row gap-4 justify-center md:justify-start pt-6">
          <a href="#" class="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3.5 rounded-xl font-semibold shadow-lg shadow-blue-500/40 transition transform hover:-translate-y-1">
            Mulai Sekarang
          </a>
          <a href="#" class="border border-gray-700 hover:border-blue-500 text-gray-300 hover:text-white px-8 py-3.5 rounded-xl font-semibold transition">
            Pelajari Layanan
          </a>
        </div>
      </div>

      <div class="w-full md:w-1/2 flex justify-center z-10 relative">
        <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[250px] h-[250px] bg-blue-600/20 rounded-full blur-[90px]"></div>
        
        <img 
          src="/img/char.png" 
          alt="Hero Character" 
          class="relative w-full max-w-[350px] md:max-w-[450px] h-auto object-contain drop-shadow-2xl animate-float"
        />
      </div>
    </div>
  </section>

  <section class="py-16 px-6 md:px-12 max-w-7xl mx-auto bg-white relative">
    
    <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div 
        v-for="(service, index) in services" 
        :key="index"
        class="bg-white text-gray-900 p-8 rounded-2xl shadow-lg hover:-translate-y-2 transition duration-300 border border-gray-100 flex flex-col"
        :class="{ 'border-blue-500 ring-2 ring-blue-500/20': service.highlight }"
      >
        <div class="w-14 h-14 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-6 text-3xl">
          <Icon :icon="service.icon" />
        </div>
        
        <h3 class="text-xl font-bold mb-3">{{ service.title }}</h3>
        <p class="text-gray-500 text-sm mb-8 leading-relaxed flex-grow">
          {{ service.desc }}
        </p>
        
        <a 
          :href="service.link" 
          class="inline-flex items-center gap-2 text-sm font-semibold transition hover:gap-3 mt-auto"
          :class="service.highlight ? 'bg-blue-600 hover:bg-blue-700 w-full justify-center py-3 rounded-lg text-white' : 'text-blue-600 hover:text-blue-700'"
        >
          {{ service.highlight ? 'Order Now' : 'Learn More' }}
          <Icon icon="ph:arrow-right" v-if="!service.highlight"/>
        </a>
      </div>
    </div>

    <div class="text-center mt-24 mb-16">
      <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mt-4">
        Solusi Digital Terlengkap
      </h2>
      <p class="text-gray-500 mt-3 max-w-2xl mx-auto">Kami menyediakan segala kebutuhan digital Anda dalam satu platform terintegrasi.</p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
       <div 
           v-for="(feature, index) in features" 
           :key="index"
           class="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl border border-gray-100 transition-all duration-300 group"
         >
           <div class="text-blue-600 mb-6 text-5xl group-hover:scale-110 transition duration-300">
             <Icon :icon="feature.icon" />
           </div>
           
           <h3 class="text-lg font-bold text-gray-900 mb-2">{{ feature.title }}</h3>
           <p class="text-gray-500 text-sm mb-6">{{ feature.desc }}</p>
           
           <button class="bg-blue-50 text-blue-600 px-5 py-2 rounded-lg text-xs font-bold hover:bg-blue-100 transition">
             Lihat Detail
           </button>
         </div>
    </div>

  </section>
    </main>

    <Footer />
  </div>
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