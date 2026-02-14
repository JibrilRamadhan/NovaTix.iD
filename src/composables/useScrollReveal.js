import { onMounted, onUnmounted } from 'vue'

/**
 * Scroll reveal animation composable
 * Adds 'revealed' class to elements with [data-reveal] when they enter viewport
 * 
 * Usage in template:
 *   <div data-reveal>Fade in from bottom</div>
 *   <div data-reveal="left">Slide in from left</div>
 *   <div data-reveal="right">Slide in from right</div>
 *   <div data-reveal="scale">Scale up</div>
 *   <div data-reveal data-delay="200">With delay</div>
 */
export function useScrollReveal() {
    let observer = null

    onMounted(() => {
        observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const delay = entry.target.dataset.delay || 0
                        setTimeout(() => {
                            entry.target.classList.add('revealed')
                        }, Number(delay))
                        observer.unobserve(entry.target)
                    }
                })
            },
            {
                threshold: 0.1,
                rootMargin: '0px 0px -40px 0px'
            }
        )

        // Observe initial elements
        document.querySelectorAll('[data-reveal]').forEach(el => {
            observer.observe(el)
        })
    })

    onUnmounted(() => {
        if (observer) observer.disconnect()
    })

    const observe = () => {
        if (!observer) return
        setTimeout(() => {
            document.querySelectorAll('[data-reveal]:not(.revealed)').forEach(el => {
                observer.observe(el)
            })
        }, 100)
    }

    return { observe }
}
