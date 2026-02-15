<script setup>
import { ref, onMounted, computed } from 'vue'
import { supabase } from '../lib/supabase'
import { Icon } from '@iconify/vue'
import VisitsChart from '../components/charts/VisitsChart.vue'
import DoughnutChart from '../components/charts/DoughnutChart.vue'
import BarChart from '../components/charts/BarChart.vue'
import PolarAreaChart from '../components/charts/PolarAreaChart.vue'
import RadarChart from '../components/charts/RadarChart.vue'


const stats = ref({
  totalPortfolios: 0,
  categories: 0,
  latestPortfolio: null,
  totalVisits: 0,
  uniqueVisitors: 0,
  avgDuration: 0,
  bounceRate: 0
})
const visits = ref([])
const recentVisits = ref([])
const loading = ref(true)
const isViewAllModalOpen = ref(false)
const user = ref(null)

const toggleViewAllModal = () => {
  isViewAllModalOpen.value = !isViewAllModalOpen.value
  if (isViewAllModalOpen.value) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = 'auto'
  }
}

const trafficSourceData = computed(() => {
    const data = {}
    visits.value.forEach(v => {
        let source = v.utm_source || v.referrer || 'Direct'
        if (source.includes('instagram')) source = 'Instagram'
        else if (source.includes('google')) source = 'Google'
        else if (source.includes('Direct') || source === 'Direct') source = 'Direct'
        
        data[source] = (data[source] || 0) + 1
    })
    return data
})

const avgTimeData = computed(() => {
    // Page Interest: Portfolio vs Services vs Others
    const groups = {
        'Portfolio': { totalTime: 0, count: 0 },
        'Services': { totalTime: 0, count: 0 },
        'Home': { totalTime: 0, count: 0 },
        'Pricing': { totalTime: 0, count: 0 }
    }
    
    visits.value.forEach(v => {
        if (!v.session_duration_seconds) return;
        
        // Normalize path
        const path = v.path || ''
        
        let key = ''
        if (path.includes('portofolio')) key = 'Portfolio'
        else if (path.includes('services')) key = 'Services'
        else if (path === '/' || path === '') key = 'Home'
        else if (path.includes('pricing')) key = 'Pricing'
        
        if (key) {
             groups[key].totalTime += v.session_duration_seconds
             groups[key].count++
        }
    })
    
    const result = {}
    for (const [key, val] of Object.entries(groups)) {
        if (val.count > 0) {
            result[key] = Math.round(val.totalTime / val.count)
        }
    }
    return result
})

const scrollDepthData = computed(() => {
    const groups = {
        'Portfolio': { total: 0, count: 0 },
        'Services': { total: 0, count: 0 },
        'Home': { total: 0, count: 0 },
        'Pricing': { total: 0, count: 0 }
    }

    visits.value.forEach(v => {
        if (!v.scroll_depth_percent) return;
        
         const path = v.path || ''
        let key = ''
        if (path.includes('portofolio')) key = 'Portfolio'
        else if (path.includes('services')) key = 'Services'
        else if (path === '/' || path === '') key = 'Home'
        else if (path.includes('pricing')) key = 'Pricing'

        if (key) {
            groups[key].total += v.scroll_depth_percent
            groups[key].count++
        }
    })

    const result = {}
     for (const [key, val] of Object.entries(groups)) {
        if (val.count > 0) {
            result[key] = Math.round(val.total / val.count)
        }
    }
    return result
})

const formatDuration = (seconds) => {
    if (!seconds) return '0s'
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return m > 0 ? `${m}m ${s}s` : `${s}s`
}

onMounted(async () => {
  const { data: { session } } = await supabase.auth.getSession()
  if (session) user.value = session.user

  try {
    // 1. Fetch Portfolios
    const pfReq = await supabase
      .from('portfolios')
      .select('category, created_at, title, image_url')
      .order('created_at', { ascending: false })

    if (pfReq.data) {
      stats.value.totalPortfolios = pfReq.data.length
      const cats = new Set(pfReq.data.map(p => p.category))
      stats.value.categories = cats.size
      stats.value.latestPortfolio = pfReq.data[0] || null
    }

    // 2. Fetch Analytics (Last 30 days)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    
    const anReq = await supabase
      .from('analytics_visits')
      .select('*')
      .gte('created_at', thirtyDaysAgo.toISOString())
      .order('created_at', { ascending: false })

    if (anReq.data) {
        visits.value = anReq.data
        recentVisits.value = anReq.data.slice(0, 5) // Top 5 recent
        stats.value.totalVisits = anReq.data.length
        
        // Count unique visitors
        const unique = new Set(anReq.data.map(v => v.visitor_id))
        stats.value.uniqueVisitors = unique.size

        // Avg Duration
        const durationVisits = anReq.data.filter(v => v.session_duration_seconds > 0)
        if (durationVisits.length > 0) {
            const totalDuration = durationVisits.reduce((acc, v) => acc + v.session_duration_seconds, 0)
            stats.value.avgDuration = Math.round(totalDuration / durationVisits.length)
        }

        // Bounce Rate: Visits with < 10 seconds or single page view (implied by no other tracking, but here we can only approximate by duration)
        // A better bounce rate needs grouping by session ID, but we only have basic visit rows. 
        // We will approximate bounce as "visits with duration < 5 seconds"
        const bounces = anReq.data.filter(v => !v.session_duration_seconds || v.session_duration_seconds < 5)
        if (anReq.data.length > 0) {
            stats.value.bounceRate = Math.round((bounces.length / anReq.data.length) * 100)
        }


    }

  } catch (e) {
    console.error('Failed to fetch dashboard data:', e)
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="max-w-7xl mx-auto space-y-8">
    
    <!-- Welcome Header -->
    <div class="flex items-center justify-between">
        <div>
            <h1 class="text-3xl font-bold text-white mb-2 tracking-tight">
                Dashboard <span class="text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">Analytics</span>
            </h1>
            <p class="text-gray-400 text-sm">Monitor performa website dan pengunjung secara real-time.</p>
        </div>
        <div class="hidden md:flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.05] border border-white/[0.1] text-xs text-gray-300 shadow-[0_0_15px_rgba(255,255,255,0.05)]">
            <span class="w-2 h-2 rounded-full bg-white animate-pulse shadow-[0_0_8px_rgba(255,255,255,0.8)]"></span>
            Real-time Monitoring
        </div>
    </div>

    <!-- Stats Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      
      <!-- Total Visits -->
      <div class="bg-black/40 border border-white/[0.1] rounded-2xl p-6 relative overflow-hidden group hover:border-white/[0.2] transition-all duration-300 hover:shadow-[0_0_20px_rgba(255,255,255,0.05)]">
        <div class="absolute top-0 right-0 w-32 h-32 bg-white/[0.03] rounded-full blur-[40px] group-hover:bg-white/[0.05] transition-all"></div>
        <div class="relative z-10">
            <p class="text-gray-500 text-xs font-bold uppercase tracking-wider mb-2">Total Kunjungan (30 Hari)</p>
            <h3 class="text-3xl font-bold text-white mb-1 tracking-tight">
                <span v-if="loading">...</span>
                <span v-else>{{ stats.totalVisits }}</span>
            </h3>
            <div class="flex items-center gap-1 text-xs text-gray-400">
                <Icon icon="ph:trend-up-bold" class="text-white" />
                <span>Active</span>
            </div>
        </div>
        <Icon icon="ph:users-three-bold" class="absolute bottom-6 right-6 text-white/[0.08] text-4xl group-hover:text-white/[0.15] transition-colors" />
      </div>

      <!-- Unique Visitors -->
      <div class="bg-black/40 border border-white/[0.1] rounded-2xl p-6 relative overflow-hidden group hover:border-white/[0.2] transition-all duration-300 hover:shadow-[0_0_20px_rgba(255,255,255,0.05)]">
        <div class="absolute top-0 right-0 w-32 h-32 bg-white/[0.03] rounded-full blur-[40px] group-hover:bg-white/[0.05] transition-all"></div>
        <div class="relative z-10">
            <p class="text-gray-500 text-xs font-bold uppercase tracking-wider mb-2">Pengunjung Unik</p>
            <h3 class="text-3xl font-bold text-white mb-1 tracking-tight">
                <span v-if="loading">...</span>
                <span v-else>{{ stats.uniqueVisitors }}</span>
            </h3>
            <div class="flex items-center gap-1 text-xs text-gray-400">
                <Icon icon="ph:fingerprint-bold" class="text-white" />
                <span>Devices</span>
            </div>
        </div>
        <Icon icon="ph:device-mobile-bold" class="absolute bottom-6 right-6 text-white/[0.08] text-4xl group-hover:text-white/[0.15] transition-colors" />
      </div>

      <!-- Avg Session Duration -->
      <div class="bg-black/40 border border-white/[0.1] rounded-2xl p-6 relative overflow-hidden group hover:border-white/[0.2] transition-all duration-300 hover:shadow-[0_0_20px_rgba(255,255,255,0.05)]">
        <div class="absolute top-0 right-0 w-32 h-32 bg-white/[0.03] rounded-full blur-[40px] group-hover:bg-white/[0.05] transition-all"></div>
        <div class="relative z-10">
            <p class="text-gray-500 text-xs font-bold uppercase tracking-wider mb-2">Rata-rata Durasi</p>
            <h3 class="text-3xl font-bold text-white mb-1 tracking-tight">
                <span v-if="loading">...</span>
                <span v-else>{{ formatDuration(stats.avgDuration) }}</span>
            </h3>
            <div class="flex items-center gap-1 text-xs text-gray-400">
                <Icon icon="ph:clock-bold" class="text-white" />
                <span>Per Sesi</span>
            </div>
        </div>
        <Icon icon="ph:timer-bold" class="absolute bottom-6 right-6 text-white/[0.08] text-4xl group-hover:text-white/[0.15] transition-colors" />
      </div>

      <!-- Total Portfolios -->
      <div class="bg-black/40 border border-white/[0.1] rounded-2xl p-6 relative overflow-hidden group hover:border-white/[0.2] transition-all duration-300 hover:shadow-[0_0_20px_rgba(255,255,255,0.05)]">
        <div class="absolute top-0 right-0 w-32 h-32 bg-white/[0.03] rounded-full blur-[40px] group-hover:bg-white/[0.05] transition-all"></div>
        <div class="relative z-10">
            <p class="text-gray-500 text-xs font-bold uppercase tracking-wider mb-2">Total Portfolio</p>
            <h3 class="text-3xl font-bold text-white mb-1 tracking-tight">
                <span v-if="loading">...</span>
                <span v-else>{{ stats.totalPortfolios }}</span>
            </h3>
            <div class="flex items-center gap-1 text-xs text-gray-400">
                <span>{{ stats.categories }} Kategori</span>
            </div>
        </div>
        <Icon icon="ph:briefcase-bold" class="absolute bottom-6 right-6 text-white/[0.08] text-4xl group-hover:text-white/[0.15] transition-colors" />
      </div>

      <!-- Bounce Rate -->
      <div class="bg-black/40 border border-white/[0.1] rounded-2xl p-6 relative overflow-hidden group hover:border-white/[0.2] transition-all duration-300 hover:shadow-[0_0_20px_rgba(255,255,255,0.05)]">
        <div class="absolute top-0 right-0 w-32 h-32 bg-white/[0.03] rounded-full blur-[40px] group-hover:bg-white/[0.05] transition-all"></div>
        <div class="relative z-10">
            <p class="text-gray-500 text-xs font-bold uppercase tracking-wider mb-2">Bounce Rate</p>
            <h3 class="text-3xl font-bold text-white mb-1 tracking-tight">
                <span v-if="loading">...</span>
                <span v-else>{{ stats.bounceRate }}%</span>
            </h3>
            <div class="flex items-center gap-1 text-xs text-gray-400">
                <Icon icon="ph:arrow-u-up-left-bold" class="text-white" />
                <span>Single Page</span>
            </div>
        </div>
        <Icon icon="ph:door-open-bold" class="absolute bottom-6 right-6 text-white/[0.08] text-4xl group-hover:text-white/[0.15] transition-colors" />
      </div>



    </div>

    <!-- Charts Section -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Main Line Chart -->
        <div class="lg:col-span-2 bg-black/40 border border-white/[0.1] rounded-2xl p-6 hover:shadow-[0_0_30px_rgba(255,255,255,0.03)] transition-all duration-500">
            <div class="flex items-center justify-between mb-6">
                <h3 class="font-bold text-white tracking-tight">Traffic Overview</h3>
                <div class="flex gap-2 items-center">
                    <span class="w-2 h-2 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.5)]"></span>
                    <span class="text-xs text-gray-400">Visitors</span>
                </div>
            </div>
            <VisitsChart v-if="!loading" :visits="visits" />
            <div v-else class="h-64 flex items-center justify-center text-gray-500">Loading Chart...</div>
        </div>

        <!-- Doughnut Charts -->
        <div class="bg-black/40 border border-white/[0.1] rounded-2xl p-6 flex flex-col gap-8 hover:shadow-[0_0_30px_rgba(255,255,255,0.03)] transition-all duration-500">
            <div>
                <h3 class="font-bold text-white mb-4 tracking-tight">Device Type</h3>
                <DoughnutChart v-if="!loading" :visits="visits" type="device" />
            </div>
            <div class="border-t border-white/[0.06] pt-8">
                <h3 class="font-bold text-white mb-4 tracking-tight">Operating System</h3>
                <DoughnutChart v-if="!loading" :visits="visits" type="os" />
            </div>
        </div>
    </div>
    
<div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
    <div class="bg-black/40 border border-white/[0.1] rounded-2xl p-6 relative overflow-hidden group hover:border-white/[0.3] hover:shadow-[0_0_30px_rgba(255,255,255,0.15)] transition-all duration-500 flex flex-col">
        <div class="absolute top-0 right-0 w-32 h-32 bg-white/[0.03] rounded-full blur-[40px] group-hover:bg-white/[0.08] transition-all duration-500"></div>
        
        <div class="relative z-10 mb-6">
            <h3 class="font-bold text-white tracking-tight flex items-center gap-2">
                <Icon icon="ph:share-network-bold" class="text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]" />
                Sumber Traffic
            </h3>
            <p class="text-xs text-gray-500 mt-1">Platform asal pengunjung website</p>
        </div>
        
        <div class="relative z-10 flex-grow h-56">
    <PolarAreaChart v-if="!loading" :data="trafficSourceData" label="Visits" />
            <div v-else class="h-full flex items-center justify-center text-gray-500 text-sm border border-white/[0.05] rounded-xl border-dashed">
                Loading data...
            </div>
        </div>
    </div>

    <div class="bg-black/40 border border-white/[0.1] rounded-2xl p-6 relative overflow-hidden group hover:border-white/[0.3] hover:shadow-[0_0_30px_rgba(255,255,255,0.15)] transition-all duration-500 flex flex-col">
        <div class="absolute top-0 right-0 w-32 h-32 bg-white/[0.03] rounded-full blur-[40px] group-hover:bg-white/[0.08] transition-all duration-500"></div>
        
        <div class="relative z-10 mb-6">
            <h3 class="font-bold text-white tracking-tight flex items-center gap-2">
                <Icon icon="ph:hourglass-high-bold" class="text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]" />
                Rata-rata Waktu
            </h3>
            <p class="text-xs text-gray-500 mt-1">Durasi per halaman (Detik)</p>
        </div>
        
        <div class="relative z-10 flex-grow h-56">
            <BarChart v-if="!loading" :data="avgTimeData" label="Seconds" />
            <div v-else class="h-full flex items-center justify-center text-gray-500 text-sm border border-white/[0.05] rounded-xl border-dashed">
                Loading data...
            </div>
        </div>
    </div>

    <div class="bg-black/40 border border-white/[0.1] rounded-2xl p-6 relative overflow-hidden group hover:border-white/[0.3] hover:shadow-[0_0_30px_rgba(255,255,255,0.15)] transition-all duration-500 flex flex-col">
        <div class="absolute top-0 right-0 w-32 h-32 bg-white/[0.03] rounded-full blur-[40px] group-hover:bg-white/[0.08] transition-all duration-500"></div>
        
        <div class="relative z-10 mb-6">
            <h3 class="font-bold text-white tracking-tight flex items-center gap-2">
                <Icon icon="ph:mouse-scroll-bold" class="text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]" />
                Scroll Depth
            </h3>
            <p class="text-xs text-gray-500 mt-1">Kedalaman scroll halaman (%)</p>
        </div>
        
    <div class="relative z-10 flex-grow h-56">
        <RadarChart v-if="!loading" :data="scrollDepthData" label="%" />
            <div v-else class="h-full flex items-center justify-center text-gray-500 text-sm border border-white/[0.05] rounded-xl border-dashed">
                Loading data...
            </div>
        </div>
    </div>
    
</div>

    <!-- Recent Visits Table -->
<div class="bg-black/40 border border-white/[0.1] rounded-2xl overflow-hidden hover:shadow-[0_0_30px_rgba(255,255,255,0.03)] transition-all duration-500 relative">
        <div class="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-1 bg-white/[0.1] blur-[10px]"></div>

        <div class="p-6 border-b border-white/[0.06] flex items-center justify-between">
            <h3 class="font-bold text-white tracking-tight flex items-center gap-2">
                <Icon icon="ph:list-dashes-bold" class="text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]" />
                Kunjungan Terakhir
            </h3>
            <button 
                @click="toggleViewAllModal" 
                class="px-4 py-1.5 text-xs font-semibold text-gray-300 bg-white/[0.02] border border-white/[0.05] rounded-lg hover:bg-white/[0.1] hover:text-white hover:shadow-[0_0_10px_rgba(255,255,255,0.1)] transition-all duration-300 flex items-center gap-2"
            >
                View All
                <Icon icon="ph:arrow-right-bold" />
            </button>
        </div>

        <div class="overflow-x-auto">
            <table class="w-full text-left text-sm text-gray-400">
                <thead class="bg-white/[0.02] text-xs uppercase font-semibold text-gray-500">
                    <tr>
                        <th class="px-6 py-4">Waktu</th>
                        <th class="px-6 py-4">Lokasi & IP</th>
                        <th class="px-6 py-4">Device / Browser</th>
                        <th class="px-6 py-4">Halaman / Source</th>
                        <th class="px-6 py-4 text-right">Durasi</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-white/[0.04]">
                    <tr v-if="loading">
                        <td colspan="5" class="px-6 py-8 text-center">
                            <Icon icon="ph:spinner-gap-bold" class="animate-spin text-2xl mx-auto mb-2 text-white/50" />
                            Loading data...
                        </td>
                    </tr>
                    <tr v-else-if="recentVisits.length === 0">
                        <td colspan="5" class="px-6 py-8 text-center text-gray-500">Belum ada data kunjungan.</td>
                    </tr>
                    
                    <tr v-for="visit in recentVisits" :key="visit.id" class="hover:bg-white/[0.03] transition-colors group">
                        <td class="px-6 py-4 whitespace-nowrap">
                            <div class="text-white font-medium drop-shadow-[0_0_2px_rgba(255,255,255,0.3)]">
                                {{ new Date(visit.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) }}
                            </div>
                            <div class="text-xs text-gray-600 group-hover:text-gray-400 transition-colors">
                                {{ new Date(visit.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }) }}
                            </div>
                        </td>
                        
                        <td class="px-6 py-4">
                            <div class="flex items-center gap-3">
                                <div class="w-8 h-8 rounded-full bg-white/[0.05] border border-white/[0.1] flex items-center justify-center group-hover:bg-white/[0.1] transition-all">
                                    <Icon icon="ph:globe-hemisphere-west-bold" class="text-white/70" />
                                </div>
                                <div>
                                    <div class="text-gray-300 group-hover:text-white transition-colors font-medium">
                                        {{ visit.city || 'Unknown City' }}
                                    </div>
                                    <div class="text-xs text-gray-600 font-mono group-hover:text-gray-400">
                                        {{ visit.country || 'Unknown' }}
                                    </div>
                                </div>
                            </div>
                        </td>

                        <td class="px-6 py-4">
                            <div class="flex items-center gap-2">
                                <Icon 
                                    :icon="visit.device_type === 'Mobile' ? 'ph:device-mobile-bold' : 'ph:desktop-tower-bold'" 
                                    class="text-gray-500 group-hover:text-white transition-colors" 
                                />
                                <div>
                                    <div class="text-gray-300 group-hover:text-white transition-colors">
                                        {{ visit.os?.split(' ')[0] || 'Unknown OS' }}
                                    </div>
                                    <div class="text-xs text-gray-600 group-hover:text-gray-400 transition-colors">
                                        {{ visit.browser?.split(' ')[0] || 'Unknown Browser' }}
                                    </div>
                                </div>
                            </div>
                        </td>

                        <td class="px-6 py-4">
                            <div class="flex flex-col items-start gap-1">
                                <span class="px-2 py-1 rounded-md bg-white/[0.03] border border-white/[0.05] text-xs font-mono text-gray-400 group-hover:text-white group-hover:border-white/[0.15] group-hover:shadow-[0_0_8px_rgba(255,255,255,0.1)] transition-all">
                                    {{ visit.path }}
                                </span>
                                <span class="text-[10px] uppercase tracking-wider text-gray-600 font-semibold group-hover:text-gray-400 transition-colors flex items-center gap-1">
                                    <Icon icon="ph:link-bold" />
                                    {{ visit.utm_source || visit.referrer || 'Direct' }}
                                </span>
                            </div>
                        </td>

                        <td class="px-6 py-4 text-right">
                            <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.02] border border-white/[0.05] text-gray-400 group-hover:bg-white/[0.08] group-hover:text-white transition-all">
                                <Icon icon="ph:timer-bold" class="text-xs" />
                                <span class="font-mono text-sm">
                                    {{ visit.session_duration_seconds ? formatDuration(visit.session_duration_seconds) : '0s' }}
                                </span>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
  </div>

  <div 
        v-if="isViewAllModalOpen" 
        class="fixed inset-0 z-50 flex items-center justify-center px-4 py-8"
    >
        <div 
            class="absolute inset-0 bg-black/80 backdrop-blur-md"
            @click="toggleViewAllModal"
        ></div>

        <div class="relative w-full max-w-6xl max-h-full bg-[#0a0a0a] border border-white/[0.1] rounded-2xl shadow-[0_0_50px_rgba(255,255,255,0.05)] flex flex-col overflow-hidden animate-fade-in-up">
            
            <div class="flex items-center justify-between p-6 border-b border-white/[0.06] bg-white/[0.02]">
                <div>
                    <h2 class="text-xl font-bold text-white flex items-center gap-2">
                        <Icon icon="ph:database-bold" class="text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]" />
                        Seluruh Data Kunjungan
                    </h2>
                    <p class="text-xs text-gray-400 mt-1">Menampilkan total {{ visits.length }} rekam jejak pengunjung</p>
                </div>
                
                <button 
                    @click="toggleViewAllModal"
                    class="p-2 text-gray-400 hover:text-white hover:bg-white/[0.1] rounded-lg transition-colors"
                >
                    <Icon icon="ph:x-bold" class="text-xl" />
                </button>
            </div>

            <div class="overflow-y-auto flex-grow custom-scrollbar">
                <table class="w-full text-left text-sm text-gray-400">
                    <thead class="sticky top-0 bg-[#0a0a0a] border-b border-white/[0.06] text-xs uppercase font-semibold text-gray-500 z-10 shadow-md">
                        <tr>
                            <th class="px-6 py-4">Waktu</th>
                            <th class="px-6 py-4">Lokasi</th>
                            <th class="px-6 py-4">Device</th>
                            <th class="px-6 py-4">Halaman</th>
                            <th class="px-6 py-4 text-right">Durasi</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-white/[0.04]">
                        <tr v-for="visit in visits" :key="visit.id" class="hover:bg-white/[0.02] transition-colors group">
                            <td class="px-6 py-3 whitespace-nowrap">
                                <div class="text-white font-medium">{{ new Date(visit.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) }}</div>
                                <div class="text-xs text-gray-600">{{ new Date(visit.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }) }}</div>
                            </td>
                            <td class="px-6 py-3">
                                <div class="text-gray-300">{{ visit.city || 'Unknown' }}</div>
                                <div class="text-xs text-gray-600">{{ visit.country || 'Unknown' }}</div>
                            </td>
                            <td class="px-6 py-3">
                                <div class="text-gray-300">{{ visit.os?.split(' ')[0] || '-' }}</div>
                                <div class="text-xs text-gray-600">{{ visit.browser?.split(' ')[0] || '-' }}</div>
                            </td>
                            <td class="px-6 py-3">
                                <span class="px-2 py-1 rounded bg-white/[0.03] border border-white/[0.05] text-xs font-mono text-gray-400">{{ visit.path }}</span>
                            </td>
                            <td class="px-6 py-3 text-right">
                                <span class="font-mono text-gray-300">{{ visit.session_duration_seconds ? formatDuration(visit.session_duration_seconds) : '0s' }}</span>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

        </div>
    </div>
</template>

<style>
/* Tambahkan ini di paling bawah file AdminDashboard.vue jika belum ada */
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(20px) scale(0.98); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}
.animate-fade-in-up {
  animation: fadeInUp 0.3s ease-out forwards;
}

/* Scrollbar khusus untuk modal agar tidak terlihat default Windows/Mac yang tebal */
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background-color: rgba(255, 255, 255, 0.2);
}
</style> 