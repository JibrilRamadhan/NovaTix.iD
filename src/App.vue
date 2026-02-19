<script setup>
import { useHead } from '@vueuse/head'
import { computed } from 'vue'
import { useLanguage } from './composables/useLanguage'

const { lang, useT } = useLanguage()
const seo = useT('seo')

// Schema.org JSON-LD for Professional Service
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "name": "NovaTix ID",
  "url": "https://novatixid.vercel.app",
  "logo": "https://novatixid.vercel.app/img/logo.png",
  "description": "Professional Web Development Services, SEO Optimization, and Coding Solutions.",
  "areaServed": ["ID", "US", "SG", "MY", "AU", "GB", "JP", "DE", "NL"],
  "knowsLanguage": ["id", "en"],
  "address": {
    "@type": "PostalAddress",
    "addressCountry": "ID"
  },
  "priceRange": "$$",
  "sameAs": [
    "https://www.instagram.com/novatix_id",
    "https://novatixid.vercel.app"
  ]
}

// Reactive SEO head — updates when language changes
useHead({
  title: computed(() => seo.value.title),
  htmlAttrs: computed(() => ({ lang: lang.value === 'id' ? 'id' : 'en' })),
  meta: [
    { name: 'description', content: computed(() => seo.value.description) },
    { name: 'keywords', content: 'web development agency, web development indonesia, hire developer, software house, coding services, jasa website, jasa coding, custom web app, SEO optimization, UI UX design, offshore development, vue.js developer, react developer, fullstack developer' },
    { name: 'author', content: 'NovaTix ID' },
    { name: 'robots', content: 'index, follow' },
    
    // Open Graph
    { property: 'og:type', content: 'website' },
    { property: 'og:locale', content: computed(() => lang.value === 'id' ? 'id_ID' : 'en_US') },
    { property: 'og:locale:alternate', content: computed(() => lang.value === 'id' ? 'en_US' : 'id_ID') },
    { property: 'og:url', content: 'https://novatixid.vercel.app/' },
    { property: 'og:title', content: computed(() => seo.value.ogTitle) },
    { property: 'og:description', content: computed(() => seo.value.ogDescription) },
    { property: 'og:image', content: 'https://novatixid.vercel.app/img/logo.png' },
    { property: 'og:site_name', content: 'NovaTix ID' },

    // Twitter Card
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: computed(() => seo.value.ogTitle) },
    { name: 'twitter:description', content: computed(() => seo.value.twitterDescription) },
    { name: 'twitter:image', content: 'https://novatixid.vercel.app/img/logo.png' },
  ],
  link: [
    { rel: 'icon', type: 'image/png', href: '/img/logo.png' },
    { rel: 'canonical', href: 'https://novatixid.vercel.app/' },
    { rel: 'alternate', hreflang: 'id', href: 'https://novatixid.vercel.app/' },
    { rel: 'alternate', hreflang: 'en', href: 'https://novatixid.vercel.app/' },
    { rel: 'alternate', hreflang: 'x-default', href: 'https://novatixid.vercel.app/' },
  ],
  script: [
    {
      type: 'application/ld+json',
      children: JSON.stringify(jsonLd)
    }
  ]
})
</script>
<template>
  <router-view />
</template>
<style>
::-webkit-scrollbar {
  display: none;
}
html {
  -ms-overflow-style: none;  
  scrollbar-width: none;  
}

/* Animasi untuk pergantian bahasa (fade-out, fade-in) */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Animasi untuk teks konten (slide & fade) */
.fade-up-enter-active,
.fade-up-leave-active {
  transition: all 0.25s ease-out;
}
.fade-up-enter-from {
  opacity: 0;
  transform: translateY(10px);
}
.fade-up-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>