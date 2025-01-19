<script setup lang="ts" generic="TItem extends { id: string | number }">
import { useEventListener, usePointer } from '@vueuse/core'
import { computed, provide, ref } from 'vue'

import {
    ITEM_BASE_ID,
    dragAndDropContextProvideKey,
} from '@/shared/ui/drag-and-drop/drag-and-drop-context'

const emit = defineEmits<{
    (event: 'move-before', itemToMoveId: string, beforeItemId: string): void
}>()

const props = defineProps<{
    items: TItem[]
}>()

const draggedItemId = ref<string | null>(null)
const draggedItemIndex = computed(() =>
    props.items.findIndex(item => `${item.id}` === draggedItemId.value),
)

const draggedOverItemId = ref<string | null>(null)

const { y: pointerY } = usePointer()

useEventListener('pointerup', handleDrop)

function handleDrop() {
    if (draggedItemId.value && draggedOverItemId.value) {
        emit('move-before', draggedItemId.value, draggedOverItemId.value)
    }

    draggedItemId.value = null
    draggedOverItemId.value = null
}

function handleDragOver(pointerX: number, pointerY: number) {
    if (!draggedItemId.value) {
        return
    }

    const targetElement = document.elementFromPoint(pointerX, pointerY)

    const targetItem = targetElement?.closest('.drag-and-drop-item')

    if (!targetItem) {
        draggedOverItemId.value = null
        return
    }

    draggedOverItemId.value = targetItem.id.split(ITEM_BASE_ID)[1]
}

function handleDrag(itemId: string) {
    draggedItemId.value = itemId
}

provide(dragAndDropContextProvideKey, {
    draggedItemId,

    draggedOverItemId,

    handleDrag,
})
</script>

<template>
    <div
        ref="element"
        class="drag-and-drop-list position-relative"
        draggable="false"
        @pointermove="event => handleDragOver(event.clientX, event.clientY)"
    >
        <slot></slot>

        <Teleport to="body">
            <div
                v-if="draggedItemIndex !== -1"
                :style="`top: ${pointerY - 20}px;`"
                class="dragged-item"
            >
                <slot
                    name="dragged-item"
                    :dragged-item="items[draggedItemIndex]"
                    :dragged-item-index="draggedItemIndex"
                ></slot>
            </div>
        </Teleport>
    </div>
</template>

<style scoped>
.dragged-item {
    pointer-events: none;
    opacity: 0.5;
    left: 20px;
    position: fixed;
    min-width: min(350px, 90%);
    z-index: 4000;

    cursor: grab;
}
</style>
