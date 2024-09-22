<script setup lang="ts">
import { ref } from 'vue'
import { useIntersectionObserver } from '@vueuse/core'

withDefaults(
    defineProps<{
        itemsLoaded: number
        totalItems: number
        loadingIndicatorClasses?: string
    }>(),
    { loadingIndicatorClasses: '' },
)

const emit = defineEmits<{
    (event: 'load-more'): void
}>()

const loadMoreTriggerElement = ref<HTMLElement>()
useIntersectionObserver(loadMoreTriggerElement, entries => {
    if (entries[0].isIntersecting) {
        emit('load-more')
    }
})
</script>

<template>
    <div>
        <slot></slot>

        <VProgressCircular
            v-if="itemsLoaded < totalItems"
            ref="loadMoreTriggerElement"
            indeterminate
            class="mt-3 mb-2"
            :class="loadingIndicatorClasses"
            size="40"
        ></VProgressCircular>
    </div>
</template>

<style scoped></style>
