<script setup lang="ts">
import { ref } from 'vue'

import DragAndDropItem from '../drag-and-drop-item.vue'
import DragAndDropList from '../drag-and-drop-list.vue'

const items = ref(
    Array(10)
        .fill(null)
        .map((_, index) => ({ id: String(index), title: `Item ${index}` })),
)
function moveItemBefore(itemId: string, itemToMoveBeforeId: string) {
    const indexToMoveBefore = items.value.findIndex(
        item => item.id === itemToMoveBeforeId,
    )

    const targetItemIndex = items.value.findIndex(item => item.id === itemId)
    const targetItem = items.value[targetItemIndex]

    items.value.splice(targetItemIndex, 1)

    items.value.splice(indexToMoveBefore, 0, targetItem)
}
</script>

<template>
    <DragAndDropList
        :items
        :item-height="100"
        class="d-flex flex-column ga-4"
        @move-before="moveItemBefore"
    >
        <DragAndDropItem
            v-for="item in items"
            :id="item.id"
            :key="item.id"
            class="pa-3 bg-surface text-h5 rounded-lg d-flex items-center justify-space-between"
        >
            <div>
                {{ item.title }}
            </div>
        </DragAndDropItem>

        <template #dragged-item="{ draggedItem }">
            <div
                class="pa-3 bg-surface text-h5 rounded-lg"
                style="width: 1000px; left: 1000px"
            >
                {{ draggedItem.title }}
            </div>
        </template>
    </DragAndDropList>
</template>
