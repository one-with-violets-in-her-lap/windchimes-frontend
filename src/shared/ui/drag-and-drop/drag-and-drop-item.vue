<script setup lang="ts">
import { computed, inject } from 'vue'
import {
    DragAndDropContext,
    dragAndDropContextProvideKey,
    ITEM_BASE_ID
} from '@/shared/ui/drag-and-drop/drag-and-drop-context'

const props = defineProps<{
    id: string
}>()

const { draggedItemId, draggedOverItemId, handleDrag } = inject(
    dragAndDropContextProvideKey,
) as DragAndDropContext

const dragged = computed(() => draggedItemId.value === props.id)
const draggedOver = computed(() => draggedOverItemId.value === props.id)
</script>

<template>
    <VSheet
        :class="{
            'drag-and-drop-item-dragged': dragged,
            'bg-surface-2': draggedOver,
        }"
        :id="`${ITEM_BASE_ID}${id}`"
        class="drag-and-drop-item bg-transparent"
    >
        <slot></slot>

        <div
            class="drag-handle flex-shrink-0"
            @mousedown.stop="handleDrag(props.id)"
            @touchstart.prevent.stop="handleDrag(props.id)"
        >
            <slot name="drag-handle">
                <VIcon icon="mdi-drag" size="24px" />
            </slot>
        </div>
    </VSheet>
</template>

<style scoped>
.drag-and-drop-item {
    display: grid;
    grid-template-columns: 1fr 34px;
    align-items: center;
    user-select: none;
    transition:
        background-color 0.2s ease,
        transform 0.3s ease,
        opacity 0.3s ease;
}

.drag-and-drop-item-dragged {
    pointer-events: none;
    opacity: 0;
}

.drag-handle:hover {
    cursor: move;
}
</style>
