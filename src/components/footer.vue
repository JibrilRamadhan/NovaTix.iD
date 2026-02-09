<script setup>
import { Icon } from '@iconify/vue';
const currentYear = new Date().getFullYear();
</script>

<template>
  <footer class="bg-[#111827] text-white pt-16 pb-8 border-t border-gray-800">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
        
        <div class="space-y-4">
          <div class="flex items-center gap-2">
            <img src="/img/logo.png" alt="NovaTix Logo" class="h-32 w-auto grayscale brightness-200" />
            <span class="font-bold text-xl">NovaTix.ID</span>
          </div>
          <p class="text-gray-400 text-sm leading-relaxed">
            Solusi terbaik untuk pembuatan website profesional dan layanan joki coding terpercaya bagi mahasiswa & bisnis.
          </p>
        </div>

        <div>
          <h3 class="text-lg font-semibold mb-4 text-white">Layanan</h3>
          <ul class="space-y-3 text-sm text-gray-400">
            <li><a href="#" class="hover:text-blue-400 transition">Web Development</a></li>
            <li><a href="#" class="hover:text-blue-400 transition">Joki Tugas IT</a></li>
            <li><a href="#" class="hover:text-blue-400 transition">UI/UX Design</a></li>
            <li><a href="#" class="hover:text-blue-400 transition">Bug Fixing</a></li>
          </ul>
        </div>

        <div>
          <h3 class="text-lg font-semibold mb-4 text-white">Perusahaan</h3>
          <ul class="space-y-3 text-sm text-gray-400">
            <li><a href="#" class="hover:text-blue-400 transition">Tentang Kami</a></li>
            <li><a href="#" class="hover:text-blue-400 transition">Karir</a></li>
            <li><a href="#" class="hover:text-blue-400 transition">Blog</a></li>
            <li><a href="#" class="hover:text-blue-400 transition">Kebijakan Privasi</a></li>
          </ul>
        </div>

        <div>
          <h3 class="text-lg font-semibold mb-4 text-white">Hubungi Kami</h3>
          <ul class="space-y-3 text-sm text-gray-400 mb-6">
            <li class="flex items-center gap-2">
              <Icon icon="ph:envelope" class="text-lg"/> support@novatix.id
            </li>
            <li class="flex items-center gap-2">
              <Icon icon="ph:whatsapp-logo" class="text-lg"/> +62 812-3456-7890
            </li>
          </ul>
          
          <div class="flex gap-4">
            <a href="#" class="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-blue-600 transition">
              <Icon icon="ph:instagram-logo" class="text-xl"/>
            </a>
            <a href="#" class="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-blue-600 transition">
              <Icon icon="ph:twitter-logo" class="text-xl"/>
            </a>
            <a href="#" class="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-blue-600 transition">
              <Icon icon="ph:linkedin-logo" class="text-xl"/>
            </a>
          </div>
        </div>
      </div>

      <div class="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
        <p>&copy; {{ currentYear }} NovaTix.ID. All rights reserved.</p>
        <p>NovaTix Team</p>
      </div>
    </div>
  </footer>
</template>