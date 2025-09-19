<script setup lang="ts">
import { computed, ref, watch } from 'vue'

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

const SWIPE_TRIGGER_DISTANCE = 100

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

    const leftSwipeDistance = touchPosition.value.x - touchStartPosition.value.x

    if (leftSwipeDistance < MIN_HORIZONTAL_SWIPE_DISTANCE) {
        return POP_UP_INITIAL_X_POSITION
    }

    return Math.min(leftSwipeDistance, POP_UP_WIDTH)
})
const swipeTriggerDistanceReached = computed(
    () => swipePopUpPosition.value >= SWIPE_TRIGGER_DISTANCE && props.swipeEnabled,
)

watch(swipeTriggerDistanceReached, () => {
    if (swipeTriggerDistanceReached.value) {
        navigator.vibrate(45)
    }
})

function handleTouchMove(event: TouchEvent) {
    const touch = event.touches[0]
    touchPosition.value = {
        x: touch.clientX,
        y: touch.clientY,
    }

    if (touchStartPosition.value) {
        const verticalSwipeDistance = Math.abs(
            touchPosition.value.y - touchStartPosition.value.y,
        )

        if (verticalSwipeDistance > MAX_VERTICAL_SWIPE_DISTANCE) {
            console.log('reset')

            touchStartPosition.value = undefined
        }
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
    if (swipeTriggerDistanceReached.value) {
        emit('swipe')
    }

    touchPosition.value = undefined
    touchStartPosition.value = undefined
}
</script>

<template>
    <div
        ref="swipableElement"
        class="position-relative"
        @touchmove="handleTouchMove"
        @touchend="handleTouchEnd"
        @touchstart="handleTouchStart"
    >
        <slot></slot>

        <VSheet
            v-show="swipeEnabled"
            :style="`left: ${swipePopUpPosition}px;`"
            :color="swipeTriggerDistanceReached ? 'error' : 'primary'"
            class="pop-up-on-swipe"
            :class="{ 'pop-up-hide-animation': !touchStartPosition }"
        >
            <slot name="pop-up-on-swipe"></slot>
        </VSheet>
    </div>
</template>

<style scoped>
.pop-up-on-swipe {
    position: absolute;

    width: 120px;
    height: 100%;
    transform: translateX(-100%);
    border-radius: 2px;
    top: 0px;

    flex-direction: column;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 6px;

    font-weight: 500;
    font-size: 1rem;

    transition: background-color 0.3s ease;
}

.pop-up-hide-animation {
    transition: all 0.2s cubic-bezier(0.455, 0.03, 0.515, 0.955);
}
</style>
