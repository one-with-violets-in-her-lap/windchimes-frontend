<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { computed, ref } from 'vue'

import { useLazyTracksQuery } from '@/widgets/tracks-queue-editor/api/tracks-query'
import { insertLoadedTracks } from '@/widgets/tracks-queue-editor/model/insert-loaded-tracks'
import DraggableQueueTracksList from '@/widgets/tracks-queue-editor/ui/draggable-queue-tracks-list.vue'

import { TRACKS_PORTION_SIZE } from '@/entities/tracks'
import {
    LoadedQueueItem,
    clearQueue,
    shuffleQueue,
    useTracksQueueStore,
} from '@/entities/tracks-queue'

import DrawerWindow from '@/shared/ui/drawer-window.vue'

defineProps<{
    openButtonVisible: boolean
}>()

const opened = ref(false)

const { tracksQueue, currentQueueItemId } = storeToRefs(useTracksQueueStore())

const loadedTracks = computed(() => {
    const firstNotLoadedTrackIndex = tracksQueue.value.findIndex(
        item => item.track.__typename === 'TrackReferenceToReadGraphQL',
    )

    return tracksQueue.value.slice(
        0,
        firstNotLoadedTrackIndex === -1 ? undefined : firstNotLoadedTrackIndex,
    ) as LoadedQueueItem[]
})

const tracksQuery = useLazyTracksQuery()

async function loadMoreTracks() {
    const queuePartToLoad = {
        startIndex: loadedTracks.value.length,
        endIndex: loadedTracks.value.length + TRACKS_PORTION_SIZE,
    }

    const trackReferencesToLoad = tracksQueue.value
        .slice(queuePartToLoad.startIndex, queuePartToLoad.endIndex)
        .map(queueItem => ({
            id: queueItem.track.id,
            platform: queueItem.track.platform,
            platformId: queueItem.track.platformId,
        }))

    if (!tracksQuery.result.value && !tracksQuery.error.value) {
        const result = await tracksQuery.load(null, {
            trackReferences: trackReferencesToLoad,
        })

        if (result && result.loadedTracks.__typename === 'LoadedTracksWrapper') {
            tracksQueue.value = insertLoadedTracks(
                tracksQueue.value,
                queuePartToLoad,
                result.loadedTracks.items,
            )
        }
    } else {
        const result = await tracksQuery.fetchMore({
            variables: {
                trackReferences: trackReferencesToLoad,
            },
        })

        if (result?.data.loadedTracks.__typename === 'LoadedTracksWrapper') {
            tracksQueue.value = insertLoadedTracks(
                tracksQueue.value,
                queuePartToLoad,
                result.data.loadedTracks.items,
            )
        }
    }
}
</script>

<template>
    <div>
        <Transition name="scale-up">
            <VBtn
                v-show="openButtonVisible && !opened"
                icon="mdi-playlist-play"
                elevation="2"
                border
                size="46px"
                class="open-tracks-queue-button"
                title="Tracks queue"
                @click.stop="opened = true"
            />
        </Transition>

        <DrawerWindow
            v-model:opened="opened"
            fixed-height="70%"
            position-at-the-bottom-on-mobile
            class="d-flex flex-column h-100"
            draggable="false"
        >
            <div class="h-100">
                <VSheet
                    color="primary"
                    class="queue-action-buttons"
                    rounded
                    tag="header"
                >
                    <VBtn
                        prepend-icon="mdi-notification-clear-all"
                        variant="flat"
                        @click="
                            tracksQueue = clearQueue(tracksQueue, currentQueueItemId)
                        "
                    >
                        Clear
                    </VBtn>

                    <VBtn
                        prepend-icon="mdi-shuffle"
                        variant="outlined"
                        @click="
                            tracksQueue = shuffleQueue(
                                tracksQueue,
                                currentQueueItemId,
                            )
                        "
                    >
                        Shuffle
                    </VBtn>
                </VSheet>

                <DraggableQueueTracksList
                    v-model:all-queue-items="tracksQueue"
                    :current-queue-item-id="currentQueueItemId"
                    :loaded-queue-items="loadedTracks"
                >
                    <template #list-end>
                        <VProgressCircular
                            v-if="loadedTracks.length < tracksQueue.length"
                            v-intersect="loadMoreTracks"
                            indeterminate
                            class="mt-3 mb-2"
                            size="40"
                        ></VProgressCircular>
                    </template>
                </DraggableQueueTracksList>
            </div>
        </DrawerWindow>
    </div>
</template>

<style scoped>
.open-tracks-queue-button {
    position: fixed;
    right: 10px;
    bottom: 44px;
}

.tracks-queue-drawer {
    height: 70%;
}

.queue-action-buttons {
    display: flex;
    gap: 12px;
    padding: 10px 12px;
    position: sticky;
    top: 0;
    margin-right: 20px;
    margin-bottom: 12px;
    z-index: 2;
}

@media (max-width: 390px) {
    .queue-action-buttons {
        padding: 6px 10px;
    }
}
</style>
