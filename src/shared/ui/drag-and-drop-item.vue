<script setup lang="ts">
import { ref } from 'vue'

const DATA_TRANSFER_KEY = 'item-id'

const props = defineProps<{
    id: string
}>()
const emit = defineEmits<{
    (event: 'swap', item1Id: string, item2Id: string): void
}>()

const draggedOver = ref(false)

function handleDrag(event: DragEvent) {
    if (event.dataTransfer) {
        event.dataTransfer.dropEffect = 'move'
        event.dataTransfer.effectAllowed = 'move'
        event.dataTransfer.setData(DATA_TRANSFER_KEY, props.id)
    }
}

function handleDrop(event: DragEvent) {
    if (event.dataTransfer && event.dataTransfer.getData(DATA_TRANSFER_KEY)) {
        const droppedItemId = event.dataTransfer.getData(DATA_TRANSFER_KEY)

        if (!droppedItemId) {
            return
        }

        draggedOver.value = false

        emit('swap', props.id, droppedItemId)
    }
}
</script>

<template>
    <VSheet
        draggable="true"
        class="draggable-item"
        :color="draggedOver ? 'surface-2' : 'transparent'"
        @dragstart="handleDrag"
        @drop="handleDrop"
        @dragover.prevent="draggedOver = true"
        @dragleave.prevent="draggedOver = false"
    >
        <slot></slot>
    </VSheet>
</template>

<style scoped>
.draggable-item {
    user-select: none;
    transition: background-color 0.2s ease, transform 0.3s ease;
}
</style>
