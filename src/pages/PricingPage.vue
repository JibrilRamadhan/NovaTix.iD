<script setup>
import Navbar from '../components/navbar.vue';
import Footer from '../components/footer.vue';
import { Icon } from '@iconify/vue';
import { supabase } from '../lib/supabase';
import { useScrollReveal } from '../composables/useScrollReveal';
import { useLanguage } from '../composables/useLanguage';
import { ref, onMounted, nextTick, computed, reactive } from 'vue';

const scrollReveal = useScrollReveal();
const { lang, useT } = useLanguage();
const t = useT('pricing');

const pricingPlans = ref([]);
const loading = ref(true);

// Reactive FAQ with isOpen state
const faqState = reactive([false, false, false, false, false]);

const faqs = computed(() => 
  (t.value.faqs || []).map((faq, i) => ({
    ...faq,
    isOpen: faqState[i]
  }))
);

// Reactive benefits with static icons
const benefitIcons = [
  'ph:clock-afternoon-bold',
  'ph:paint-brush-broad-bold',
  'ph:device-mobile-camera-bold',
  'ph:rocket-launch-bold',
  'ph:lock-key-bold',
  'ph:headset-bold',
];

const benefits = computed(() => 
  (t.value.benefits || []).map((b, i) => ({
    ...b,
    icon: benefitIcons[i]
  }))
);

const fetchPricing = async () => {
    try {
        const { data, error } = await supabase
            .from('pricing_packages')
            .select('*')
            .eq('is_visible', true)
            .order('display_order', { ascending: true })
            .order('created_at', { ascending: true })

        if (!error) {
            pricingPlans.value = data || []
            nextTick(() => {
                if (scrollReveal && scrollReveal.observe) {
                    scrollReveal.observe()
                }
            })
        }
    } catch (e) {
        console.error('Failed to fetch pricing:', e)
    } finally {
        loading.value = false
    }
}

const toggleFaq = (index) => {
    faqState[index] = !faqState[index];
}

onMounted(() => {
    fetchPricing();
})
</script>

<template>
  <div class="bg-[#0a0a0a] min-h-screen text-white font-sans selection:bg-indigo-500/30">
    <Navbar />

    <main class="pt-24 pb-20">
        
        <!-- Hero Section -->
        <section class="relative py-20 px-6 md:px-12 overflow-hidden text-center">
            <!-- Background effects -->
            <div class="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none"></div>

            <!-- Gradient Mask (Fade to Black) -->
            <div class="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-[#0a0a0a] to-transparent pointer-events-none z-20"></div>

            <div class="relative z-10 max-w-4xl mx-auto">
                <Transition name="fade" mode="out-in">
                  <span :key="t.heroLabel" data-reveal class="inline-block px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold tracking-widest uppercase mb-6">
                      {{ t.heroLabel }}
                  </span>
                </Transition>
                <Transition name="fade-up" mode="out-in">
                  <h1 :key="t.heroTitle" data-reveal data-delay="100" class="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
                      {{ t.heroTitle }} <br />
                      <span class="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">{{ t.heroTitleHighlight }}</span>
                  </h1>
                </Transition>
                <Transition name="fade-up" mode="out-in">
                  <p :key="t.heroDesc" data-reveal data-delay="200" class="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
                      {{ t.heroDesc }}
                  </p>
                </Transition>
            </div>
        </section>

        <!-- Pricing Cards -->
        <section class="px-6 md:px-12 max-w-7xl mx-auto mb-32 pt-20">
            <div v-if="loading" class="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div v-for="i in 3" :key="i" class="h-[500px] rounded-3xl border border-white/10 bg-white/5 animate-pulse"></div>
            </div>

            <div v-else class="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
                <div
                    v-for="(plan, index) in pricingPlans" 
                    :key="plan.id"
                    data-reveal
                    :data-delay="index * 100"
                    class="relative flex flex-col rounded-3xl border transition-all duration-500 group overflow-hidden bg-white/[0.02] hover:-translate-y-2"
                    :class="[
                        plan.is_popular 
                            ? 'border-indigo-500/50 shadow-2xl shadow-indigo-500/10 z-10 scale-105 md:-my-4' 
                            : 'border-white/[0.06] hover:bg-white/[0.04] hover:border-white/[0.1]'
                    ]"
                >
                    <!-- Popular Badge -->
                    <div v-if="plan.is_popular" class="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500"></div>
                    <div v-if="plan.is_popular" class="absolute top-4 right-4">
                        <Transition name="fade" mode="out-in">
                          <span :key="t.badgeBestSeller" class="px-3 py-1 rounded-full bg-indigo-500 text-white text-[10px] font-bold uppercase tracking-wider shadow-lg shadow-indigo-500/25 flex items-center gap-1">
                              <Icon icon="ph:star-fill" /> {{ t.badgeBestSeller }}
                          </span>
                        </Transition>
                    </div>

                    <div class="p-8 flex-1 flex flex-col">
                        <h3 class="text-xl font-bold text-white mb-2">{{ plan.title }}</h3>
                        <p class="text-gray-400 text-sm mb-6 h-10 line-clamp-2">{{ plan.description }}</p>

                        <!-- Price -->
                        <div class="mb-8">
                            <div class="flex items-baseline gap-1">
                                <span class="text-4xl lg:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400 font-shlomo-stam">
                                    {{ plan.price }}
                                </span>
                                <span class="text-gray-500 text-sm font-medium">{{ plan.period }}</span>
                            </div>
                        </div>

                        <!-- Features -->
                        <div class="space-y-4 mb-8 flex-1">
                            <div v-for="feature in (plan.features || [])" :key="feature" class="flex items-start gap-3 text-sm text-gray-300">
                                <div class="mt-0.5 p-0.5 rounded-full bg-indigo-500/20 text-indigo-400">
                                    <Icon icon="ph:check-bold" class="text-xs" />
                                </div>
                                <span>{{ feature }}</span>
                            </div>
                        </div>

                        <!-- CTA Button -->
                        <a 
                            href="https://wa.me/6281330659888?text=Halo%20Novatix!%20Saya%20tertarik%20dengan%20paket%20website"
                            target="_blank"
                            class="w-full py-4 rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-2 group-hover:gap-3"
                            :class="plan.is_popular
                                ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/25' 
                                : 'bg-white text-black hover:bg-gray-200'"
                        >
                            <Transition name="fade" mode="out-in">
                              <span :key="t.btnSelectPlan">{{ t.btnSelectPlan }}</span>
                            </Transition>
                            <Icon icon="ph:arrow-right-bold" />
                        </a>
                    </div>
                </div>
            </div>
        </section>

        <!-- Why Choose Us -->
        <section class="px-6 md:px-12 max-w-7xl mx-auto mb-32">
            <div class="text-center mb-16">
                <Transition name="fade-up" mode="out-in">
                  <h2 :key="t.whyTitle" data-reveal class="text-3xl md:text-4xl font-bold mb-4">{{ t.whyTitle }}</h2>
                </Transition>
                <Transition name="fade-up" mode="out-in">
                  <p :key="t.whyDesc" data-reveal data-delay="100" class="text-gray-400">{{ t.whyDesc }}</p>
                </Transition>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div 
                    v-for="(benefit, index) in benefits" 
                    :key="index"
                    data-reveal
                    :data-delay="index * 100"
                    class="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.04] transition-colors"
                >
                    <div class="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 text-2xl mb-4">
                        <Icon :icon="benefit.icon" />
                    </div>
                    <h3 class="text-lg font-bold text-white mb-2">{{ benefit.title }}</h3>
                    <p class="text-gray-400 text-sm leading-relaxed">{{ benefit.desc }}</p>
                </div>
            </div>
        </section>

        <!-- FAQ Section -->
        <section class="px-6 md:px-12 max-w-3xl mx-auto mb-32">
            <div class="text-center mb-12">
                <Transition name="fade-up" mode="out-in">
                  <h2 :key="t.faqTitle" data-reveal class="text-3xl md:text-4xl font-bold mb-4">{{ t.faqTitle }}</h2>
                </Transition>
                <Transition name="fade-up" mode="out-in">
                  <p :key="t.faqDesc" data-reveal data-delay="100" class="text-gray-400">{{ t.faqDesc }}</p>
                </Transition>
            </div>

            <div class="space-y-4">
                <div 
                    v-for="(faq, index) in faqs" 
                    :key="index"
                    data-reveal
                    :data-delay="index * 100"
                    class="rounded-2xl bg-white/[0.02] border border-white/[0.06] overflow-hidden"
                >
                    <button 
                        @click="toggleFaq(index)"
                        class="w-full flex items-center justify-between p-6 text-left hover:bg-white/[0.02] transition-colors"
                    >
                        <span class="font-bold text-white pr-8">{{ faq.question }}</span>
                        <Icon 
                            icon="ph:caret-down-bold" 
                            class="text-gray-400 transition-transform duration-300 transform"
                            :class="{ 'rotate-180': faq.isOpen }"
                        />
                    </button>
                    <div 
                        v-show="faq.isOpen"
                        class="px-6 pb-6 text-gray-400 text-sm leading-relaxed border-t border-white/[0.06] pt-4"
                    >
                        {{ faq.answer }}
                    </div>
                </div>
            </div>
        </section>

        <!-- CTA Final -->
        <section class="px-6 md:px-12 max-w-5xl mx-auto text-center pb-20">
            <div data-reveal class="relative p-12 rounded-3xl overflow-hidden bg-gradient-to-r from-indigo-900/40 to-purple-900/40 border border-indigo-500/20">
                <div class="relative z-10">
                    <Transition name="fade-up" mode="out-in">
                      <h2 :key="t.ctaTitle" class="text-3xl md:text-5xl font-bold text-white mb-6">{{ t.ctaTitle }}</h2>
                    </Transition>
                    <Transition name="fade-up" mode="out-in">
                      <p :key="t.ctaDesc" class="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
                          {{ t.ctaDesc }}
                      </p>
                    </Transition>
                    <a 
                        href="https://wa.me/6281330659888?text=Halo%20Novatix!%20Saya%20ingin%20konsultasi%20website"
                        target="_blank"
                        class="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-white text-indigo-900 font-bold hover:bg-indigo-50 transition-colors shadow-lg shadow-indigo-500/10"
                    >
                        <Transition name="fade" mode="out-in">
                          <span :key="t.ctaBtn">{{ t.ctaBtn }}</span>
                        </Transition>
                        <Icon icon="ph:whatsapp-logo-bold" class="text-xl" />
                    </a>
                </div>
            </div>
        </section>

    </main>

    <Footer />
  </div>
</template>
