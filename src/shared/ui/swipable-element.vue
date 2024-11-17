<script setup lang="ts">
import { computed, ref } from 'vue'

const POP_UP_WIDTH = 120
const POP_UP_INITIAL_X_POSITION = -10

/**
 * maximum of vertical touch offset, the swipe won't trigger when it is reached
 */
const MAX_VERTICAL_SWIPE_DISTANCE = 20

/**
 * minimum of horizontal touch offset after which swipe pop up starts to slide
 */
const MIN_HORIZONTAL_SWIPE_DISTANCE = 20

interface Position {
    x: number
    y: number
}

const props = withDefaults(
    defineProps<{
        swipeEnabled?: boolean
    }>(),
    { swipeEnabled: true },
)

const emit = defineEmits<{
    (event: 'swipe'): void
}>()

const swipableElement = ref<HTMLDivElement>()

const touchStartPosition = ref<Position>()
const touchPosition = ref<Position>()

const swipePopUpPosition = computed(() => {
    if (!touchPosition.value || !touchStartPosition.value) {
        return POP_UP_INITIAL_X_POSITION
    }

    const verticalSwipeDistance = Math.abs(
        touchPosition.value.y - touchStartPosition.value.y,
    )
    const leftSwipeDistance = touchPosition.value.x - touchStartPosition.value.x

    if (
        verticalSwipeDistance > MAX_VERTICAL_SWIPE_DISTANCE ||
        leftSwipeDistance < MIN_HORIZONTAL_SWIPE_DISTANCE
    ) {
        return POP_UP_INITIAL_X_POSITION
    }

    return Math.min(leftSwipeDistance, POP_UP_WIDTH)
})

function handleTouchMove(event: TouchEvent) {
    const touch = event.touches[0]
    touchPosition.value = {
        x: touch.clientX,
        y: touch.clientY,
    }
}

function handleTouchStart(event: TouchEvent) {
    const touch = event.touches[0]
    touchStartPosition.value = {
        x: touch.clientX,
        y: touch.clientY,
    }
}

function handleTouchEnd() {
    if (swipePopUpPosition.value >= 80 && props.swipeEnabled) {
        emit('swipe')
    }

    touchPosition.value = undefined
    touchStartPosition.value = undefined
}
</script>

<template>
    <div
        class="position-relative"
        ref="swipableElement"
        @touchmove="handleTouchMove"
        @touchend="handleTouchEnd"
        @touchstart="handleTouchStart"
    >
        <slot></slot>

        <div
            v-show="swipeEnabled && touchStartPosition"
            class="pop-up-on-swipe position-absolute h-100"
            :style="`left: ${swipePopUpPosition}px;`"
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
