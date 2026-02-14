<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '../lib/supabase'
import { Icon } from '@iconify/vue'

const router = useRouter()

const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')
const showPassword = ref(false)

const handleLogin = async () => {
  error.value = ''
  loading.value = true

  try {
    const { data, error: authError } = await supabase.auth.signInWithPassword({
      email: email.value,
      password: password.value
    })

    if (authError) {
      if (authError.message.includes('Invalid login credentials')) {
        error.value = 'Email atau password salah. Silakan coba lagi.'
      } else {
        error.value = authError.message
      }
      return
    }

    router.push('/admin')
  } catch (err) {
    error.value = 'Terjadi kesalahan. Silakan coba lagi.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-black flex items-center justify-center px-4 relative overflow-hidden">
    <!-- Background effects -->
    <div class="absolute inset-0">
      <div class="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[150px] pointer-events-none"></div>
      <div class="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none"></div>
      <div class="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] pointer-events-none"></div>
    </div>

    <div class="w-full max-w-md relative z-10">
      <!-- Logo & Header -->
      <div class="text-center mb-10">
        <router-link to="/" class="inline-flex items-center gap-2 mb-8 group">
          <img src="/img/logo.png" alt="NovaTix Logo" class="h-8 w-auto" />
          <span class="text-xl font-bold text-white tracking-tight">NovaTix<span class="text-indigo-400">.ID</span></span>
        </router-link>
        <h1 class="text-3xl md:text-4xl font-bold text-white mb-3 tracking-tight">
          Selamat Datang
        </h1>
        <p class="text-gray-400 text-base">
          Masuk ke panel admin untuk mengelola portfolio
        </p>
      </div>

      <!-- Login Card -->
      <div class="bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] rounded-3xl p-8 shadow-2xl shadow-black/50">
        
        <!-- Error Alert -->
        <Transition
          enter-active-class="transition duration-300 ease-out"
          enter-from-class="transform -translate-y-2 opacity-0"
          enter-to-class="transform translate-y-0 opacity-100"
          leave-active-class="transition duration-200 ease-in"
          leave-from-class="opacity-100"
          leave-to-class="opacity-0"
        >
          <div v-if="error" class="mb-6 flex items-start gap-3 p-4 rounded-2xl bg-red-500/10 border border-red-500/20">
            <Icon icon="ph:warning-circle-fill" class="text-red-400 text-xl mt-0.5 flex-shrink-0" />
            <p class="text-red-300 text-sm">{{ error }}</p>
          </div>
        </Transition>

        <form @submit.prevent="handleLogin" class="space-y-5">
          <!-- Email -->
          <div>
            <label for="email" class="block text-sm font-medium text-gray-300 mb-2">
              Email
            </label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Icon icon="ph:envelope" class="text-gray-500 text-lg" />
              </div>
              <input
                id="email"
                v-model="email"
                type="email"
                required
                placeholder="admin@novatix.id"
                class="w-full pl-12 pr-4 py-3.5 bg-white/[0.04] border border-white/[0.08] rounded-xl text-white placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all duration-300"
              />
            </div>
          </div>

          <!-- Password -->
          <div>
            <label for="password" class="block text-sm font-medium text-gray-300 mb-2">
              Password
            </label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Icon icon="ph:lock" class="text-gray-500 text-lg" />
              </div>
              <input
                id="password"
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                required
                placeholder="••••••••"
                class="w-full pl-12 pr-12 py-3.5 bg-white/[0.04] border border-white/[0.08] rounded-xl text-white placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all duration-300"
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-500 hover:text-gray-300 transition-colors"
              >
                <Icon :icon="showPassword ? 'ph:eye-slash' : 'ph:eye'" class="text-lg" />
              </button>
            </div>
          </div>

          <!-- Submit Button -->
          <button
            type="submit"
            :disabled="loading"
            class="w-full py-3.5 rounded-xl font-bold text-sm text-white transition-all duration-300 flex items-center justify-center gap-2 mt-2"
            :class="loading 
              ? 'bg-indigo-500/50 cursor-not-allowed' 
              : 'bg-indigo-500 hover:bg-indigo-400 shadow-lg shadow-indigo-500/25 hover:shadow-indigo-400/30 hover:scale-[1.02] active:scale-[0.98]'"
          >
            <Icon v-if="loading" icon="ph:spinner" class="text-lg animate-spin" />
            <Icon v-else icon="ph:sign-in-bold" class="text-lg" />
            <span>{{ loading ? 'Memproses...' : 'Masuk' }}</span>
          </button>
        </form>
      </div>

      <!-- Back to Home -->
      <div class="text-center mt-6">
        <router-link 
          to="/" 
          class="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-300 transition-colors duration-300"
        >
          <Icon icon="ph:arrow-left" class="text-base" />
          <span>Kembali ke Beranda</span>
        </router-link>
      </div>
    </div>
  </div>
</template>
