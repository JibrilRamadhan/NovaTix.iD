import { ref } from 'vue'
import { supabase } from '../lib/supabase'
import { UAParser } from 'ua-parser-js'

export function useAnalytics() {
    const isTracking = ref(false)

    const generateVisitorId = () => {
        let vid = localStorage.getItem('visitor_id')
        if (!vid) {
            vid = crypto.randomUUID()
            localStorage.setItem('visitor_id', vid)
        }
        return vid
    }

    const trackVisit = async () => {
        if (isTracking.value) return // Prevent double firing
        isTracking.value = true

        try {
            // 1. Get Visitor ID (Device Fingerprint-ish)
            const visitorId = generateVisitorId()

            // 2. Get IP & Location Data
            let ipData = {}
            try {
                const res = await fetch('https://ipapi.co/json/')
                ipData = await res.json()
            } catch (e) {
                console.warn('Failed to fetch IP data (Adblocker?)', e)
            }

            // 3. Parse User Agent
            const parser = new UAParser()
            const result = parser.getResult()

            // 4. Send to Supabase
            const payload = {
                visitor_id: visitorId,
                ip_address: ipData.ip || null,
                city: ipData.city || null,
                country: ipData.country_name || null,
                region: ipData.region || null,
                isp: ipData.org || null,
                user_agent: navigator.userAgent,
                browser: `${result.browser.name} ${result.browser.version}`,
                os: `${result.os.name} ${result.os.version}`,
                device_type: result.device.type || 'desktop', // Default to desktop if undefined (common for PCs)
                referrer: document.referrer || 'Direct',
                path: window.location.pathname
            }

            const { error } = await supabase
                .from('analytics_visits')
                .insert(payload)

            if (error) console.error('Analytics Error:', error)

        } catch (err) {
            console.error('Tracking failed:', err)
        } finally {
            // Simple debounce/cooldown
            setTimeout(() => { isTracking.value = false }, 2000)
        }
    }

    return { trackVisit }
}
