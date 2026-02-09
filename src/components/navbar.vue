<script setup>
import { ref } from 'vue';
import { Icon } from '@iconify/vue'; 

const isMenuOpen = ref(false);

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};
</script>

<template>
  <nav class="bg-white text-white fixed w-full z-50 top-0 border-b border-gray-800 border">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-20 items-center relative">
        
        <div class="flex-shrink-0 flex items-center ">
          <img class="h-32 w-auto object-contain" src="/img/logo.png" alt="NovaTix Logo" />
          <span class="text-gray-900 font-bold text-xl tracking-wide">NovaTix.ID</span>
        </div>

        <div class="hidden md:flex space-x-8 items-center absolute left-1/2 transform -translate-x-1/2">
          <a href="#" class="text-gray-800 hover:text-white hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium transition">Home</a>
          <a href="#" class="text-gray-800 hover:text-white hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium transition">Services</a>
          <a href="#" class="text-gray-800 hover:text-white hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium transition">Pricing</a>
          <a href="#" class="text-gray-800 hover:text-white hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium transition">Contact</a>
        </div>


        <div class="flex items-center md:hidden">
          <button @click="toggleMenu" class="text-gray-300 hover:text-white focus:outline-none p-2">
            <Icon :icon="isMenuOpen ? 'ph:x' : 'ph:list'" class="text-3xl" />
          </button>
        </div>
      </div>
    </div>

    <div v-show="isMenuOpen" class="md:hidden bg-[#111827] border-t border-gray-800 absolute w-full left-0">
      <div class="px-4 pt-2 pb-6 space-y-2">
        <a href="#" class="block text-gray-300 hover:text-white hover:bg-gray-700 px-3 py-3 rounded-md text-base font-medium">Home</a>
        <a href="#" class="block text-gray-300 hover:text-white hover:bg-gray-700 px-3 py-3 rounded-md text-base font-medium">Services</a>
        <a href="#" class="block text-gray-300 hover:text-white hover:bg-gray-700 px-3 py-3 rounded-md text-base font-medium">Pricing</a>
        <a href="#" class="block text-gray-300 hover:text-white hover:bg-gray-700 px-3 py-3 rounded-md text-base font-medium">Contact</a>
      </div>
    </div>
  </nav>
</template>