<script setup lang="ts">
import { ref } from 'vue'

withDefaults(
    defineProps<{
        swipeEnabled?: boolean
    }>(),
    { swipeEnabled: true },
)

const emit = defineEmits<{
    (event: 'swipe'): void
}>()

const swipableElement = ref<HTMLDivElement>()

const touchStartX = ref<number>()
const touchX = ref<number>()

function handleTouchMove(eventWrapper: { originalEvent: TouchEvent }) {
    touchX.value = eventWrapper.originalEvent.touches[0].clientX
}

function handleTouchStart(eventWrapper: { originalEvent: TouchEvent }) {
    touchStartX.value = eventWrapper.originalEvent.touches[0].clientX
}
</script>

<template>
    <div
        class="position-relative"
        ref="swipableElement"
        v-touch="{
            right: () => (swipeEnabled ? emit('swipe') : null),
            move: handleTouchMove,
            end: () => ([touchX, touchStartX] = [undefined, undefined]),
            start: handleTouchStart,
        }"
    >
        <slot></slot>

        <div
            v-show="swipeEnabled && touchStartX"
            class="pop-up-on-swipe position-absolute h-100"
            :style="`left: ${touchX && touchStartX ? Math.min(touchX - touchStartX, 120) + 'px' : '-10px'};`"
        >
            <slot name="pop-up-on-swipe"></slot>
        </div>
    </div>
</template>

<style scoped>
.pop-up-on-swipe {
    width: 120px;
    transform: translateX(-100%);
    top: 0px;
}
</style>
