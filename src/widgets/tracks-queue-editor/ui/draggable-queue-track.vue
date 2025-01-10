<script setup lang="ts">
import { ref } from 'vue'
import { TrackItem } from '@/entities/tracks'
import { LoadedQueueItem, QueueItem } from '@/entities/tracks-queue/model/queue-item'
import SwipableElement from '@/shared/ui/swipable-element.vue'
import DragAndDropItem from '@/shared/ui/drag-and-drop/drag-and-drop-item.vue'

defineProps<{
    queueItem: LoadedQueueItem
    trackNumber: number
    currentTrack: boolean
    allQueueItems: QueueItem[]
}>()

const emit = defineEmits<{
    (event: 'move-before', itemToMoveId: string, beforeItemId: string): void
    (event: 'delete'): void
}>()

const dragged = ref(false)
</script>

<template>
    <DragAndDropItem
        v-model:dragged="dragged"
        :id="`${queueItem.id}`"
        :key="queueItem.id"
        @move-before="
            (itemToMoveId: string, beforeItemId: string) =>
                emit('move-before', itemToMoveId, beforeItemId)
        "
    >
        <SwipableElement
            @swipe="emit('delete')"
            :swipe-enabled="!dragged && !currentTrack"
        >
            <TrackItem
                :track-number="trackNumber"
                :track="queueItem.track"
                :queue-item-id="queueItem.id"
                :playing-options="{ queueItemToPlay: queueItem }"
                compact
                class="pr-0"
            >
                <template #append>
                    <VBtn
                        v-show="!currentTrack"
                        title="Delete from queue"
                        variant="text"
                        size="32px"
                        icon
                        :class="{ 'd-none d-sm-block': !currentTrack }"
                        @click.stop="emit('delete')"
                    >
                        <VIcon icon="mdi-playlist-remove" size="22px" />
                    </VBtn>
                </template>
            </TrackItem>

            <template #pop-up-on-swipe>
                <VIcon icon="mdi-delete" />
                Delete
            </template>
        </SwipableElement>
    </DragAndDropItem>
</template>

<style scoped></style>
