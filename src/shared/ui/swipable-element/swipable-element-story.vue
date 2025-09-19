<script setup lang="ts">
import SwipableElement from './swipable-element.vue'

withDefaults(
    defineProps<{
        swipeEnabled?: boolean
    }>(),
    { swipeEnabled: true },
)

defineEmits<{
    (event: 'swipe'): void
}>()

function handleSwipe() {
    alert('Swipe was detected')
}
</script>

<template>
    <div class="overflow-hidden rounded-lg">
        <SwipableElement @swipe="handleSwipe">
            <div class="bg-background pa-3 border rounded-lg text-h5">
                Swipe me via touchscreen
            </div>

            <template #pop-up-on-swipe> Action </template>
        </SwipableElement>
    </div>
</template>
