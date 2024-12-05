<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { useElementSize, useMouseInElement } from '@vueuse/core'

const ITEM_BASE_ID = 'dragAndDropItem'
const DRAGGED_OVER_ITEM_CLASS = 'bg-surface-2'

const props = defineProps<{
    id: string
    dragAndDropParent: HTMLElement
}>()
const emit = defineEmits<{
    (event: 'move-before', itemToMoveId: string, beforeItemId: string): void
}>()

const dragged = defineModel<boolean>('dragged')
const dragAndDropItemElement = ref<HTMLElement>()

const { elementX: mouseX, elementY: mouseY } = useMouseInElement(
    props.dragAndDropParent,
)
const { width } = useElementSize(dragAndDropItemElement)

onMounted(() => {
    document.addEventListener('pointerup', handleDrop)
    document.addEventListener('pointermove', highlightIfDraggedOver)
})
onUnmounted(() => {
    document.removeEventListener('pointerup', handleDrop)
    document.removeEventListener('pointermove', highlightIfDraggedOver)
})

function handleDrag(event: Event) {
    dragged.value = true
    event.stopPropagation()
}

function handleDrop(event: PointerEvent) {
    if (dragged.value) {
        dragged.value = false

        const targetElement = document.elementFromPoint(event.clientX, event.clientY)

        const targetItem = targetElement?.closest('.drag-and-drop-item')

        if (!targetItem) {
            return
        }

        targetItem?.classList.remove(DRAGGED_OVER_ITEM_CLASS)

        emit('move-before', props.id, targetItem.id.split(ITEM_BASE_ID)[1])
    }
}

function highlightIfDraggedOver(event: PointerEvent) {
    if (dragged.value) {
        const targetElement = document.elementFromPoint(event.clientX, event.clientY)

        const targetItem = targetElement?.closest('.drag-and-drop-item')

        if (!targetItem) {
            return
        }

        if (ITEM_BASE_ID + props.id === targetItem.id) {
            return
        }

        for (const dragAndDropItem of props.dragAndDropParent.querySelectorAll(
            '.drag-and-drop-item',
        )) {
            dragAndDropItem.classList.remove(DRAGGED_OVER_ITEM_CLASS)
        }

        targetItem.classList.add(DRAGGED_OVER_ITEM_CLASS)
    }
}
</script>

<template>
    <VSheet
        class="drag-and-drop-item bg-transparent"
        :class="{ 'drag-and-drop-item-dragged': dragged }"
        :style="`top: ${mouseY}px; left: ${mouseX - width}px;`"
        :id="`${ITEM_BASE_ID}${id}`"
        ref="dragAndDropItemElement"
    >
        <slot></slot>

        <div
            class="drag-handle flex-shrink-0"
            @pointerdown="handleDrag"
            @touchstart.prevent
            @touchend.prevent
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
    opacity: 0.5;
    position: absolute;
}

.drag-handle:hover {
    cursor: move;
}
</style>
