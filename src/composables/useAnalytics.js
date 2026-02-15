import { ref, onMounted, onUnmounted } from 'vue'
import { supabase } from '../lib/supabase'
import { UAParser } from 'ua-parser-js'

export function useAnalytics() {
    const isTracking = ref(false)

    // State global untuk sesi ini
    let currentVisitId = null
    let sessionStartTime = 0
    let accumulatedTime = 0 // Untuk menyimpan waktu jika user minimize lalu kembali lagi
    let maxScrollDepth = 0

    const generateVisitorId = () => {
        let vid = localStorage.getItem('visitor_id')
        if (!vid) {
            vid = crypto.randomUUID()
            localStorage.setItem('visitor_id', vid)
        }
        return vid
    }

    const trackVisit = async () => {
        if (isTracking.value) return
        isTracking.value = true
        sessionStartTime = Date.now() // Mulai catat waktu

        try {
            const visitorId = generateVisitorId()

            let ipData = {}
            try {
                const res = await fetch('https://ipapi.co/json/')
                if (res.ok) ipData = await res.json()
            } catch (e) {
                console.warn('IP tracking blocked by client')
            }

            const parser = new UAParser()
            const result = parser.getResult()
            const urlParams = new URLSearchParams(window.location.search)

            const visitData = {
                visitor_id: visitorId,
                ip_address: ipData.ip || null,
                city: ipData.city || null,
                country: ipData.country_name || null,
                region: ipData.region || null,
                isp: ipData.org || null,
                user_agent: navigator.userAgent,
                browser: `${result.browser.name || ''} ${result.browser.version || ''}`.trim() || 'Unknown',
                os: `${result.os.name || ''} ${result.os.version || ''}`.trim() || 'Unknown',
                device_type: result.device.type || 'Desktop',
                referrer: document.referrer || 'Direct',
                path: window.location.pathname,
                utm_source: urlParams.get('utm_source') || 'Organic',
                screen_resolution: `${window.screen.width}x${window.screen.height}`
            }

            // Simpan baris baru dan ambil ID-nya
            const { data, error } = await supabase
                .from('analytics_visits')
                .insert(visitData)
                .select('id') // Hanya ambil ID agar lebih cepat
                .single()

            if (error) throw error

            if (data) {
                currentVisitId = data.id
                setupActivityListeners()
            }

        } catch (err) {
            console.error('Analytics tracking failed:', err)
        } finally {
            setTimeout(() => { isTracking.value = false }, 2000)
        }
    }

    // --- TRACKING BEHAVIOR ---

    const calculateScroll = () => {
        // Gunakan requestAnimationFrame agar tidak membebani performa scroll UI
        window.requestAnimationFrame(() => {
            const documentHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight
            if (documentHeight > 0) {
                const scrollPercent = Math.round((window.scrollY / documentHeight) * 100)
                if (scrollPercent > maxScrollDepth) {
                    maxScrollDepth = scrollPercent > 100 ? 100 : scrollPercent // Cap di 100%
                }
            }
        })
    }

    // Fungsi paling krusial: Mengirim data terakhir secara paksa
    const sendExitPing = () => {
        if (!currentVisitId) return

        // Hitung total waktu (waktu sebelumnya + waktu aktif sekarang)
        const currentActiveTime = sessionStartTime ? (Date.now() - sessionStartTime) : 0
        const totalDurationSeconds = Math.round((accumulatedTime + currentActiveTime) / 1000)

        // Hanya kirim jika durasi masuk akal (minimal 1 detik)
        if (totalDurationSeconds < 1) return

        const payload = {
            session_duration_seconds: totalDurationSeconds,
            scroll_depth_percent: maxScrollDepth
        }

        /* LEVEL UP: Menggunakan metode fetch native dengan 'keepalive: true'.
           Browser modern akan memastikan request ini tetap selesai dikirim 
           BAHKAN SETELAH tab ditutup/hancur. Ini jauh lebih reliable 
           daripada mengandalkan async supabase.update() saat tab sekarat.
        */
        const supaUrl = import.meta.env.VITE_SUPABASE_URL // Sesuaikan nama variabel .env kamu
        const supaKey = import.meta.env.VITE_SUPABASE_ANON_KEY

        if (supaUrl && supaKey) {
            fetch(`${supaUrl}/rest/v1/analytics_visits?id=eq.${currentVisitId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'apikey': supaKey,
                    'Authorization': `Bearer ${supaKey}`
                },
                body: JSON.stringify(payload),
                keepalive: true // INI KUNCINYA
            }).catch(e => console.error('Exit ping failed', e))
        } else {
            // Fallback jika tidak pakai ENV (kurang disarankan, tapi tetap dicoba)
            supabase.from('analytics_visits').update(payload).eq('id', currentVisitId)
        }
    }

    const handleVisibilityChange = () => {
        if (document.visibilityState === 'hidden') {
            // User pindah tab / minimize browser: Kirim data sementara & akumulasikan waktu
            sendExitPing()
            accumulatedTime += (Date.now() - sessionStartTime)
            sessionStartTime = 0 // Pause stopwatch
        } else {
            // User kembali ke tab: Lanjutkan stopwatch
            sessionStartTime = Date.now()
        }
    }

    const setupActivityListeners = () => {
        window.addEventListener('scroll', calculateScroll, { passive: true }) // passive: true untuk scroll mulus
        document.addEventListener('visibilitychange', handleVisibilityChange)

        // pagehide lebih reliable dari beforeunload di browser modern (terutama iOS/Safari)
        window.addEventListener('pagehide', sendExitPing)
    }

    // Cleanup untuk mencegah memory leak jika komponen di-unmount tanpa menutup browser (SPA routing)
    onUnmounted(() => {
        if (currentVisitId) {
            sendExitPing()
            window.removeEventListener('scroll', calculateScroll)
            document.removeEventListener('visibilitychange', handleVisibilityChange)
            window.removeEventListener('pagehide', sendExitPing)
        }
    })

    return { trackVisit }
}