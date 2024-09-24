<script setup lang="ts">
import { ref } from 'vue'

const dragAndDropListElement = ref<HTMLElement>()
</script>

<template>
    <TransitionGroup
        name="slide-left"
        tag="div"
        class="drag-and-drop-list position-relative"
        ref="dragAndDropListElement"
    >
        <slot :dragAndDropListElement="dragAndDropListElement"></slot>
    </TransitionGroup>
</template>

<style scoped></style>
