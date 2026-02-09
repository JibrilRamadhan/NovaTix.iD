<script setup>
import Navbar from '../components/navbar.vue';
import Footer from '../components/footer.vue';
</script>

<template>
  <div class="flex flex-col min-h-screen bg-[#111827]">
    <Navbar />
    <main class="flex-grow pt-20">
      <slot />
    </main>
    <Footer />
  </div>
</template>