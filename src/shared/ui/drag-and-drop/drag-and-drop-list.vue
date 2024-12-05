<script setup lang="ts">
import { ref } from 'vue'

const dragAndDropListElement = ref<HTMLElement>()
</script>

<template>
    <div class="drag-and-drop-list position-relative" ref="dragAndDropListElement">
        <slot :dragAndDropListElement="dragAndDropListElement"></slot>
    </div>
</template>

<style scoped></style>
