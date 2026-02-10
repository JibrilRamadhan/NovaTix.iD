<script setup>
import Navbar from './components/navbar.vue';
import Footer from './components/footer.vue';
import TeamMembers from './components/teamMembers.vue';
import { Icon } from '@iconify/vue';

import { ref, onMounted, onUnmounted } from 'vue';
const sectionRef = ref(null);
const isVisible = ref(false);
let observer = null;
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

const pricingPlans = [
  {
    name: 'Paket Rintis',
    desc: 'Tampil online dengan website simpel dan profesional.',
    originalPrice: 'Rp3.000.000',
    discount: '50%',
    price: 'Rp1.500.000',
    renewal: 'Rp800.000 / tahun',
    popular: false,
    features: [
      '1 Halaman Website',
      'Gratis Domain',
      'Gratis Update Konten & Maintenance',
      'Website Mobile Friendly & SEO Basic',
      'Desain Modern & Sesuai Karakter Bisnis Kamu'
    ]
  },
  {
    name: 'Paket Kembang',
    desc: 'Website lebih lengkap untuk dukung perkembangan bisnismu.',
    originalPrice: 'Rp10.000.000',
    discount: '55%',
    price: 'Rp4.500.000',
    renewal: 'Rp1.500.000 / tahun',
    popular: true,
    features: [
      'Semua di Paket Rintis',
      '5 Halaman Website',
      'Desain Modern & Sesuai Karakter Bisnis Kamu',
      'Halaman Produk, Layanan, Galeri, atau Portofolio',
      'Fitur Tambahan seperti Form Kontak'
    ]
  },
  {
    name: 'Paket Unggul',
    desc: 'Maksimalkan performa dan pengalaman pengguna.',
    originalPrice: 'Rp15.000.000',
    discount: '45%',
    price: 'Rp8.500.000',
    renewal: 'Rp2.500.000 / tahun',
    popular: false,
    features: [
      'Semua di Paket Kembang',
      '10 Halaman Website',
      'Desain Lebih Eksklusif & Premium',
      'Fitur Tambahan seperti Booking, Katalog, atau Integrasi Lainnya',
      'Optimasi SEO Lebih Maksimal',
      'Layanan Bantuan Prioritas'
    ]
  }
];

const teamMembers = [
  {
    name: 'Ahmad Haikal Rizal',
    role: 'Full Stack Engineer',
    image: '/img/haikal.png',
    bio: 'Menguasai pengembangan aplikasi web dari sisi depan hingga belakang dengan performa tinggi dan skalabilitas optimal menggunakan teknologi modern.',
    skills: ['Vue.js', 'React', 'Node.js', 'PostgreSQL'],
    social: { linkedin: '#', github: '#' }
  },
  {
    name: 'Jibril Ramadhan',
    role: 'Frontend Engineer',
    image: '/img/jib2.png',
    bio: 'Spesialis antarmuka pengguna dengan keahlian mendalam pada ekosistem Vue dan React. Fokus pada detail desain dan pengalaman pengguna yang interaktif.',
    skills: ['Vue.js', 'React', 'Tailwind', 'TypeScript'],
    social: { linkedin: '#', github: '#' }
  },
  {
    name: 'Muhammad Farelino Hendika',
    role: 'Head of Marketing & Client Relations',
    image: '/img/dika.jpeg',
    bio: 'Bertanggung jawab atas strategi media sosial, layanan pelanggan, dan memastikan setiap kebutuhan klien terpenuhi dengan solusi terbaik.',
    skills: ['Social Media Strategy', 'Customer Service', 'Sales', 'Public Relations'],
    social: { linkedin: '#', github: '#' }
  },
  {
    name: 'Niko Budi Prasetyo',
    role: 'Backend Engineer',
    image: '/img/niko.PNG',
    bio: 'Arsitek sistem backend yang fokus pada keamanan, efisiensi database, dan logika server yang handal untuk mendukung aplikasi skala besar.',
    skills: ['Golang', 'Python', 'Docker', 'PHP', 'JavaScript'],
    social: { linkedin: '#', github: '#' }
  }
];

const heroVideo = ref(null);

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

        <h1 class="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight text-white mb-6 leading-[1.1]">
          Web Development <br class="hidden md:block" />
          <span class="text-transparent bg-clip-text bg-gradient-to-b from-white to-indigo-800">
            & Coding Solutions
          </span>
        </h1>

        <p class="text-lg md:text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed font-light">
          Solusi pembuatan website profesional dan desain UI/UX yang memukau. 
          Dikerjakan oleh expert, hasil rapi, dan tepat waktu.
        </p>

        <div class="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          
          <a href="#" class="group relative inline-flex items-center justify-center gap-2 bg-white text-black px-8 py-3.5 rounded-full font-semibold transition-all duration-300 hover:scale-105 hover:shadow-[0_0_20px_rgba(255,255,255,0.3)]">
            <span>Mulai Sekarang</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="group-hover:translate-x-1 transition-transform"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
          </a>

          <a href="#" class="group inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full font-medium text-white border border-white/20 bg-white/5 backdrop-blur-sm transition-all duration-300 hover:bg-white/10 hover:border-white/40">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-gray-400 group-hover:text-white transition-colors"><circle cx="12" cy="12" r="10"></circle><polygon points="10 8 16 12 10 16"></polygon></svg>
            <span>Lihat Portfolio</span>
          </a>

        </div>

      </div>

      <div class="absolute bottom-0 left-0 w-full h-40 bg-gradient-to-t from-black via-black/80 to-transparent z-10 pointer-events-none"></div>

    </section>

    <!-- ═══════════════════════════════════════════ -->
    <!-- SECTION 2: SERVICES & FEATURES             -->
    <!-- ═══════════════════════════════════════════ -->
    <section class="relative pt-24 z-20 px-6 md:px-12 max-w-7xl mx-auto pb-28">
      
      <!-- Section Header -->
      <div class="text-center mb-16">
        <span class="inline-block px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold tracking-widest uppercase mb-6">
          Layanan Kami
        </span>
        <h2 class="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
          Apa yang Kami <span class="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-indigo-300">Tawarkan</span>
        </h2>
        <p class="text-gray-400 max-w-2xl mx-auto text-lg">Solusi lengkap untuk kebutuhan digital Anda, dikerjakan oleh tim profesional.</p>
      </div>

      <!-- Service Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
        <div 
          v-for="(service, index) in services" 
          :key="service.title"
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
            <div class="px-4 py-1 bg-indigo-500 text-white text-[10px] font-bold tracking-wider uppercase rounded-b-lg shadow-lg shadow-indigo-500/30">
              Paling Diminati
            </div>
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
              {{ service.highlight ? 'Order Now' : 'Learn More' }}
              <Icon icon="ph:arrow-right" class="transition-transform duration-300" :class="!service.highlight && 'group-hover:translate-x-1'" />
            </a>
          </div>
        </div>
      </div>

      <!-- Divider -->
      <div class="flex items-center gap-6 mt-28 mb-16">
        <div class="flex-1 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
        <span class="inline-block px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-gray-500 text-xs font-semibold tracking-widest uppercase">
          Lebih Banyak
        </span>
        <div class="flex-1 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
      </div>

      <!-- Section Title -->
      <div class="text-center mb-16">
        <h2 class="text-3xl md:text-4xl font-bold text-white tracking-tight">
          Solusi Digital <span class="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-indigo-300">Terlengkap</span>
        </h2>
        <p class="text-gray-400 mt-4 max-w-2xl mx-auto text-lg">Kami menyediakan segala kebutuhan digital Anda dalam satu platform terintegrasi.</p>
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
                Lihat Detail
              </button>
            </div>
          </div>
      </div>

    </section>

    <!-- ═══════════════════════════════════════════ -->
    <!-- SECTION: PRICELIST                          -->
    <!-- ═══════════════════════════════════════════ -->
    <section class="relative py-28 px-6 md:px-12 overflow-hidden">
      <!-- Background effects -->
      <div class="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-indigo-600/5 rounded-full blur-[150px] pointer-events-none"></div>

      <div class="max-w-7xl mx-auto relative z-10">
        <!-- Header -->
        <div class="text-center mb-16">
          <h2 class="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
            Pilih Paket <span class="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-indigo-300">Terbaik</span>
          </h2>
          <p class="text-gray-400 max-w-2xl mx-auto text-lg">
            Investasi terbaik untuk kehadiran digital bisnis Anda. Semua paket termasuk domain gratis.
          </p>
        </div>

        <!-- Pricing Cards -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-0 items-stretch">
          <div 
            v-for="(plan, index) in pricingPlans" 
            :key="plan.name"
            class="relative flex flex-col rounded-3xl border transition-all duration-500 group overflow-hidden"
            :class="[
              plan.popular 
                ? 'bg-gradient-to-b from-indigo-600/15 via-indigo-900/10 to-black border-indigo-500/40 shadow-2xl shadow-indigo-500/10 lg:scale-105 lg:z-10 hover:shadow-indigo-500/20' 
                : 'bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.04] hover:border-white/[0.1]',
              index === 0 ? 'lg:rounded-r-none' : '',
              index === 2 ? 'lg:rounded-l-none' : '',
            ]"
          >
            <!-- Popular Badge -->
            <div v-if="plan.popular" class="absolute -top-px left-1/2 -translate-x-1/2 z-20">
              <div class="flex items-center gap-1.5 px-4 py-1.5 bg-gradient-to-r from-indigo-600 to-indigo-500 text-white text-[10px] font-bold tracking-wider uppercase rounded-b-xl shadow-lg shadow-indigo-500/30">
                <Icon icon="ph:star-four-fill" class="text-xs" />
                Paling Populer
              </div>
            </div>

            <div class="p-8 flex flex-col h-full">
              <!-- Plan Name -->
              <h3 class="text-2xl font-bold text-white mb-2">{{ plan.name }}</h3>
              <p class="text-gray-400 text-sm mb-6 leading-relaxed">{{ plan.desc }}</p>

              <!-- Price -->
              <div class="mb-6">
                <div class="flex items-center gap-3 mb-1">
                  <span class="text-gray-500 line-through text-sm">{{ plan.originalPrice }}</span>
                  <span class="px-2 py-0.5 rounded-md bg-green-500/15 text-green-400 text-[11px] font-bold border border-green-500/20">
                    Diskon {{ plan.discount }}
                  </span>
                </div>
                <div class="text-4xl md:text-5xl font-extrabold text-white tracking-tight">
                  {{ plan.price }}
                </div>
                <p class="text-gray-500 text-xs mt-1.5">
                  Perpanjangan {{ plan.renewal }}
                </p>
              </div>

              <!-- CTA Button -->
              <a 
                href="#" 
                class="w-full py-3.5 rounded-xl font-bold text-sm text-center transition-all duration-300 mb-8 block"
                :class="plan.popular 
                  ? 'bg-indigo-500 text-white hover:bg-indigo-400 shadow-lg shadow-indigo-500/25 hover:shadow-indigo-400/30 hover:scale-[1.02] active:scale-[0.98]' 
                  : 'bg-white/5 text-white border border-white/10 hover:bg-white/10 hover:border-white/20 hover:scale-[1.02] active:scale-[0.98]'"
              >
                Pilih Paket Ini
              </a>

              <!-- Features -->
              <div class="border-t border-white/[0.06] pt-6">
                <p class="text-xs font-bold text-gray-300 tracking-wider uppercase mb-4">Fitur Unggulan:</p>
                <ul class="space-y-3">
                  <li 
                    v-for="feature in plan.features" 
                    :key="feature" 
                    class="flex items-start gap-3 text-sm text-gray-400"
                  >
                    <Icon icon="ph:check-circle-fill" class="text-indigo-400 text-lg mt-0.5 flex-shrink-0" />
                    <span>{{ feature }}</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
     
    <TeamMembers :members="teamMembers" />

    <!-- ═══════════════════════════════════════════ -->
    <!-- SECTION: CONTACT / WHATSAPP CTA             -->
    <!-- ═══════════════════════════════════════════ -->
    <section class="relative py-28 px-6 md:px-12 overflow-hidden">
      <!-- Background effects -->
      <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-green-600/5 rounded-full blur-[120px] pointer-events-none"></div>
      <div class="absolute bottom-0 right-0 w-[300px] h-[300px] bg-indigo-600/5 rounded-full blur-[100px] pointer-events-none"></div>

      <div class="max-w-4xl mx-auto relative z-10 text-center">

        <!-- Headline -->
        <h2 class="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight">
          Punya Project? <br class="hidden md:block" />
          <span class="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-300">
            Yuk Diskusi!
          </span>
        </h2>

        <!-- Description -->
        <p class="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed">
          Konsultasikan kebutuhan project Anda langsung melalui WhatsApp. Respon cepat, 
          tanpa ribet, dan tentunya <strong class="text-white">gratis</strong>.
        </p>

        <!-- WhatsApp Button -->
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

        <!-- Trust indicators -->
        <div class="flex flex-wrap items-center justify-center gap-8 mt-12 text-sm text-gray-500">
          <div class="flex items-center gap-2">
            <Icon icon="ph:clock-bold" class="text-green-400" />
            <span>Respon &lt; 5 menit</span>
          </div>
          <div class="flex items-center gap-2">
            <Icon icon="ph:shield-check-bold" class="text-green-400" />
            <span>Konsultasi gratis</span>
          </div>
          <div class="flex items-center gap-2">
            <Icon icon="ph:handshake-bold" class="text-green-400" />
            <span>Tanpa komitmen</span>
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