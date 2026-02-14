<script setup>
import { ref, onMounted, computed } from 'vue'
import { supabase } from '../lib/supabase'
import { Icon } from '@iconify/vue'

// State
const portfolios = ref([])
const loading = ref(true)
const showModal = ref(false)
const editingId = ref(null)
const deleteConfirm = ref(null)
const searchQuery = ref('')
const toast = ref({ show: false, message: '', type: 'success' })

// Form state
const form = ref({
  title: '',
  description: '',
  image_url: '',
  tech_stack: '',
  live_url: '',
  github_url: '',
  category: 'Web',
  is_featured: false,
  is_visible: true,
  image_position: 'center center'
})
const formLoading = ref(false)
const imageFile = ref(null)
const imageUploading = ref(false)
const imageDragOver = ref(false)
const isPositioning = ref(false)
const positionPreviewRef = ref(null)

const categories = ['Web', 'Mobile', 'UI/UX', 'Backend', 'Full Stack', 'Other']

// Computed
const filteredPortfolios = computed(() => {
  if (!searchQuery.value) return portfolios.value
  const q = searchQuery.value.toLowerCase()
  return portfolios.value.filter(p => 
    p.title.toLowerCase().includes(q) || 
    p.category.toLowerCase().includes(q) ||
    (p.description && p.description.toLowerCase().includes(q))
  )
})

const featuredCount = computed(() => portfolios.value.filter(p => p.is_featured).length)

// Methods
const showToast = (message, type = 'success') => {
  toast.value = { show: true, message, type }
  setTimeout(() => { toast.value.show = false }, 3000)
}

const fetchPortfolios = async () => {
  loading.value = true
  try {
    const { data, error } = await supabase
      .from('portfolios')
      .select('*')
      .order('display_order', { ascending: true })
      .order('created_at', { ascending: false })

    if (error) throw error
    portfolios.value = data || []
  } catch (e) {
    showToast('Gagal memuat data portfolio', 'error')
    console.error(e)
  } finally {
    loading.value = false
  }
}

const resetForm = () => {
  form.value = {
    title: '',
    description: '',
    image_url: '',
    tech_stack: '',
    live_url: '',
    github_url: '',
    category: 'Web',
    is_featured: false,
    is_visible: true,
    image_position: 'center center'
  }
  editingId.value = null
  imageFile.value = null
  isPositioning.value = false
}

const openAddModal = () => {
  resetForm()
  showModal.value = true
}

const openEditModal = (portfolio) => {
  editingId.value = portfolio.id
  form.value = {
    title: portfolio.title,
    description: portfolio.description || '',
    image_url: portfolio.image_url || '',
    tech_stack: (portfolio.tech_stack || []).join(', '),
    live_url: portfolio.live_url || '',
    github_url: portfolio.github_url || '',
    category: portfolio.category || 'Web',
    is_featured: portfolio.is_featured || false,
    is_visible: portfolio.is_visible !== false,
    image_position: portfolio.image_position || 'center center'
  }
  imageFile.value = null
  isPositioning.value = false
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
  if (file.size > 5 * 1024 * 1024) {
    showToast('Ukuran file maksimal 5MB', 'error')
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
  
  const { data, error } = await supabase.storage
    .from('portfolios')
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false
    })

  if (error) throw error

  const { data: urlData } = supabase.storage
    .from('portfolios')
    .getPublicUrl(fileName)

  return urlData.publicUrl
}

const removeImage = () => {
  imageFile.value = null
  form.value.image_url = ''
  form.value.image_position = 'center center'
  isPositioning.value = false
}

// Image position (focal point)
const handlePositionClick = (event) => {
  if (!positionPreviewRef.value) return
  const rect = positionPreviewRef.value.getBoundingClientRect()
  const x = Math.round(((event.clientX - rect.left) / rect.width) * 100)
  const y = Math.round(((event.clientY - rect.top) / rect.height) * 100)
  form.value.image_position = `${Math.max(0, Math.min(100, x))}% ${Math.max(0, Math.min(100, y))}%`
}

const handlePositionMove = (event) => {
  if (event.buttons !== 1) return
  handlePositionClick(event)
}

const handleTouchPosition = (event) => {
  if (!positionPreviewRef.value || !event.touches[0]) return
  event.preventDefault()
  const rect = positionPreviewRef.value.getBoundingClientRect()
  const touch = event.touches[0]
  const x = Math.round(((touch.clientX - rect.left) / rect.width) * 100)
  const y = Math.round(((touch.clientY - rect.top) / rect.height) * 100)
  form.value.image_position = `${Math.max(0, Math.min(100, x))}% ${Math.max(0, Math.min(100, y))}%`
}

const positionToXY = computed(() => {
  const parts = form.value.image_position.split(' ')
  return {
    x: parseInt(parts[0]) || 50,
    y: parseInt(parts[1]) || 50
  }
})

const handleSubmit = async () => {
  if (!form.value.title.trim()) {
    showToast('Judul portfolio wajib diisi', 'error')
    return
  }

  // Check featured limit
  if (form.value.is_featured && !editingId.value && featuredCount.value >= 6) {
    showToast('Maksimal 6 portfolio yang bisa ditampilkan di beranda', 'error')
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

    // If image_url is a data URL (local preview), clear it
    if (imageUrl && imageUrl.startsWith('data:')) {
      imageUrl = ''
    }

    const payload = {
      title: form.value.title.trim(),
      description: form.value.description.trim(),
      image_url: imageUrl || null,
      tech_stack: form.value.tech_stack
        .split(',')
        .map(s => s.trim())
        .filter(Boolean),
      live_url: form.value.live_url.trim() || null,
      github_url: form.value.github_url.trim() || null,
      category: form.value.category,
      is_featured: form.value.is_featured,
      is_visible: form.value.is_visible,
      image_position: form.value.image_position || 'center center'
    }

    if (editingId.value) {
      const { error } = await supabase
        .from('portfolios')
        .update(payload)
        .eq('id', editingId.value)
      if (error) throw error
      showToast('Portfolio berhasil diperbarui')
    } else {
      const { error } = await supabase
        .from('portfolios')
        .insert(payload)
      if (error) throw error
      showToast('Portfolio berhasil ditambahkan')
    }

    showModal.value = false
    resetForm()
    await fetchPortfolios()
  } catch (e) {
    showToast('Gagal menyimpan: ' + e.message, 'error')
    console.error(e)
  } finally {
    formLoading.value = false
    imageUploading.value = false
  }
}

const toggleFeatured = async (portfolio) => {
  if (!portfolio.is_featured && featuredCount.value >= 6) {
    showToast('Maksimal 6 portfolio di beranda. Nonaktifkan yang lain terlebih dahulu.', 'error')
    return
  }

  try {
    const { error } = await supabase
      .from('portfolios')
      .update({ is_featured: !portfolio.is_featured })
      .eq('id', portfolio.id)
    if (error) throw error
    portfolio.is_featured = !portfolio.is_featured
    showToast(portfolio.is_featured ? 'Ditampilkan di beranda' : 'Dihapus dari beranda')
  } catch (e) {
    showToast('Gagal mengubah status', 'error')
  }
}

const toggleVisible = async (portfolio) => {
  try {
    const newVisible = !portfolio.is_visible
    const update = { is_visible: newVisible }
    // If hiding, also remove from featured
    if (!newVisible && portfolio.is_featured) {
      update.is_featured = false
    }
    const { error } = await supabase
      .from('portfolios')
      .update(update)
      .eq('id', portfolio.id)
    if (error) throw error
    portfolio.is_visible = newVisible
    if (!newVisible) portfolio.is_featured = false
    showToast(newVisible ? 'Portfolio diaktifkan' : 'Portfolio dinonaktifkan')
  } catch (e) {
    showToast('Gagal mengubah status', 'error')
  }
}

const handleDelete = async (id) => {
  try {
    // Get the portfolio to delete its image from storage
    const portfolio = portfolios.value.find(p => p.id === id)
    
    const { error } = await supabase
      .from('portfolios')
      .delete()
      .eq('id', id)
    if (error) throw error

    // Try to delete image from storage if uploaded
    if (portfolio?.image_url && portfolio.image_url.includes('supabase')) {
      try {
        const urlParts = portfolio.image_url.split('/portfolios/')
        if (urlParts[1]) {
          await supabase.storage.from('portfolios').remove([urlParts[1]])
        }
      } catch (e) { /* ignore storage delete error */ }
    }

    showToast('Portfolio berhasil dihapus')
    deleteConfirm.value = null
    await fetchPortfolios()
  } catch (e) {
    showToast('Gagal menghapus portfolio', 'error')
    console.error(e)
  }
}

onMounted(fetchPortfolios)
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
          Kelola Portfolio
        </h1>
        <p class="text-gray-500 text-sm mt-1">
          Tambah, edit, atau hapus project portfolio • 
          <span class="text-indigo-400 font-medium">{{ featuredCount }}/6</span> ditampilkan di beranda
        </p>
      </div>
      <button
        @click="openAddModal"
        class="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-500 text-white text-sm font-bold hover:bg-indigo-400 shadow-lg shadow-indigo-500/25 hover:shadow-indigo-400/30 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
      >
        <Icon icon="ph:plus-bold" class="text-base" />
        Tambah Portfolio
      </button>
    </div>

    <!-- Info Banner -->
    <div class="flex items-start gap-3 p-4 rounded-xl bg-indigo-500/8 border border-indigo-500/15 mb-6">
      <Icon icon="ph:info" class="text-indigo-400 text-lg mt-0.5 flex-shrink-0" />
      <p class="text-sm text-gray-400">
        <strong class="text-indigo-300">Beranda:</strong> Toggle <Icon icon="ph:star-bold" class="inline text-amber-400 text-xs" /> untuk menampilkan di halaman utama (maks 6). 
        Toggle <Icon icon="ph:eye-bold" class="inline text-green-400 text-xs" /> untuk tampil/sembunyikan dari halaman portofolio.
      </p>
    </div>

    <!-- Search -->
    <div class="relative mb-6">
      <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
        <Icon icon="ph:magnifying-glass" class="text-gray-500 text-lg" />
      </div>
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Cari portfolio..."
        class="w-full pl-12 pr-4 py-3 bg-white/[0.03] border border-white/[0.06] rounded-xl text-white placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all duration-300"
      />
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="space-y-4">
      <div v-for="i in 3" :key="i" class="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6 animate-pulse">
        <div class="flex items-center gap-4">
          <div class="w-20 h-20 bg-white/5 rounded-xl"></div>
          <div class="flex-1 space-y-3">
            <div class="h-4 bg-white/5 rounded w-1/3"></div>
            <div class="h-3 bg-white/5 rounded w-2/3"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div 
      v-else-if="filteredPortfolios.length === 0" 
      class="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-12 text-center"
    >
      <div class="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-4">
        <Icon icon="ph:briefcase" class="text-gray-500 text-3xl" />
      </div>
      <h3 class="text-lg font-bold text-white mb-2">
        {{ searchQuery ? 'Tidak ditemukan' : 'Belum ada portfolio' }}
      </h3>
      <p class="text-gray-500 text-sm mb-6">
        {{ searchQuery ? 'Coba kata kunci lain.' : 'Mulai dengan menambahkan project portfolio pertama.' }}
      </p>
      <button
        v-if="!searchQuery"
        @click="openAddModal"
        class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-500 text-white text-sm font-bold hover:bg-indigo-400 shadow-lg shadow-indigo-500/25 transition-all duration-300"
      >
        <Icon icon="ph:plus-bold" />
        Tambah Portfolio Pertama
      </button>
    </div>

    <!-- Portfolio List -->
    <div v-else class="space-y-4">
      <div
        v-for="portfolio in filteredPortfolios"
        :key="portfolio.id"
        class="bg-white/[0.02] border rounded-2xl p-5 transition-all duration-300 group"
        :class="[
          portfolio.is_visible 
            ? 'border-white/[0.06] hover:bg-white/[0.04] hover:border-white/[0.1]' 
            : 'border-white/[0.03] opacity-50'
        ]"
      >
        <div class="flex flex-col sm:flex-row items-start gap-4">
          <!-- Image -->
          <div class="w-full sm:w-28 h-36 sm:h-28 rounded-xl bg-white/5 overflow-hidden flex-shrink-0 relative">
            <img 
              v-if="portfolio.image_url" 
              :src="portfolio.image_url" 
              :alt="portfolio.title"
              class="w-full h-full object-cover"
            />
            <div v-else class="w-full h-full flex items-center justify-center">
              <Icon icon="ph:image" class="text-gray-600 text-3xl" />
            </div>
            <!-- Featured badge on image -->
            <div v-if="portfolio.is_featured" class="absolute top-1.5 left-1.5">
              <span class="flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-500/90 text-white text-[9px] font-bold uppercase tracking-wider shadow-lg">
                <Icon icon="ph:star-fill" class="text-[10px]" />
                Beranda
              </span>
            </div>
          </div>

          <!-- Content -->
          <div class="flex-1 min-w-0">
            <div class="flex items-start justify-between gap-3 mb-2">
              <div class="flex items-center gap-2 min-w-0">
                <h3 class="text-base font-bold text-white group-hover:text-indigo-300 transition-colors truncate">
                  {{ portfolio.title }}
                </h3>
                <span v-if="!portfolio.is_visible" class="px-1.5 py-0.5 rounded bg-gray-700 text-gray-400 text-[9px] font-bold uppercase flex-shrink-0">
                  Hidden
                </span>
              </div>
              <span class="px-2.5 py-0.5 rounded-lg bg-indigo-500/10 text-indigo-400 text-[10px] font-bold uppercase tracking-wider border border-indigo-500/20 flex-shrink-0">
                {{ portfolio.category }}
              </span>
            </div>
            
            <p v-if="portfolio.description" class="text-gray-400 text-sm mb-3 line-clamp-2">
              {{ portfolio.description }}
            </p>

            <!-- Tech stack -->
            <div v-if="portfolio.tech_stack && portfolio.tech_stack.length" class="flex flex-wrap gap-1.5 mb-3">
              <span 
                v-for="tech in portfolio.tech_stack" 
                :key="tech"
                class="px-2 py-0.5 rounded-md bg-white/[0.04] text-gray-400 text-[11px] font-medium border border-white/[0.06]"
              >
                {{ tech }}
              </span>
            </div>

            <!-- Links & Actions -->
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <a 
                  v-if="portfolio.live_url" 
                  :href="portfolio.live_url" 
                  target="_blank"
                  class="flex items-center gap-1.5 text-xs text-gray-500 hover:text-indigo-400 transition-colors"
                >
                  <Icon icon="ph:globe" class="text-sm" />
                  Live
                </a>
                <a 
                  v-if="portfolio.github_url" 
                  :href="portfolio.github_url" 
                  target="_blank"
                  class="flex items-center gap-1.5 text-xs text-gray-500 hover:text-white transition-colors"
                >
                  <Icon icon="ph:github-logo" class="text-sm" />
                  GitHub
                </a>
                <span class="text-xs text-gray-600">
                  {{ new Date(portfolio.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) }}
                </span>
              </div>
              
              <div class="flex items-center gap-1">
                <!-- Featured toggle -->
                <button
                  @click="toggleFeatured(portfolio)"
                  class="p-2 rounded-lg transition-all duration-300"
                  :class="portfolio.is_featured 
                    ? 'text-amber-400 bg-amber-500/10 hover:bg-amber-500/20' 
                    : 'text-gray-600 hover:text-amber-400 hover:bg-amber-500/10'"
                  :title="portfolio.is_featured ? 'Hapus dari beranda' : 'Tampilkan di beranda'"
                >
                  <Icon :icon="portfolio.is_featured ? 'ph:star-fill' : 'ph:star-bold'" class="text-base" />
                </button>
                <!-- Visible toggle -->
                <button
                  @click="toggleVisible(portfolio)"
                  class="p-2 rounded-lg transition-all duration-300"
                  :class="portfolio.is_visible 
                    ? 'text-green-400 bg-green-500/10 hover:bg-green-500/20' 
                    : 'text-gray-600 hover:text-green-400 hover:bg-green-500/10'"
                  :title="portfolio.is_visible ? 'Sembunyikan' : 'Tampilkan'"
                >
                  <Icon :icon="portfolio.is_visible ? 'ph:eye-bold' : 'ph:eye-slash-bold'" class="text-base" />
                </button>
                <!-- Edit -->
                <button
                  @click="openEditModal(portfolio)"
                  class="p-2 rounded-lg text-gray-500 hover:text-indigo-400 hover:bg-indigo-500/10 transition-all duration-300"
                  title="Edit"
                >
                  <Icon icon="ph:pencil-simple-bold" class="text-base" />
                </button>
                <!-- Delete -->
                <button
                  @click="deleteConfirm = portfolio.id"
                  class="p-2 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-all duration-300"
                  title="Hapus"
                >
                  <Icon icon="ph:trash-bold" class="text-base" />
                </button>
              </div>
            </div>
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
          <div v-if="deleteConfirm === portfolio.id" class="mt-4 p-4 rounded-xl bg-red-500/10 border border-red-500/20">
            <p class="text-sm text-red-300 mb-3">
              <Icon icon="ph:warning-fill" class="inline text-base mr-1" />
              Yakin ingin menghapus "<strong>{{ portfolio.title }}</strong>"? Aksi ini tidak bisa dibatalkan.
            </p>
            <div class="flex items-center gap-2">
              <button
                @click="handleDelete(portfolio.id)"
                class="px-4 py-2 rounded-lg bg-red-500 text-white text-xs font-bold hover:bg-red-400 transition-all duration-300"
              >
                Ya, Hapus
              </button>
              <button
                @click="deleteConfirm = null"
                class="px-4 py-2 rounded-lg bg-white/5 text-gray-400 text-xs font-bold hover:bg-white/10 border border-white/[0.06] transition-all duration-300"
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
        <Transition
          enter-active-class="transition duration-300 ease-out"
          enter-from-class="transform scale-95 opacity-0"
          enter-to-class="transform scale-100 opacity-100"
          leave-active-class="transition duration-200 ease-in"
          leave-from-class="transform scale-100 opacity-100"
          leave-to-class="transform scale-95 opacity-0"
        >
          <div v-if="showModal" class="bg-[#0a0a0a] border border-white/[0.08] rounded-3xl w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <!-- Modal Header -->
            <div class="flex items-center justify-between p-6 border-b border-white/[0.06]">
              <h2 class="text-xl font-bold text-white">
                {{ editingId ? 'Edit Portfolio' : 'Tambah Portfolio Baru' }}
              </h2>
              <button 
                @click="showModal = false"
                class="p-2 rounded-xl text-gray-500 hover:text-white hover:bg-white/5 transition-all duration-300"
              >
                <Icon icon="ph:x-bold" class="text-lg" />
              </button>
            </div>

            <!-- Modal Form -->
            <form @submit.prevent="handleSubmit" class="p-6 space-y-5">
              <!-- Title -->
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-2">
                  Judul Project <span class="text-red-400">*</span>
                </label>
                <input
                  v-model="form.title"
                  type="text"
                  required
                  placeholder="Contoh: NovaTix Website"
                  class="w-full px-4 py-3 bg-white/[0.04] border border-white/[0.08] rounded-xl text-white placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all duration-300"
                />
              </div>

              <!-- Category -->
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-2">Kategori</label>
                <div class="flex flex-wrap gap-2">
                  <button
                    v-for="cat in categories"
                    :key="cat"
                    type="button"
                    @click="form.category = cat"
                    class="px-4 py-2 rounded-xl text-xs font-bold border transition-all duration-300"
                    :class="form.category === cat 
                      ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40' 
                      : 'bg-white/[0.03] text-gray-400 border-white/[0.06] hover:bg-white/[0.06] hover:text-white'"
                  >
                    {{ cat }}
                  </button>
                </div>
              </div>

              <!-- Description -->
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-2">Deskripsi</label>
                <textarea
                  v-model="form.description"
                  rows="3"
                  placeholder="Deskripsi singkat project..."
                  class="w-full px-4 py-3 bg-white/[0.04] border border-white/[0.08] rounded-xl text-white placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all duration-300 resize-none"
                ></textarea>
              </div>

              <!-- Image Upload -->
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-2">
                  Gambar Project
                </label>
                
                <!-- Upload area -->
                <div 
                  v-if="!form.image_url"
                  @dragover.prevent="imageDragOver = true"
                  @dragleave.prevent="imageDragOver = false"
                  @drop="handleDrop"
                  class="relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 cursor-pointer"
                  :class="imageDragOver 
                    ? 'border-indigo-500 bg-indigo-500/10' 
                    : 'border-white/[0.08] hover:border-white/[0.15] hover:bg-white/[0.02]'"
                  @click="$refs.fileInput.click()"
                >
                  <input 
                    ref="fileInput"
                    type="file" 
                    accept="image/*" 
                    class="hidden" 
                    @change="handleFileSelect" 
                  />
                  <Icon icon="ph:cloud-arrow-up" class="text-3xl mb-2 mx-auto" :class="imageDragOver ? 'text-indigo-400' : 'text-gray-500'" />
                  <p class="text-sm text-gray-400">
                    <span class="text-indigo-400 font-medium">Klik untuk upload</span> atau drag & drop
                  </p>
                  <p class="text-xs text-gray-600 mt-1">PNG, JPG, WebP (maks 5MB)</p>
                </div>

                <!-- Image preview -->
                <div v-else class="space-y-3">
                  <!-- Preview with crop preview -->
                  <div class="rounded-xl overflow-hidden border border-white/[0.06]">
                    <!-- Crop result preview (simulated card view) -->
                    <div class="h-40 overflow-hidden bg-white/[0.03] relative">
                      <img 
                        :src="form.image_url" 
                        alt="Preview" 
                        class="w-full h-full object-cover"
                        :style="{ objectPosition: form.image_position }"
                        @error="(e) => e.target.style.display = 'none'" 
                      />
                      <div v-if="imageUploading" class="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <Icon icon="ph:spinner" class="text-2xl text-white animate-spin" />
                      </div>
                    </div>
                    
                    <!-- Toolbar -->
                    <div class="flex items-center justify-between px-3 py-2 bg-white/[0.02] border-t border-white/[0.06]">
                      <div class="flex items-center gap-2">
                        <button 
                          type="button"
                          @click="isPositioning = !isPositioning"
                          class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold border transition-all duration-300"
                          :class="isPositioning 
                            ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30' 
                            : 'bg-white/[0.04] text-gray-400 border-white/[0.06] hover:text-white hover:bg-white/[0.06]'"
                        >
                          <Icon icon="ph:crosshair-bold" class="text-xs" />
                          <span>Atur Posisi</span>
                        </button>
                        <span v-if="isPositioning" class="text-[10px] text-gray-500">
                          {{ form.image_position }}
                        </span>
                      </div>
                      <button 
                        type="button"
                        @click="removeImage"
                        class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold bg-white/[0.04] text-gray-400 border border-white/[0.06] hover:bg-red-500/20 hover:text-red-400 hover:border-red-500/30 transition-all duration-300"
                      >
                        <Icon icon="ph:trash-bold" class="text-xs" />
                        <span>Hapus</span>
                      </button>
                    </div>
                  </div>
                  
                  <!-- Position selector (full image) -->
                  <Transition
                    enter-active-class="transition duration-200 ease-out"
                    enter-from-class="opacity-0 -translate-y-2"
                    enter-to-class="opacity-100 translate-y-0"
                    leave-active-class="transition duration-150 ease-in"
                    leave-from-class="opacity-100 translate-y-0"
                    leave-to-class="opacity-0 -translate-y-2"
                  >
                    <div v-if="isPositioning" class="space-y-2">
                      <p class="text-[11px] text-gray-500 flex items-center gap-1">
                        <Icon icon="ph:info" class="text-xs" />
                        Klik/drag pada gambar untuk mengatur titik fokus
                      </p>
                      <div 
                        ref="positionPreviewRef"
                        class="relative rounded-xl overflow-hidden border-2 border-indigo-500/30 cursor-crosshair select-none"
                        @mousedown="handlePositionClick"
                        @mousemove="handlePositionMove"
                        @touchmove="handleTouchPosition"
                        @touchstart="handleTouchPosition"
                      >
                        <img :src="form.image_url" alt="Position" class="w-full block" />
                        <!-- Crosshair indicator -->
                        <div 
                          class="absolute w-8 h-8 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-10"
                          :style="{ left: positionToXY.x + '%', top: positionToXY.y + '%' }"
                        >
                          <div class="absolute inset-0 rounded-full border-2 border-indigo-400 shadow-[0_0_10px_rgba(99,102,241,0.5)]"></div>
                          <div class="absolute top-1/2 left-0 right-0 h-px bg-indigo-400/60"></div>
                          <div class="absolute left-1/2 top-0 bottom-0 w-px bg-indigo-400/60"></div>
                        </div>
                        <!-- Grid overlay -->
                        <div class="absolute inset-0 pointer-events-none" style="background: linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px); background-size: 33.33% 33.33%;"></div>
                      </div>
                    </div>
                  </Transition>
                </div>


                <!-- Or use URL -->
                <div v-if="!form.image_url" class="mt-3">
                  <div class="flex items-center gap-3 mb-2">
                    <div class="flex-1 h-px bg-white/[0.06]"></div>
                    <span class="text-xs text-gray-600">atau gunakan URL</span>
                    <div class="flex-1 h-px bg-white/[0.06]"></div>
                  </div>
                  <input
                    v-model="form.image_url"
                    type="url"
                    placeholder="https://example.com/screenshot.png"
                    class="w-full px-4 py-2.5 bg-white/[0.04] border border-white/[0.08] rounded-xl text-white placeholder-gray-500 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all duration-300"
                  />
                </div>
              </div>

              <!-- Tech Stack -->
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-2">
                  Tech Stack
                  <span class="text-gray-500 font-normal">(pisahkan dengan koma)</span>
                </label>
                <input
                  v-model="form.tech_stack"
                  type="text"
                  placeholder="Vue.js, Tailwind, Supabase"
                  class="w-full px-4 py-3 bg-white/[0.04] border border-white/[0.08] rounded-xl text-white placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all duration-300"
                />
              </div>

              <!-- URLs Row -->
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-300 mb-2">Live URL</label>
                  <input
                    v-model="form.live_url"
                    type="url"
                    placeholder="https://project.com"
                    class="w-full px-4 py-3 bg-white/[0.04] border border-white/[0.08] rounded-xl text-white placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all duration-300"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-300 mb-2">GitHub URL</label>
                  <input
                    v-model="form.github_url"
                    type="url"
                    placeholder="https://github.com/user/repo"
                    class="w-full px-4 py-3 bg-white/[0.04] border border-white/[0.08] rounded-xl text-white placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all duration-300"
                  />
                </div>
              </div>

              <!-- Visibility Toggles -->
              <div class="flex flex-col sm:flex-row gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                <label class="flex items-center gap-3 cursor-pointer flex-1">
                  <div 
                    @click="form.is_featured = !form.is_featured"
                    class="w-10 h-6 rounded-full transition-all duration-300 flex items-center px-0.5 cursor-pointer"
                    :class="form.is_featured ? 'bg-amber-500' : 'bg-white/10'"
                  >
                    <div 
                      class="w-5 h-5 rounded-full bg-white shadow transition-transform duration-300"
                      :class="form.is_featured ? 'translate-x-4' : 'translate-x-0'"
                    ></div>
                  </div>
                  <div>
                    <p class="text-sm font-medium text-white">Tampilkan di Beranda</p>
                    <p class="text-xs text-gray-500">Muncul di halaman utama (maks 6)</p>
                  </div>
                </label>
                <label class="flex items-center gap-3 cursor-pointer flex-1">
                  <div 
                    @click="form.is_visible = !form.is_visible"
                    class="w-10 h-6 rounded-full transition-all duration-300 flex items-center px-0.5 cursor-pointer"
                    :class="form.is_visible ? 'bg-green-500' : 'bg-white/10'"
                  >
                    <div 
                      class="w-5 h-5 rounded-full bg-white shadow transition-transform duration-300"
                      :class="form.is_visible ? 'translate-x-4' : 'translate-x-0'"
                    ></div>
                  </div>
                  <div>
                    <p class="text-sm font-medium text-white">Visible</p>
                    <p class="text-xs text-gray-500">Tampil di halaman portofolio</p>
                  </div>
                </label>
              </div>

              <!-- Actions -->
              <div class="flex items-center justify-end gap-3 pt-4 border-t border-white/[0.06]">
                <button
                  type="button"
                  @click="showModal = false"
                  class="px-5 py-2.5 rounded-xl text-sm font-medium text-gray-400 bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.06] hover:text-white transition-all duration-300"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  :disabled="formLoading"
                  class="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white transition-all duration-300"
                  :class="formLoading 
                    ? 'bg-indigo-500/50 cursor-not-allowed' 
                    : 'bg-indigo-500 hover:bg-indigo-400 shadow-lg shadow-indigo-500/25 hover:shadow-indigo-400/30 hover:scale-[1.02] active:scale-[0.98]'"
                >
                  <Icon v-if="formLoading" icon="ph:spinner" class="text-base animate-spin" />
                  <Icon v-else :icon="editingId ? 'ph:pencil-simple-bold' : 'ph:plus-bold'" class="text-base" />
                  {{ formLoading ? (imageUploading ? 'Mengupload...' : 'Menyimpan...') : (editingId ? 'Simpan Perubahan' : 'Tambahkan') }}
                </button>
              </div>
            </form>
          </div>
        </Transition>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
