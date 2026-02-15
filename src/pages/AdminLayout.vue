<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { supabase } from '../lib/supabase'
import { Icon } from '@iconify/vue'

const router = useRouter()
const route = useRoute()

const user = ref(null)
const sidebarOpen = ref(false)

const navItems = [
  { name: 'Dashboard', icon: 'ph:squares-four-bold', route: '/admin' },
  { name: 'Portfolio', icon: 'ph:briefcase-bold', route: '/admin/portfolio' },
  { name: 'Pricing', icon: 'ph:coin-bold', route: '/admin/pricing' },
  { name: 'Testimonial', icon: 'ph:quotes-fill', route: '/admin/testimonials' },
]

onMounted(async () => {
  const { data: { session } } = await supabase.auth.getSession()
  if (session) {
    user.value = session.user
  }
})

const handleLogout = async () => {
  await supabase.auth.signOut()
  router.push('/login')
}

const isActive = (path) => {
  if (path === '/admin') return route.path === '/admin'
  return route.path.startsWith(path)
}
</script>

<template>
  <div class="min-h-screen bg-black flex text-white font-sans selection:bg-white/20">
    <!-- Sidebar Overlay (mobile) -->
    <Transition
      enter-active-class="transition-opacity duration-300"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-200"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div 
        v-if="sidebarOpen" 
        @click="sidebarOpen = false"
        class="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 lg:hidden"
      ></div>
    </Transition>

    <!-- Sidebar -->
    <aside 
      class="fixed lg:sticky top-0 left-0 z-50 h-screen w-72 bg-black border-r border-white/[0.1] flex flex-col transition-transform duration-300 lg:translate-x-0"
      :class="sidebarOpen ? 'translate-x-0' : '-translate-x-full'"
    >
      <!-- Logo -->
      <div class="h-20 flex items-center gap-3 px-6 border-b border-white/[0.06]">
        <img src="/img/logo.png" alt="NovaTix Logo" class="h-8 w-auto grayscale brightness-200" />
        <span class="text-xl font-bold text-white tracking-tight">NovaTix<span class="text-gray-500">.ID</span></span>
        <span class="ml-auto px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border border-white/20 text-white bg-white/10">
          Admin
        </span>
      </div>

      <!-- Navigation -->
      <nav class="flex-1 py-6 px-4 space-y-1 overflow-y-auto">
        <router-link
          v-for="item in navItems"
          :key="item.name"
          :to="item.route"
          @click="sidebarOpen = false"
          class="flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium transition-all duration-300 group relative overflow-hidden"
          :class="isActive(item.route) 
            ? 'text-white border border-white/[0.15] bg-white/[0.05] shadow-[0_0_15px_rgba(255,255,255,0.05)]' 
            : 'text-gray-500 hover:text-white hover:bg-white/[0.03] border border-transparent'"
        >
          <div v-if="isActive(item.route)" class="absolute left-0 top-0 bottom-0 w-1 bg-white"></div>
          <Icon 
            :icon="item.icon" 
            class="text-xl transition-all duration-300"
            :class="isActive(item.route) ? 'text-white' : 'text-gray-600 group-hover:text-gray-300'"
          />
          {{ item.name }}
        </router-link>
      </nav>

      <!-- User Info & Logout -->
      <div class="p-4 border-t border-white/[0.06]">
        <div class="flex items-center gap-3 px-4 py-3 mb-2 rounded-xl bg-white/[0.02]">
          <div class="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center border border-white/10">
            <Icon icon="ph:user-bold" class="text-white text-lg" />
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium text-white truncate">
              {{ user?.email || 'Admin' }}
            </p>
            <p class="text-xs text-gray-500">Administrator</p>
          </div>
        </div>
        <button
          @click="handleLogout"
          class="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-bold text-black bg-white hover:bg-gray-200 transition-all duration-300 shadow-[0_0_15px_rgba(255,255,255,0.1)]"
        >
          <Icon icon="ph:sign-out-bold" class="text-lg" />
          Keluar
        </button>
      </div>
    </aside>

    <!-- Main Content -->
    <div class="flex-1 flex flex-col min-h-screen w-full lg:w-auto">
      <!-- Top Bar -->
      <header class="h-20 bg-black/80 border-b border-white/[0.1] flex items-center justify-between px-6 sticky top-0 z-30 backdrop-blur-xl">
        <div class="flex items-center gap-4">
            <button
            @click="sidebarOpen = !sidebarOpen"
            class="lg:hidden p-2 rounded-xl text-white hover:bg-white/[0.1] transition-all duration-300"
            >
            <Icon icon="ph:list-bold" class="text-2xl" />
            </button>

            <div class="hidden lg:flex items-center gap-2 text-sm text-gray-500">
            <Icon icon="ph:house" class="text-base" />
            <span>/</span>
            <span class="text-white font-medium">{{ route.meta?.title || route.name }}</span>
            </div>
        </div>

        <div class="flex items-center gap-3">
          <router-link 
            to="/" 
            target="_blank"
            class="hidden md:flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold text-white bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.1] hover:border-white/[0.2] transition-all duration-300 hover:shadow-[0_0_15px_rgba(255,255,255,0.1)]"
          >
            <Icon icon="ph:globe" class="text-sm" />
            Lihat Website
            <Icon icon="ph:arrow-up-right-bold" class="text-xs" />
          </router-link>
        </div>
      </header>

      <!-- Page Content -->
      <main class="flex-1 p-6 lg:p-10 overflow-x-hidden">
        <router-view />
      </main>
    </div>
  </div>
</template>
