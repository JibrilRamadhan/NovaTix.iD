<script setup>
import { ref, onMounted, computed } from 'vue'
import { supabase } from '../lib/supabase'
import { Icon } from '@iconify/vue'

// State
const pricingPlans = ref([])
const loading = ref(true)
const showModal = ref(false)
const editingId = ref(null)
const deleteConfirm = ref(null)
const searchQuery = ref('')
const toast = ref({ show: false, message: '', type: 'success' })

// Form state
const form = ref({
  title: '',
  price: '',
  period: '/project',
  description: '',
  features: [],
  is_popular: false,
  is_visible: true,
  display_order: 0
})
const newFeature = ref('')
const formLoading = ref(false)

// Computed
const filteredPlans = computed(() => {
  if (!searchQuery.value) return pricingPlans.value
  const q = searchQuery.value.toLowerCase()
  return pricingPlans.value.filter(p => 
    p.title.toLowerCase().includes(q) || 
    p.description.toLowerCase().includes(q)
  )
})

// Methods
const showToast = (message, type = 'success') => {
  toast.value = { show: true, message, type }
  setTimeout(() => { toast.value.show = false }, 3000)
}

const fetchPricing = async () => {
  loading.value = true
  try {
    const { data, error } = await supabase
      .from('pricing_packages')
      .select('*')
      .order('display_order', { ascending: true })
      .order('created_at', { ascending: true })

    if (error) throw error
    pricingPlans.value = data || []
  } catch (e) {
    showToast('Gagal memuat data pricing', 'error')
    console.error(e)
  } finally {
    loading.value = false
  }
}

const resetForm = () => {
  form.value = {
    title: '',
    price: '',
    period: '/project',
    description: '',
    features: [],
    is_popular: false,
    is_visible: true,
    display_order: 0
  }
  newFeature.value = ''
  editingId.value = null
}

const openAddModal = () => {
  resetForm()
  showModal.value = true
}

const openEditModal = (plan) => {
  editingId.value = plan.id
  form.value = {
    title: plan.title,
    price: plan.price,
    period: plan.period || '/project',
    description: plan.description || '',
    features: plan.features ? [...plan.features] : [],
    is_popular: plan.is_popular || false,
    is_visible: plan.is_visible !== false,
    display_order: plan.display_order || 0
  }
  newFeature.value = ''
  showModal.value = true
}

// Feature management
const addFeature = () => {
  if (newFeature.value.trim()) {
    form.value.features.push(newFeature.value.trim())
    newFeature.value = ''
  }
}

const removeFeature = (index) => {
  form.value.features.splice(index, 1)
}

const handleSubmit = async () => {
  if (!form.value.title.trim() || !form.value.price.trim()) {
    showToast('Judul dan harga wajib diisi', 'error')
    return
  }

  formLoading.value = true

  try {
    const payload = {
      title: form.value.title.trim(),
      price: form.value.price.trim(),
      period: form.value.period.trim(),
      description: form.value.description.trim(),
      features: form.value.features,
      is_popular: form.value.is_popular,
      is_visible: form.value.is_visible,
      display_order: form.value.display_order
    }

    if (editingId.value) {
      const { error } = await supabase
        .from('pricing_packages')
        .update(payload)
        .eq('id', editingId.value)
      if (error) throw error
      showToast('Paket berhasil diperbarui')
    } else {
      const { error } = await supabase
        .from('pricing_packages')
        .insert(payload)
      if (error) throw error
      showToast('Paket berhasil ditambahkan')
    }

    showModal.value = false
    fetchPricing()
  } catch (e) {
    showToast('Gagal menyimpan data', 'error')
    console.error(e)
  } finally {
    formLoading.value = false
  }
}

const toggleVisible = async (plan) => {
  try {
    const { error } = await supabase
      .from('pricing_packages')
      .update({ is_visible: !plan.is_visible })
      .eq('id', plan.id)
    
    if (error) throw error
    plan.is_visible = !plan.is_visible
    showToast(plan.is_visible ? 'Paket ditampilkan' : 'Paket disembunyikan')
  } catch (e) {
    showToast('Gagal update status', 'error')
  }
}

const togglePopular = async (plan) => {
  try {
    const { error } = await supabase
      .from('pricing_packages')
      .update({ is_popular: !plan.is_popular })
      .eq('id', plan.id)
    
    if (error) throw error
    plan.is_popular = !plan.is_popular
    showToast('Status popular diupdate')
  } catch (e) {
    showToast('Gagal update status', 'error')
  }
}

const handleDelete = async (id) => {
  try {
    const { error } = await supabase
      .from('pricing_packages')
      .delete()
      .eq('id', id)
    
    if (error) throw error
    
    pricingPlans.value = pricingPlans.value.filter(p => p.id !== id)
    showToast('Paket berhasil dihapus')
    deleteConfirm.value = null
  } catch (e) {
    showToast('Gagal menghapus paket', 'error')
  }
}

const updateDisplayOrder = async (plan, newOrder) => {
    // Basic implementation - relies on manual input or fetch re-sort
    // Ideally drag-and-drop or simple up/down
    // For now, let's keep it simple in form
}

onMounted(() => {
  fetchPricing()
})
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-white mb-1">Kelola Pricing</h1>
        <p class="text-gray-400 text-sm">Atur paket harga jasa pembuatan website</p>
      </div>
      <button 
        @click="openAddModal"
        class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-500 text-white text-sm font-bold hover:bg-indigo-400 shadow-lg shadow-indigo-500/25 transition-all duration-300"
      >
        <Icon icon="ph:plus-bold" />
        Tambah Paket
      </button>
    </div>

    <!-- Search & Filter -->
    <div class="flex items-center gap-4 bg-white/[0.02] border border-white/[0.06] p-4 rounded-2xl">
      <div class="relative flex-1">
        <Icon icon="ph:magnifying-glass" class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
        <input 
          v-model="searchQuery"
          type="text" 
          placeholder="Cari paket..." 
          class="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-indigo-500/50 transition-all"
        >
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center py-20">
      <Icon icon="ph:spinner" class="text-4xl text-indigo-500 animate-spin" />
    </div>

    <!-- Empty State -->
    <div v-else-if="filteredPlans.length === 0" class="text-center py-20 border border-dashed border-white/10 rounded-3xl">
      <div class="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
        <Icon icon="ph:package" class="text-3xl text-gray-600" />
      </div>
      <h3 class="text-lg font-bold text-white mb-1">Belum ada paket</h3>
      <p class="text-gray-500 text-sm mb-6">
        Mulai dengan menambahkan paket harga pertama Anda
      </p>
      <button
        v-if="!searchQuery"
        @click="openAddModal"
        class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-500 text-white text-sm font-bold hover:bg-indigo-400 shadow-lg shadow-indigo-500/25 transition-all duration-300"
      >
        <Icon icon="ph:plus-bold" />
        Tambah Paket Pertama
      </button>
    </div>

    <!-- Pricing List -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="plan in filteredPlans"
        :key="plan.id"
        class="bg-white/[0.02] border rounded-2xl p-6 transition-all duration-300 group flex flex-col"
        :class="[
          plan.is_popular 
            ? 'border-indigo-500/30 bg-indigo-500/5' 
            : 'border-white/[0.06] hover:bg-white/[0.04] hover:border-white/[0.1]',
          plan.is_visible ? '' : 'opacity-60 grayscale'
        ]"
      >
        <div class="flex justify-between items-start mb-4">
            <div>
                <h3 class="text-lg font-bold text-white mb-1">{{ plan.title }}</h3>
                <div class="text-2xl font-bold text-indigo-400 font-shlomo-stam">
                    {{ plan.price }}<span class="text-sm font-normal text-gray-500 ml-1">{{ plan.period }}</span>
                </div>
            </div>
            <div class="flex gap-1">
                <button
                    @click="togglePopular(plan)"
                    class="p-1.5 rounded-lg transition-colors border"
                    :class="plan.is_popular ? 'bg-amber-500/20 text-amber-500 border-amber-500/30' : 'text-gray-600 border-transparent hover:bg-white/5 hover:text-amber-500'"
                    title="Toggle Popular"
                >
                    <Icon :icon="plan.is_popular ? 'ph:star-fill' : 'ph:star'" />
                </button>
                <button
                    @click="toggleVisible(plan)"
                    class="p-1.5 rounded-lg transition-colors border"
                    :class="plan.is_visible ? 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30' : 'text-gray-600 border-transparent hover:bg-white/5 hover:text-white'"
                    title="Toggle Visibility"
                >
                    <Icon :icon="plan.is_visible ? 'ph:eye' : 'ph:eye-slash'" />
                </button>
            </div>
        </div>

        <p class="text-gray-400 text-sm mb-6 line-clamp-2 h-10">{{ plan.description }}</p>
        
        <ul class="space-y-2 mb-6 flex-1">
            <li v-for="feature in (plan.features || []).slice(0, 4)" :key="feature" class="flex gap-2 text-sm text-gray-300">
                <Icon icon="ph:check-circle-fill" class="text-green-500 mt-0.5 shrink-0" />
                <span class="truncate">{{ feature }}</span>
            </li>
            <li v-if="(plan.features || []).length > 4" class="text-xs text-gray-500 pl-6">
                + {{ (plan.features || []).length - 4 }} fitur lainnya
            </li>
        </ul>

        <div class="flex gap-2 mt-auto pt-4 border-t border-white/5">
            <button 
                @click="openEditModal(plan)"
                class="flex-1 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white text-sm font-bold transition-colors"
            >
                Edit
            </button>
            <button 
                @click="deleteConfirm = plan.id"
                class="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors"
            >
                <Icon icon="ph:trash-bold" />
            </button>
        </div>
      </div>
    </div>

    <!-- Add/Edit Modal -->
    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div v-if="showModal" class="fixed inset-0 z-[90] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" @click.self="showModal = false">
        <div class="bg-[#0a0a0a] border border-white/[0.08] rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl relative">
            <button 
                @click="showModal = false"
                class="absolute top-4 right-4 p-2 rounded-xl text-gray-500 hover:text-white hover:bg-white/5 transition-all duration-300"
            >
                <Icon icon="ph:x-bold" class="text-lg" />
            </button>
            
            <div class="p-6 md:p-8">
                <h2 class="text-xl font-bold text-white mb-6">
                    {{ editingId ? 'Edit Paket' : 'Tambah Paket Baru' }}
                </h2>

                <form @submit.prevent="handleSubmit" class="space-y-5">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <!-- Title -->
                        <div>
                            <label class="block text-sm font-medium text-gray-300 mb-2">Nama Paket</label>
                            <input v-model="form.title" type="text" required class="w-full px-4 py-3 bg-white/[0.04] border border-white/[0.08] rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500/50" placeholder="e.g. Basic Starter" />
                        </div>
                        <!-- Order -->
                        <div>
                            <label class="block text-sm font-medium text-gray-300 mb-2">Urutan Tampil</label>
                            <input v-model="form.display_order" type="number" class="w-full px-4 py-3 bg-white/[0.04] border border-white/[0.08] rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500/50" />
                        </div>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <!-- Price -->
                        <div>
                            <label class="block text-sm font-medium text-gray-300 mb-2">Harga</label>
                            <input v-model="form.price" type="text" required class="w-full px-4 py-3 bg-white/[0.04] border border-white/[0.08] rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500/50" placeholder="e.g. Rp 500rb" />
                        </div>
                        <!-- Period -->
                        <div>
                            <label class="block text-sm font-medium text-gray-300 mb-2">Periode</label>
                            <input v-model="form.period" type="text" class="w-full px-4 py-3 bg-white/[0.04] border border-white/[0.08] rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500/50" placeholder="e.g. /project" />
                        </div>
                    </div>

                    <!-- Description -->
                    <div>
                        <label class="block text-sm font-medium text-gray-300 mb-2">Deskripsi</label>
                        <textarea v-model="form.description" rows="2" class="w-full px-4 py-3 bg-white/[0.04] border border-white/[0.08] rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500/50" placeholder="Deskripsi singkat..."></textarea>
                    </div>

                    <!-- Features -->
                    <div>
                        <label class="block text-sm font-medium text-gray-300 mb-2">Fitur</label>
                        <div class="flex gap-2 mb-3">
                            <input 
                                v-model="newFeature" 
                                @keydown.enter.prevent="addFeature"
                                type="text" 
                                class="flex-1 px-4 py-2 bg-white/[0.04] border border-white/[0.08] rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500/50" 
                                placeholder="Tambah fitur (tekan Enter)" 
                            />
                            <button @click.prevent="addFeature" class="px-4 py-2 bg-indigo-500 rounded-xl text-white hover:bg-indigo-400 font-bold">
                                <Icon icon="ph:plus-bold" />
                            </button>
                        </div>
                        <ul class="space-y-2 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
                            <li v-for="(feat, idx) in form.features" :key="idx" class="flex justify-between items-center bg-white/5 px-3 py-2 rounded-lg text-sm text-gray-300">
                                <span>{{ feat }}</span>
                                <button @click="removeFeature(idx)" class="text-gray-500 hover:text-red-400">
                                    <Icon icon="ph:x" />
                                </button>
                            </li>
                        </ul>
                    </div>

                    <!-- Toggles -->
                    <div class="flex gap-6 pt-2">
                        <label class="flex items-center gap-3 cursor-pointer group">
                            <div class="w-12 h-6 rounded-full bg-white/10 relative transition p-1" :class="{ 'bg-amber-500/20': form.is_popular }">
                                <div class="w-4 h-4 rounded-full bg-gray-400 transition-all translate-x-0" :class="{ 'translate-x-6 bg-amber-500': form.is_popular }"></div>
                                <input type="checkbox" v-model="form.is_popular" class="hidden">
                            </div>
                            <span class="text-sm font-medium text-gray-300 group-hover:text-white transition">Popular Bundle</span>
                        </label>

                        <label class="flex items-center gap-3 cursor-pointer group">
                            <div class="w-12 h-6 rounded-full bg-white/10 relative transition p-1" :class="{ 'bg-indigo-500/20': form.is_visible }">
                                <div class="w-4 h-4 rounded-full bg-gray-400 transition-all translate-x-0" :class="{ 'translate-x-6 bg-indigo-500': form.is_visible }"></div>
                                <input type="checkbox" v-model="form.is_visible" class="hidden">
                            </div>
                            <span class="text-sm font-medium text-gray-300 group-hover:text-white transition">Aktif / Visible</span>
                        </label>
                    </div>

                    <button
                        type="submit"
                        :disabled="formLoading"
                        class="w-full py-4 rounded-xl font-bold text-white transition-all duration-300 flex items-center justify-center gap-2 mt-4"
                        :class="formLoading 
                        ? 'bg-indigo-500/50 cursor-not-allowed' 
                        : 'bg-indigo-500 hover:bg-indigo-400 shadow-lg shadow-indigo-500/25 hover:shadow-indigo-400/30'"
                    >
                        <Icon v-if="formLoading" icon="ph:spinner" class="text-lg animate-spin" />
                        <span v-else>{{ editingId ? 'Simpan Perubahan' : 'Buat Paket' }}</span>
                    </button>
                </form>
            </div>
        </div>
      </div>
    </Transition>

    <!-- Delete Confirmation Modal -->
    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div v-if="deleteConfirm" class="fixed inset-0 z-[90] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
        <div class="bg-[#0a0a0a] border border-white/[0.08] rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl">
          <div class="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon icon="ph:warning-circle-bold" class="text-3xl text-red-500" />
          </div>
          <h3 class="text-xl font-bold text-white mb-2">Hapus Paket?</h3>
          <p class="text-gray-400 text-sm mb-6">
            Tindakan ini tidak dapat dibatalkan. Paket akan hilang dari website.
          </p>
          <div class="flex gap-3">
            <button 
              @click="deleteConfirm = null"
              class="flex-1 py-2.5 rounded-xl text-sm font-bold bg-white/[0.04] text-gray-300 hover:text-white hover:bg-white/[0.08] transition-all"
            >
              Batal
            </button>
            <button 
              @click="handleDelete(deleteConfirm)"
              class="flex-1 py-2.5 rounded-xl text-sm font-bold bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/20 transition-all"
            >
              Ya, Hapus
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Toast Notification -->
    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="transform translate-y-4 opacity-0"
      enter-to-class="transform translate-y-0 opacity-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="transform translate-y-0 opacity-100"
      leave-to-class="transform translate-y-4 opacity-0"
    >
      <div v-if="toast.show" class="fixed bottom-6 right-6 z-[100] flex items-center gap-3 px-5 py-4 rounded-xl shadow-2xl border backdrop-blur-md"
        :class="toast.type === 'success' ? 'bg-green-500/10 border-green-500/20 text-green-300' : 'bg-red-500/10 border-red-500/20 text-red-300'"
      >
        <Icon :icon="toast.type === 'success' ? 'ph:check-circle-fill' : 'ph:x-circle-fill'" class="text-xl" />
        <p class="text-sm font-medium">{{ toast.message }}</p>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.02);
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
}
</style>
