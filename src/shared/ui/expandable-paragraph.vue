<script setup lang="ts">
import { computed, ref } from 'vue'

const props = withDefaults(
    defineProps<{
        maxLinesWhenShrinked?: number
    }>(),
    { maxLinesWhenShrinked: 3 },
)

const expandableParagraphElement = ref<HTMLParagraphElement>()

const shrinked = ref(true)

const overflowing = computed(() => {
    if (!expandableParagraphElement.value) {
        return false
    }

    const lineHeight = window.getComputedStyle(
        expandableParagraphElement.value,
    ).lineHeight
    const linesCount =
        expandableParagraphElement.value.scrollHeight / Number.parseInt(lineHeight)

    return linesCount > props.maxLinesWhenShrinked
})
</script>

<template>
    <div>
        <p
            :class="{ 'paragraph-shrinked': shrinked }"
            ref="expandableParagraphElement"
        >
            <slot></slot>
        </p>

        <VBtn
            v-show="overflowing"
            :prepend-icon="shrinked ? 'mdi-arrow-down' : 'mdi-arrow-up'"
            variant="text"
            size="small"
            class="mt-2"
            @click="shrinked = !shrinked"
        >
            {{ shrinked ? 'Show more' : 'Show less' }}
        </VBtn>
    </div>
</template>

<style scoped>
.paragraph-shrinked {
    display: -webkit-box;
    -webkit-line-clamp: v-bind(maxLinesWhenShrinked);
    line-clamp: v-bind(maxLinesWhenShrinked);
    -webkit-box-orient: vertical;
    overflow: hidden;
}
</style>
