<script setup>
import { ref, onMounted, computed } from 'vue'
import { supabase } from '../lib/supabase'
import { Icon } from '@iconify/vue'
import VisitsChart from '../components/charts/VisitsChart.vue'
import DoughnutChart from '../components/charts/DoughnutChart.vue'

const stats = ref({
  totalPortfolios: 0,
  categories: 0,
  latestPortfolio: null,
  totalVisits: 0,
  uniqueVisitors: 0
})
const visits = ref([])
const recentVisits = ref([])
const loading = ref(true)
const user = ref(null)

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
    }

  } catch (e) {
    console.error('Failed to fetch dashboard data:', e)
  } finally {
    loading.value = false
  }
})

// Helper to get country flag emoji
const getFlagEmoji = (countryCode) => {
  if (!countryCode) return '🌍' // Default globe
  // This is a simplified way, usually you need a proper mapping or library
  // For now let's just use the Globe icon for simplicity in the UI if we don't have code
  return '🌍' 
}
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

    <!-- Recent Visits Table -->
    <div class="bg-black/40 border border-white/[0.1] rounded-2xl overflow-hidden hover:shadow-[0_0_30px_rgba(255,255,255,0.03)] transition-all duration-500">
        <div class="p-6 border-b border-white/[0.06] flex items-center justify-between">
            <h3 class="font-bold text-white tracking-tight">Kunjungan Terakhir</h3>
            <button class="text-xs text-gray-400 hover:text-white transition-colors">View All</button>
        </div>
        <div class="overflow-x-auto">
            <table class="w-full text-left text-sm text-gray-400">
                <thead class="bg-white/[0.02] text-xs uppercase font-semibold text-gray-500">
                    <tr>
                        <th class="px-6 py-4">Waktu</th>
                        <th class="px-6 py-4">Lokasi</th>
                        <th class="px-6 py-4">Device / OS</th>
                        <th class="px-6 py-4">Halaman</th>
                        <th class="px-6 py-4">Status</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-white/[0.04]">
                    <tr v-if="loading">
                        <td colspan="5" class="px-6 py-8 text-center">Loading data...</td>
                    </tr>
                    <tr v-else-if="recentVisits.length === 0">
                        <td colspan="5" class="px-6 py-8 text-center text-gray-500">Belum ada data kunjungan.</td>
                    </tr>
                    <tr v-for="visit in recentVisits" :key="visit.id" class="hover:bg-white/[0.02] transition-colors group">
                        <td class="px-6 py-4 whitespace-nowrap">
                            <div class="text-white font-medium">{{ new Date(visit.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) }}</div>
                            <div class="text-xs text-gray-600 group-hover:text-gray-500 transition-colors">{{ new Date(visit.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }) }}</div>
                        </td>
                        <td class="px-6 py-4">
                            <div class="flex items-center gap-2">
                                <span class="text-base opacity-70">🌍</span>
                                <div>
                                    <div class="text-gray-300 group-hover:text-white transition-colors">{{ visit.city || 'Unknown' }}</div>
                                    <div class="text-xs text-gray-600 group-hover:text-gray-500 transition-colors">{{ visit.country || 'Unknown Network' }}</div>
                                </div>
                            </div>
                        </td>
                        <td class="px-6 py-4">
                            <div class="flex items-center gap-2">
                                <Icon 
                                    :icon="visit.device_type === 'mobile' ? 'ph:device-mobile' : 'ph:monitor'" 
                                    class="text-lg text-gray-600 group-hover:text-white transition-colors"
                                />
                                <div>
                                    <div class="text-gray-300 group-hover:text-white transition-colors">{{ visit.os }}</div>
                                    <div class="text-xs text-gray-600 group-hover:text-gray-500 transition-colors">{{ visit.browser }}</div>
                                </div>
                            </div>
                        </td>
                        <td class="px-6 py-4">
                            <span class="px-2 py-1 rounded bg-white/[0.05] border border-white/[0.05] text-xs font-mono text-gray-400 group-hover:text-white group-hover:border-white/[0.1] transition-all">
                                {{ visit.path }}
                            </span>
                        </td>
                        <td class="px-6 py-4">
                            <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-white/[0.05] text-gray-300 border border-white/[0.1] shadow-[0_0_10px_rgba(255,255,255,0.02)]">
                                Visited
                            </span>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
  </div>
</template>

