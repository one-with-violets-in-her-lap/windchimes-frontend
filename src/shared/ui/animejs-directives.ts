import anime from 'animejs'
import { Directive } from 'vue'

export const vAnime: Directive<HTMLElement, anime.AnimeParams> = {
    mounted(element, binding) {
        console.log(
            anime({
                targets: element,
                autoplay: true,
                ...binding.value,
                easing: 'linear'
            }),
        )
    },
    unmounted(element) {
        anime.remove(element)
    },
}
