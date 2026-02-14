<script setup>
import { ref, onMounted } from 'vue'
import { Icon } from '@iconify/vue'
import Navbar from '../components/navbar.vue'
import Footer from '../components/footer.vue'
import { useScrollReveal } from '../composables/useScrollReveal'

useScrollReveal()

// --- Data Services ---
const mainServices = [
  {
    icon: 'ph:student-bold',
    title: 'Academic Coding Assist',
    desc: 'Bantuan coding tugas/skripsi. Fokus pada logika & clean code.',
    tags: ['Mahasiswa', 'Skripsi', 'Tugas Akhir'],
    features: ['Sesuai modul dosen', 'Dokumentasi lengkap', 'Private Mentoring', 'Garansi Revisi'],
    color: 'indigo',
    popular: true
  },
  {
    icon: 'ph:storefront-bold',
    title: 'Website UMKM Go Digital',
    desc: 'Website bisnis profesional untuk meningkatkan kredibilitas & penjualan.',
    tags: ['UMKM', 'Company Profile', 'Landing Page'],
    features: ['Desain Premium', 'Integrasi WhatsApp', 'SEO Basic', 'Free Hosting 1 Thn'],
    color: 'amber',
    popular: false
  },
  {
    icon: 'ph:bug-beetle-bold',
    title: 'Bug Fixing & Repair',
    desc: 'Perbaikan error website, optimasi loading, dan troubleshooting database.',
    tags: ['Error Fix', 'Speed Opt', 'Database'],
    features: ['Analisis Mendalam', 'Tanpa Hapus Data', 'Garansi 7 Hari', 'Full Report'],
    color: 'rose',
    popular: false
  },
  {
    icon: 'ph:kanban-bold',
    title: 'Custom System & Dashboard',
    desc: 'Aplikasi berbasis web untuk manajemen stok, kasir, atau sistem kantor.',
    tags: ['Sistem Informasi', 'ERP', 'Admin Panel'],
    features: ['Custom Flow', 'Export Excel/PDF', 'Role Management', 'Keamanan Tinggi'],
    color: 'violet',
    popular: false
  }
]

const additionalServices = [
  { icon: 'ph:globe-duotone', title: 'Domain & Hosting', desc: 'Setup server & deploy.' },
  { icon: 'ph:rocket-launch-duotone', title: 'SEO Optimization', desc: 'Rank 1 Google Search.' },
  { icon: 'ph:shield-check-duotone', title: 'Security Audit', desc: 'Pentest & proteksi web.' },
  { icon: 'ph:device-mobile-duotone', title: 'Mobile Apps', desc: 'Android & iOS (Flutter).' },
  { icon: 'ph:database-duotone', title: 'Backend API', desc: 'REST API & Microservices.' },
  { icon: 'ph:wrench-duotone', title: 'Maintenance', desc: 'Update rutin & backup.' }
]

const process = [
  { step: '01', title: 'Konsultasi', desc: 'Diskusi kebutuhan & goals.', icon: 'ph:chats-circle-duotone' },
  { step: '02', title: 'Planning', desc: 'Strategi, timeline & wireframe.', icon: 'ph:strategy-duotone' },
  { step: '03', title: 'Development', desc: 'Coding & update progress.', icon: 'ph:code-duotone' },
  { step: '04', title: 'Launch', desc: 'Testing, deploy & serah terima.', icon: 'ph:rocket-duotone' }
]

// --- Logic: Spotlight Effect ---
// Fungsi ini melacak posisi mouse relatif terhadap kartu untuk efek cahaya
const handleMouseMove = (e) => {
  const cards = document.getElementsByClassName('spotlight-card');
  for (const card of cards) {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    card.style.setProperty('--mouse-x', `${x}px`);
    card.style.setProperty('--mouse-y', `${y}px`);
  }
}
</script>

<template>
  <Navbar />
  <main class="bg-black text-white min-h-screen font-sans selection:bg-indigo-500/30" @mousemove="handleMouseMove">
    
    <section class="relative pt-32 pb-24 px-6 md:px-12 overflow-hidden">
      <div class="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none animate-float"></div>
      <div class="absolute bottom-0 left-0 w-[500px] h-[500px] bg-violet-600/10 rounded-full blur-[120px] pointer-events-none animate-float-delayed"></div>
      <div class="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.04] pointer-events-none"></div>

      <!-- Gradient Mask (Fade to Black) -->
      <div class="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black to-transparent pointer-events-none z-20"></div>

      <div class="max-w-6xl mx-auto relative z-10 text-center">
        <span data-reveal class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.08] text-indigo-300 text-xs font-bold tracking-widest uppercase mb-8 backdrop-blur-md hover:bg-white/[0.08] transition-colors cursor-default shadow-lg shadow-indigo-500/10">
          <span class="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
          Our Services
        </span>
        
        <h1 data-reveal data-delay="100" class="text-5xl md:text-7xl font-bold text-white mb-8 tracking-tight leading-[1.1]">
          Solusi Digital <br class="hidden md:block" />
          <span class="relative inline-block">
            <span class="absolute inset-x-0 bottom-0 h-4 bg-indigo-500/20 blur-xl"></span>
            <span class="relative text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-purple-300 to-indigo-300 animate-gradient-x drop-shadow-[0_0_15px_rgba(99,102,241,0.3)]">
              Tanpa Batas
            </span>
          </span>
        </h1>
        
        <p data-reveal data-delay="200" class="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-10">
          Dari tugas kuliah hingga sistem perusahaan skala besar. Kami menerjemahkan ide Anda menjadi kode yang efisien dan elegan.
        </p>

        <div data-reveal data-delay="300" class="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <a 
            href="https://wa.me/6281330659888?text=Halo%20Novatix!%20Saya%20ingin%20konsultasi"
            target="_blank"
            class="group relative px-8 py-4 bg-indigo-600 rounded-full overflow-hidden transition-all hover:scale-105 hover:shadow-[0_0_50px_-10px_rgba(79,70,229,0.5)] ring-1 ring-white/20"
          >
            <div class="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div class="relative flex items-center gap-2 font-bold text-white">
              <span>Konsultasi Gratis</span>
              <Icon icon="ph:arrow-right-bold" class="group-hover:translate-x-1 transition-transform" />
            </div>
          </a>
        </div>
      </div>
    </section>

    <section class="relative py-20 px-6 md:px-12">
      <div class="max-w-7xl mx-auto">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div 
            v-for="(service, i) in mainServices" 
            :key="i"
            class="spotlight-card group relative rounded-3xl bg-white/[0.02] border border-white/[0.08] overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)]"
            data-reveal
            :data-delay="i * 100"
          >
            <!-- Glassmorphism Backdrop -->
            <div class="absolute inset-0 bg-white/[0.01] backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

            <!-- Spotlight Effect -->
            <div 
              class="pointer-events-none absolute -inset-px opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              style="background: radial-gradient(600px circle at var(--mouse-x) var(--mouse-y), rgba(99, 102, 241, 0.1), transparent 40%);"
            ></div>

            <!-- Gradient Border Glow -->
            <div class="absolute inset-0 rounded-3xl border border-transparent group-hover:border-indigo-500/30 transition-colors duration-500 pointer-events-none"></div>

            <div class="relative p-8 md:p-10 h-full flex flex-col z-10">
              <div v-if="service.popular" class="absolute top-6 right-6 z-20">
                <div class="relative">
                  <span class="absolute inset-0 bg-indigo-500 blur-lg opacity-40"></span>
                  <span class="relative px-3 py-1 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-[10px] font-bold uppercase tracking-wider shadow-lg ring-1 ring-white/20">
                    Popular
                  </span>
                </div>
              </div>

              <div class="w-16 h-16 rounded-2xl bg-white/[0.03] border border-white/[0.08] flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-indigo-500/10 group-hover:border-indigo-500/30 transition-all duration-500 shadow-inner shadow-white/5">
                <Icon :icon="service.icon" class="text-3xl text-gray-400 group-hover:text-indigo-400 transition-colors duration-500" />
              </div>

              <h3 class="text-2xl font-bold text-white mb-3 group-hover:text-indigo-300 transition-colors">
                {{ service.title }}
              </h3>
              <p class="text-gray-400 text-sm leading-relaxed mb-6 group-hover:text-gray-300 transition-colors">
                {{ service.desc }}
              </p>

              <div class="flex flex-wrap gap-2 mb-8">
                <span v-for="tag in service.tags" :key="tag" class="text-[11px] font-medium px-2.5 py-1 rounded-md bg-white/[0.03] text-gray-400 border border-white/[0.05] group-hover:border-indigo-500/20 group-hover:bg-indigo-500/5 transition-colors">
                  #{{ tag }}
                </span>
              </div>

              <div class="mt-auto space-y-3 pt-6 border-t border-white/[0.06] group-hover:border-white/[0.1] transition-colors">
                <div v-for="f in service.features" :key="f" class="flex items-center gap-3 text-sm text-gray-400 group-hover:text-gray-200 transition-colors">
                  <Icon icon="ph:check-circle-fill" class="text-indigo-500/70 group-hover:text-indigo-400 text-lg flex-shrink-0 transition-colors" />
                  <span>{{ f }}</span>
                </div>
              </div>

              <div class="mt-8">
                <a 
                  href="https://wa.me/6281330659888" 
                  target="_blank"
                  class="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-sm font-bold text-gray-300 group-hover:bg-indigo-600 group-hover:border-indigo-500 group-hover:text-white transition-all duration-300 shadow-lg shadow-transparent group-hover:shadow-indigo-500/25"
                >
                  Pesan Sekarang
                  <Icon icon="ph:arrow-right-bold" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="relative py-24 px-6 md:px-12 bg-white/[0.01] overflow-hidden">
      <!-- Background Elements -->
      <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[300px] bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none"></div>

      <div class="max-w-6xl mx-auto relative z-10">
        <div class="text-center mb-20">
          <span data-reveal class="text-indigo-400 font-bold tracking-widest text-xs uppercase mb-3 block">Simple Process</span>
          <h2 data-reveal data-delay="100" class="text-3xl md:text-5xl font-bold text-white mb-4">Workflow</h2>
          <p data-reveal data-delay="200" class="text-gray-400 max-w-lg mx-auto">Kami menyederhanakan proses kompleks menjadi langkah-langkah yang mudah dipahami.</p>
        </div>

        <div class="relative grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">
          <!-- Animated Line (Desktop) -->
          <div class="hidden md:block absolute top-[48px] left-0 w-full h-[2px] bg-white/[0.05] z-0 overflow-hidden">
            <div class="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-indigo-500 to-transparent animate-shimmer"></div>
          </div>

          <div v-for="(p, i) in process" :key="i" data-reveal :data-delay="i * 150" class="relative z-10 text-center group">
            <div class="relative w-24 h-24 mx-auto mb-8 rounded-2xl bg-[#0A0A0A] border border-white/10 flex items-center justify-center group-hover:border-indigo-500/50 group-hover:shadow-[0_0_30px_rgba(99,102,241,0.25)] group-hover:-translate-y-2 transition-all duration-500">
              <div class="absolute inset-0 rounded-2xl bg-indigo-500/5 scale-0 group-hover:scale-100 transition-transform duration-500"></div>
              
              <Icon :icon="p.icon" class="text-4xl text-gray-500 group-hover:text-indigo-400 transition-colors duration-500 group-hover:scale-110" />
              
              <div class="absolute -top-3 -right-3 w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center text-xs font-bold shadow-lg ring-4 ring-black transform group-hover:rotate-12 transition-transform duration-500">
                {{ p.step }}
              </div>
            </div>
            
            <h3 class="text-xl font-bold text-white mb-3 group-hover:text-indigo-300 transition-colors">{{ p.title }}</h3>
            <p class="text-gray-500 text-sm leading-relaxed px-2">{{ p.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <section class="py-24 px-6 md:px-12 border-t border-white/[0.05] bg-black">
      <div class="max-w-6xl mx-auto">
        <h3 data-reveal class="text-xl text-center text-gray-400 mb-12 font-medium">Layanan Pendukung Lainnya</h3>
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <div 
            v-for="(item, i) in additionalServices" 
            :key="item.title"
            data-reveal
            :data-delay="i * 50"
            class="group p-6 rounded-2xl bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.05] hover:border-indigo-500/20 text-center transition-all duration-300 cursor-default hover:-translate-y-1"
          >
            <Icon :icon="item.icon" class="text-3xl text-gray-500 group-hover:text-indigo-400 mx-auto mb-4 transition-colors duration-300" />
            <h4 class="text-xs font-bold text-white mb-2 tracking-wide uppercase group-hover:text-indigo-300 transition-colors">{{ item.title }}</h4>
            <p class="text-[10px] text-gray-500 leading-tight hidden md:block">{{ item.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <section class="relative py-32 px-6 md:px-12 overflow-hidden">
      <!-- Decor -->
      <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-full blur-[100px] pointer-events-none animate-pulse"></div>

      <div data-reveal class="max-w-4xl mx-auto relative z-10 text-center bg-white/[0.02] border border-white/[0.08] backdrop-blur-2xl rounded-[3rem] p-8 md:p-20 shadow-2xl">
        <h2 class="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight">
          Siap untuk <span class="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Upgrade?</span>
        </h2>
        <p class="text-gray-400 text-lg md:text-xl mb-12 max-w-xl mx-auto leading-relaxed">
          Jangan biarkan ide hebat Anda hanya menjadi wacana. Konsultasikan dengan tim ahli kami sekarang, gratis.
        </p>
        <a 
          href="https://wa.me/6281330659888" 
          target="_blank"
          class="inline-flex items-center gap-3 px-10 py-5 rounded-full bg-green-500 hover:bg-green-400 text-white font-bold text-lg transition-all hover:shadow-[0_0_40px_rgba(34,197,94,0.4)] hover:-translate-y-1 active:scale-95"
        >
          <Icon icon="ic:baseline-whatsapp" class="text-2xl" />
          Chat via WhatsApp
        </a>
      </div>
    </section>

  </main>
  <Footer />
</template>

<style scoped>
/* Animasi Floating Blob */
@keyframes float {
  0% { transform: translate(0, 0) scale(1); }
  33% { transform: translate(30px, -50px) scale(1.1); }
  66% { transform: translate(-20px, 20px) scale(0.9); }
  100% { transform: translate(0, 0) scale(1); }
}
.animate-float {
  animation: float 20s ease-in-out infinite;
}
.animate-float-delayed {
  animation: float 15s ease-in-out infinite reverse;
}

/* Animasi Gradient Text */
@keyframes gradient-x {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}
.animate-gradient-x {
  background-size: 200% 200%;
  animation: gradient-x 5s ease infinite;
}

/* Animasi Shimmer untuk Garis Workflow */
@keyframes shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}
.animate-shimmer {
  animation: shimmer 3s infinite linear;
}
</style>