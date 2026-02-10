<script setup>
import { Icon } from '@iconify/vue';
const currentYear = new Date().getFullYear();

const footerLinks = {
  layanan: [
    { label: 'Web Development', href: '#' },
    { label: 'Joki Tugas IT', href: '#' },
    { label: 'UI/UX Design', href: '#' },
    { label: 'Bug Fixing', href: '#' },
  ],
  perusahaan: [
    { label: 'Tentang Kami', href: '#' },
    { label: 'Karir', href: '#' },
    { label: 'Blog', href: '#' },
    { label: 'Kebijakan Privasi', href: '#' },
  ]
};

const socials = [
  { icon: 'ph:instagram-logo-fill', href: '#', label: 'Instagram' },
  { icon: 'ph:twitter-logo-fill', href: '#', label: 'Twitter' },
  { icon: 'ph:linkedin-logo-fill', href: '#', label: 'LinkedIn' },
  { icon: 'ph:github-logo-fill', href: '#', label: 'GitHub' },
];
</script>

<template>
  <footer class="relative bg-[#0a0a0f] text-white overflow-hidden">
    
    <!-- Top border gradient -->
    <div class="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent"></div>

    <!-- Background glow effects -->
    <div class="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-indigo-600/8 rounded-full blur-[150px] pointer-events-none opacity-10"></div>
    <div class="absolute top-1/3 left-1/4 w-[300px] h-[300px] bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none opacity-10"></div>
    <div class="absolute top-1/3 right-1/4 w-[300px] h-[300px] bg-violet-500/5 rounded-full blur-[100px] pointer-events-none opacity-10"></div>

    <div class="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
      
      <!-- Main Footer Content -->
      <div class="pt-20 pb-14 grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8">
        
        <!-- Brand Column -->
        <div class="md:col-span-4 space-y-6">
          <div class="flex items-center gap-3">
            <img src="/img/logo.png" alt="NovaTix Logo" class="h-12 w-auto" />
            <div>
              <span class="font-bold text-xl text-white tracking-tight">NovaTix<span class="text-indigo-400">.ID</span></span>
            </div>
          </div>
          <p class="text-gray-400 text-sm leading-relaxed max-w-xs">
            Solusi terbaik untuk pembuatan website profesional dan layanan joki coding terpercaya bagi mahasiswa & bisnis.
          </p>
          
          <!-- Social Links -->
          <div class="flex gap-2.5">
            <a 
              v-for="social in socials" 
              :key="social.label"
              :href="social.href" 
              :aria-label="social.label"
              class="w-10 h-10 rounded-xl bg-white/[0.05] border border-white/[0.08] flex items-center justify-center text-gray-400 hover:text-indigo-300 hover:bg-indigo-500/15 hover:border-indigo-500/30 transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-indigo-500/10"
            >
              <Icon :icon="social.icon" class="text-lg" />
            </a>
          </div>
        </div>

        <!-- Links Columns -->
        <div class="md:col-span-2 md:col-start-6">
          <h4 class="text-xs font-bold text-white tracking-widest uppercase mb-5">Layanan</h4>
          <ul class="space-y-3.5">
            <li v-for="link in footerLinks.layanan" :key="link.label">
              <a :href="link.href" class="text-sm text-gray-400 hover:text-indigo-300 transition-colors duration-200 hover:pl-1">
                {{ link.label }}
              </a>
            </li>
          </ul>
        </div>

        <div class="md:col-span-2">
          <h4 class="text-xs font-bold text-white tracking-widest uppercase mb-5">Perusahaan</h4>
          <ul class="space-y-3.5">
            <li v-for="link in footerLinks.perusahaan" :key="link.label">
              <a :href="link.href" class="text-sm text-gray-400 hover:text-indigo-300 transition-colors duration-200 hover:pl-1">
                {{ link.label }}
              </a>
            </li>
          </ul>
        </div>

        <!-- Contact Column -->
        <div class="md:col-span-3">
          <h4 class="text-xs font-bold text-white tracking-widest uppercase mb-5">Hubungi Kami</h4>
          <ul class="space-y-4">
            <li class="flex items-center gap-3 text-sm text-gray-400 group">
              <div class="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/15 flex items-center justify-center flex-shrink-0 group-hover:bg-indigo-500/20 transition-colors">
                <Icon icon="ph:envelope-simple" class="text-indigo-400 text-sm" />
              </div>
              <span>support@novatix.id</span>
            </li>
            <li class="flex items-center gap-3 text-sm text-gray-400 group">
              <div class="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/15 flex items-center justify-center flex-shrink-0 group-hover:bg-indigo-500/20 transition-colors">
                <Icon icon="ph:whatsapp-logo" class="text-indigo-400 text-sm" />
              </div>
              <span>+62 813-3065-9888</span>
            </li>
          </ul>
        </div>
      </div>

      <!-- Bottom Bar -->
      <div class="border-t border-white/[0.06] py-7 flex flex-col md:flex-row justify-between items-center gap-4">
        <p class="text-xs text-gray-500">
          &copy; {{ currentYear }} NovaTix.ID — All rights reserved.
        </p>
        <p class="text-xs text-gray-500">
          Crafted with <span class="text-indigo-400">♥</span> by NovaTix Team
        </p>
      </div>

    </div>
  </footer>
</template>