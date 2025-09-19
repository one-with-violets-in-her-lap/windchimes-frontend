<script setup lang="ts">
import anime from 'animejs'
import { onMounted, ref } from 'vue'

const props = withDefaults(
    defineProps<{
        duration?: number
        shineDisabled?: boolean
    }>(),
    { duration: 650 },
)

const shineLightElement = ref<HTMLElement>()

onMounted(async () => {
    anime({
        targets: shineLightElement.value,
        left: '120%',
        autoplay: true,
        duration: props.duration,
        delay: 3150,
        loop: true,
        easing: 'easeInOutSine',
    })
})
</script>

<template>
    <div class="shine-effect-wrapper" :class="{ 'shine-disabled': shineDisabled }">
        <slot></slot>

        <div
            ref="shineLightElement"
            class="shine-light"
            :class="{ 'd-none': shineDisabled }"
        ></div>
    </div>
</template>

<style scoped>
.shine-effect-wrapper {
    position: relative;
    overflow: hidden;
}

.shine-light {
    content: '';
    position: absolute;
    top: 0px;
    left: 0px;
    transform: translateX(-130%);
    height: 100%;
    width: 30px;
    background-color: white;
    opacity: 0.6;
    filter: blur(14px);
}
</style>
