<script setup>
import { ref, onMounted, computed } from 'vue'
import { supabase } from '../lib/supabase'
import { Icon } from '@iconify/vue'

// State
const testimonials = ref([])
const portfolios = ref([]) // New: Store portfolios for dropdown
const loading = ref(true)
const showModal = ref(false)
const editingId = ref(null)
const deleteConfirm = ref(null)
const searchQuery = ref('')
const toast = ref({ show: false, message: '', type: 'success' })

// Form state
const form = ref({
  name: '',
  role: '',
  content: '',
  image_url: '',
  rating: 5,
  is_visible: true
})
const formLoading = ref(false)
const imageFile = ref(null)
const imageUploading = ref(false)
const imageDragOver = ref(false)

// Computed
const filteredTestimonials = computed(() => {
  if (!searchQuery.value) return testimonials.value
  const q = searchQuery.value.toLowerCase()
  return testimonials.value.filter(t => 
    t.name.toLowerCase().includes(q) || 
    t.role.toLowerCase().includes(q) ||
    t.content.toLowerCase().includes(q)
  )
})

// Methods
const showToast = (message, type = 'success') => {
  toast.value = { show: true, message, type }
  setTimeout(() => { toast.value.show = false }, 3000)
}

const fetchTestimonials = async () => {
  loading.value = true
  try {
    const { data, error } = await supabase
      .from('testimonials')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    testimonials.value = data || []
    
    // Fetch portfolios for dropdown
    const { data: portfolioData } = await supabase
      .from('portfolios')
      .select('id, title')
      .order('created_at', { ascending: false })
      
    portfolios.value = portfolioData || []
  } catch (e) {
    showToast('Gagal memuat testimoni', 'error')
    console.error(e)
  } finally {
    loading.value = false
  }
}

const resetForm = () => {
  form.value = {
    name: '',
    role: '',
    content: '',
    image_url: '',
    rating: 5,
    is_visible: true,
    portfolio_id: null
  }
  editingId.value = null
  imageFile.value = null
}

const openAddModal = () => {
  resetForm()
  showModal.value = true
}

const openEditModal = (testimonial) => {
  editingId.value = testimonial.id
  form.value = {
    name: testimonial.name,
    role: testimonial.role || '',
    content: testimonial.content,
    image_url: testimonial.image_url || '',
    rating: testimonial.rating || 5,
    is_visible: testimonial.is_visible !== false,
    portfolio_id: testimonial.portfolio_id || null
  }
  imageFile.value = null
  showModal.value = true
}

// Image upload
const handleFileSelect = (event) => {
  const file = event.target.files?.[0]
  if (file) processFile(file)
}

const handleDrop = (event) => {
  event.preventDefault()
  imageDragOver.value = false
  const file = event.dataTransfer.files?.[0]
  if (file && file.type.startsWith('image/')) processFile(file)
}

const processFile = (file) => {
  if (file.size > 2 * 1024 * 1024) { // Max 2MB for avatars
    showToast('Ukuran file maksimal 2MB', 'error')
    return
  }
  imageFile.value = file
  // Show local preview
  const reader = new FileReader()
  reader.onload = (e) => {
    form.value.image_url = e.target.result
  }
  reader.readAsDataURL(file)
}

const uploadImage = async (file) => {
  const ext = file.name.split('.').pop()
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${ext}`
  
  // Using 'portfolios' bucket for simplicity, or create new 'testimonials' bucket
  // Ideally 'testimonials' bucket, but let's stick to 'portfolios/testimonials/' path if possible
  // Or just 'portfolios' bucket since user already has it set up
  const { data, error } = await supabase.storage
    .from('portfolios') 
    .upload(`testimonials/${fileName}`, file, {
      cacheControl: '3600',
      upsert: false
    })

  if (error) throw error

  const { data: urlData } = supabase.storage
    .from('portfolios')
    .getPublicUrl(`testimonials/${fileName}`)

  return urlData.publicUrl
}

const removeImage = () => {
  imageFile.value = null
  form.value.image_url = ''
}

const handleSubmit = async () => {
  if (!form.value.name.trim() || !form.value.content.trim()) {
    showToast('Nama dan isi testimoni wajib diisi', 'error')
    return
  }

  formLoading.value = true

  try {
    let imageUrl = form.value.image_url

    // Upload image if file selected
    if (imageFile.value) {
      imageUploading.value = true
      imageUrl = await uploadImage(imageFile.value)
      imageUploading.value = false
    }

    // If image_url is a data URL (local preview), clear it if upload failed or wasn't needed
    if (imageUrl && imageUrl.startsWith('data:')) {
      imageUrl = ''
    }

    const payload = {
      name: form.value.name.trim(),
      role: form.value.role.trim(),
      content: form.value.content.trim(),
      image_url: imageUrl || null,
      rating: form.value.rating,
      is_visible: form.value.is_visible,
      portfolio_id: form.value.portfolio_id || null
    }

    if (editingId.value) {
      const { error } = await supabase
        .from('testimonials')
        .update(payload)
        .eq('id', editingId.value)
      if (error) throw error
      showToast('Testimoni berhasil diperbarui')
    } else {
      const { error } = await supabase
        .from('testimonials')
        .insert(payload)
      if (error) throw error
      showToast('Testimoni berhasil ditambahkan')
    }

    showModal.value = false
    resetForm()
    await fetchTestimonials()
  } catch (e) {
    showToast('Gagal menyimpan: ' + e.message, 'error')
    console.error(e)
  } finally {
    formLoading.value = false
    imageUploading.value = false
  }
}

const toggleVisible = async (testimonial) => {
  try {
    const newVisible = !testimonial.is_visible
    const { error } = await supabase
      .from('testimonials')
      .update({ is_visible: newVisible })
      .eq('id', testimonial.id)
    if (error) throw error
    testimonial.is_visible = newVisible
    showToast(newVisible ? 'Testimoni ditampilkan' : 'Testimoni disembunyikan')
  } catch (e) {
    showToast('Gagal mengubah status', 'error')
  }
}

const handleDelete = async (id) => {
  try {
    const testimonial = testimonials.value.find(t => t.id === id)
    
    const { error } = await supabase
      .from('testimonials')
      .delete()
      .eq('id', id)
    if (error) throw error

    // Try to delete image
    if (testimonial?.image_url && testimonial.image_url.includes('testimonials/')) {
       try {
        const urlParts = testimonial.image_url.split('/portfolios/') 
        if (urlParts[1]) {
           await supabase.storage.from('portfolios').remove([urlParts[1]])
        }
       } catch(e) {}
    }

    showToast('Testimoni berhasil dihapus')
    deleteConfirm.value = null
    await fetchTestimonials()
  } catch (e) {
    showToast('Gagal menghapus testimoni', 'error')
    console.error(e)
  }
}

onMounted(fetchTestimonials)
</script>

<template>
  <div class="max-w-6xl mx-auto">
    <!-- Toast Notification -->
    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="transform translate-y-4 opacity-0"
      enter-to-class="transform translate-y-0 opacity-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div 
        v-if="toast.show" 
        class="fixed top-6 right-6 z-[100] flex items-center gap-3 px-5 py-3.5 rounded-xl border shadow-2xl backdrop-blur-xl"
        :class="toast.type === 'success' 
          ? 'bg-green-500/15 border-green-500/30 text-green-300' 
          : 'bg-red-500/15 border-red-500/30 text-red-300'"
      >
        <Icon 
          :icon="toast.type === 'success' ? 'ph:check-circle-fill' : 'ph:x-circle-fill'" 
          class="text-xl flex-shrink-0" 
        />
        <span class="text-sm font-medium">{{ toast.message }}</span>
      </div>
    </Transition>

    <!-- Header -->
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
      <div>
        <h1 class="text-2xl md:text-3xl font-bold text-white tracking-tight">
          Kelola Testimoni
        </h1>
        <p class="text-gray-500 text-sm mt-1">
          Atur ulasan klien yang tampil di website
        </p>
      </div>
      <button
        @click="openAddModal"
        class="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-500 text-white text-sm font-bold hover:bg-indigo-400 shadow-lg shadow-indigo-500/25 hover:shadow-indigo-400/30 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
      >
        <Icon icon="ph:plus-bold" class="text-base" />
        Tambah Testimoni
      </button>
    </div>

    <!-- Search -->
    <div class="relative mb-6">
      <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
        <Icon icon="ph:magnifying-glass" class="text-gray-500 text-lg" />
      </div>
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Cari testimoni..."
        class="w-full pl-12 pr-4 py-3 bg-white/[0.03] border border-white/[0.06] rounded-xl text-white placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all duration-300"
      />
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div v-for="i in 4" :key="i" class="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6 animate-pulse">
        <div class="flex items-center gap-4 mb-4">
          <div class="w-12 h-12 bg-white/5 rounded-full"></div>
          <div class="flex-1 space-y-2">
            <div class="h-4 bg-white/5 rounded w-1/3"></div>
            <div class="h-3 bg-white/5 rounded w-1/4"></div>
          </div>
        </div>
        <div class="h-3 bg-white/5 rounded w-full mb-2"></div>
        <div class="h-3 bg-white/5 rounded w-2/3"></div>
      </div>
    </div>

    <!-- Empty State -->
    <div 
      v-else-if="filteredTestimonials.length === 0" 
      class="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-12 text-center"
    >
      <div class="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-4">
        <Icon icon="ph:quotes-fill" class="text-gray-500 text-3xl" />
      </div>
      <h3 class="text-lg font-bold text-white mb-2">
        {{ searchQuery ? 'Tidak ditemukan' : 'Belum ada testimoni' }}
      </h3>
      <p class="text-gray-500 text-sm mb-6">
        {{ searchQuery ? 'Coba kata kunci lain.' : 'Tambahkan ulasan klien pertama Anda.' }}
      </p>
      <button
        v-if="!searchQuery"
        @click="openAddModal"
        class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-500 text-white text-sm font-bold hover:bg-indigo-400 shadow-lg shadow-indigo-500/25 transition-all duration-300"
      >
        <Icon icon="ph:plus-bold" />
        Tambah Testimoni
      </button>
    </div>

    <!-- Testimonial List -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div
        v-for="item in filteredTestimonials"
        :key="item.id"
        class="bg-white/[0.02] border rounded-2xl p-6 transition-all duration-300 group flex flex-col"
        :class="[
          item.is_visible 
            ? 'border-white/[0.06] hover:bg-white/[0.04] hover:border-white/[0.1]' 
            : 'border-white/[0.03] opacity-50'
        ]"
      >
        <div class="flex items-start justify-between mb-4">
          <div class="flex items-center gap-3">
            <!-- Avatar -->
            <div class="w-12 h-12 rounded-full bg-white/10 overflow-hidden flex-shrink-0 border border-white/10">
              <img 
                v-if="item.image_url" 
                :src="item.image_url" 
                :alt="item.name"
                class="w-full h-full object-cover"
              />
              <div v-else class="w-full h-full flex items-center justify-center bg-indigo-500 text-white font-bold text-lg">
                {{ item.name.charAt(0) }}
              </div>
            </div>
            <div>
              <h3 class="text-base font-bold text-white group-hover:text-indigo-300 transition-colors">
                {{ item.name }}
              </h3>
              <p class="text-xs text-gray-500">{{ item.role || 'Client' }}</p>
            </div>
          </div>
          
          <div class="flex items-center gap-1 bg-amber-500/10 px-2 py-1 rounded-lg border border-amber-500/20">
            <Icon icon="ph:star-fill" class="text-amber-400 text-xs" />
            <span class="text-xs font-bold text-amber-400">{{ item.rating }}</span>
          </div>
        </div>

        <div class="mb-6 flex-grow">
            <Icon icon="ph:quotes-fill" class="text-indigo-500/20 text-2xl mb-2" />
            <p class="text-gray-400 text-sm italic leading-relaxed line-clamp-3">
                "{{ item.content }}"
            </p>
        </div>

        <!-- Actions -->
        <div class="flex items-center justify-between pt-4 border-t border-white/[0.06]">
            <span v-if="!item.is_visible" class="text-[10px] font-bold text-gray-500 uppercase flex items-center gap-1">
                <Icon icon="ph:eye-slash-fill" /> Hidden
            </span>
            <span v-else class="text-[10px] font-bold text-green-400 uppercase flex items-center gap-1">
                <Icon icon="ph:eye-fill" /> Visible
            </span>

            <div class="flex items-center gap-1">
                <button
                  @click="toggleVisible(item)"
                  class="p-2 rounded-lg transition-all duration-300"
                  :class="item.is_visible 
                    ? 'text-green-400 bg-green-500/10 hover:bg-green-500/20' 
                    : 'text-gray-600 hover:text-green-400 hover:bg-green-500/10'"
                  :title="item.is_visible ? 'Sembunyikan' : 'Tampilkan'"
                >
                  <Icon :icon="item.is_visible ? 'ph:eye-bold' : 'ph:eye-slash-bold'" class="text-base" />
                </button>
                <button
                  @click="openEditModal(item)"
                  class="p-2 rounded-lg text-gray-500 hover:text-indigo-400 hover:bg-indigo-500/10 transition-all duration-300"
                  title="Edit"
                >
                  <Icon icon="ph:pencil-simple-bold" class="text-base" />
                </button>
                <button
                  @click="deleteConfirm = item.id"
                  class="p-2 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-all duration-300"
                  title="Hapus"
                >
                  <Icon icon="ph:trash-bold" class="text-base" />
                </button>
            </div>
        </div>

        <!-- Delete Confirmation -->
         <Transition
          enter-active-class="transition duration-200 ease-out"
          enter-from-class="transform -translate-y-2 opacity-0"
          enter-to-class="transform translate-y-0 opacity-100"
          leave-active-class="transition duration-150 ease-in"
          leave-from-class="opacity-100"
          leave-to-class="opacity-0"
        >
          <div v-if="deleteConfirm === item.id" class="mt-4 p-4 rounded-xl bg-red-500/10 border border-red-500/20">
            <p class="text-sm text-red-300 mb-3 text-center">
              Hapus testimoni ini?
            </p>
            <div class="flex items-center justify-center gap-2">
              <button
                @click="handleDelete(item.id)"
                class="px-3 py-1.5 rounded-lg bg-red-500 text-white text-xs font-bold hover:bg-red-400 transition-all duration-300"
              >
                Hapus
              </button>
              <button
                @click="deleteConfirm = null"
                class="px-3 py-1.5 rounded-lg bg-white/5 text-gray-400 text-xs font-bold hover:bg-white/10 border border-white/[0.06] transition-all duration-300"
              >
                Batal
              </button>
            </div>
          </div>
        </Transition>

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
        <div class="bg-[#0a0a0a] border border-white/[0.08] rounded-3xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl relative">
            <button 
                @click="showModal = false"
                class="absolute top-4 right-4 p-2 rounded-xl text-gray-500 hover:text-white hover:bg-white/5 transition-all duration-300 z-10"
            >
                <Icon icon="ph:x-bold" class="text-lg" />
            </button>
            
            <div class="p-6 md:p-8">
                <h2 class="text-xl font-bold text-white mb-6">
                    {{ editingId ? 'Edit Testimoni' : 'Tambah Testimoni' }}
                </h2>

                <form @submit.prevent="handleSubmit" class="space-y-5">
                    <!-- Photo Upload -->
                    <div class="flex items-center gap-6">
                        <div 
                             class="w-20 h-20 rounded-full bg-white/[0.03] border border-white/[0.08] overflow-hidden flex-shrink-0 relative group cursor-pointer"
                             @click="$refs.fileInput.click()"
                        >
                            <img 
                                v-if="form.image_url" 
                                :src="form.image_url" 
                                class="w-full h-full object-cover" 
                            />
                            <div v-else class="w-full h-full flex items-center justify-center text-gray-500">
                                <Icon icon="ph:camera-plus" class="text-2xl" />
                            </div>
                            <div class="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <span class="text-[10px] font-bold text-white text-center px-1">Ganti Foto</span>
                            </div>
                        </div>
                        <input ref="fileInput" type="file" accept="image/*" class="hidden" @change="handleFileSelect" />
                        
                        <div class="flex-1">
                            <label class="block text-sm font-medium text-gray-300 mb-2">Nama Klien <span class="text-red-400">*</span></label>
                            <input v-model="form.name" type="text" required class="w-full px-4 py-3 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50" placeholder="Nama Lengkap" />
                        </div>
                    </div>

                    <!-- Role -->
                    <div>
                        <label class="block text-sm font-medium text-gray-300 mb-2">Role / Jabatan</label>
                        <input v-model="form.role" type="text" class="w-full px-4 py-3 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50" placeholder="e.g. CEO at StartUp" />
                    </div>

                    <!-- Rating -->
                    <div>
                        <label class="block text-sm font-medium text-gray-300 mb-2">Rating</label>
                        <div class="flex gap-2">
                             <button 
                                v-for="r in 5" 
                                :key="r"
                                type="button"
                                @click="form.rating = r"
                                class="p-2 rounded-lg transition-colors border"
                                :class="form.rating >= r ? 'bg-amber-500/10 border-amber-500/30 text-amber-400' : 'bg-white/[0.02] border-white/[0.06] text-gray-600'"
                             >
                                <Icon :icon="form.rating >= r ? 'ph:star-fill' : 'ph:star'" class="text-xl" />
                             </button>
                        </div>
                    </div>

                    <!-- Portfolio Link (Optional) -->
                    <div>
                        <label class="block text-sm font-medium text-gray-300 mb-2">Tautkan ke Portfolio (Opsional)</label>
                        <select 
                            v-model="form.portfolio_id"
                            class="w-full px-4 py-3 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 appearance-none"
                        >
                            <option :value="null" class="bg-black text-gray-500">tidak ada --</option>
                            <option v-for="p in portfolios" :key="p.id" :value="p.id" class="bg-black">
                                {{ p.title }}
                            </option>
                        </select>
                    </div>

                    <!-- Content -->
                    <div>
                        <label class="block text-sm font-medium text-gray-300 mb-2">Isi Testimoni <span class="text-red-400">*</span></label>
                        <textarea v-model="form.content" rows="4" required class="w-full px-4 py-3 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 resize-none" placeholder="Tulis pengalaman klien..."></textarea>
                    </div>

                    <!-- Submit -->
                     <button
                        type="submit"
                        :disabled="formLoading || imageUploading"
                        class="w-full py-4 rounded-xl bg-indigo-500 text-white font-bold hover:bg-indigo-400 shadow-lg shadow-indigo-500/25 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        <Icon v-if="formLoading || imageUploading" icon="ph:spinner" class="animate-spin text-xl" />
                        <span v-else>Simpan Testimoni</span>
                      </button>

                </form>
            </div>
        </div>
      </div>
    </Transition>

  </div>
</template>
