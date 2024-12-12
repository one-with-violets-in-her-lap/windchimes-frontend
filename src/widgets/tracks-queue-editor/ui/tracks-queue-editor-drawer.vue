<script setup lang="ts">
import { computed, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useLazyTracksQuery } from '@/widgets/tracks-queue-editor/api/tracks-query'
import { insertLoadedTracks } from '@/widgets/tracks-queue-editor/model/insert-loaded-tracks'
import DraggableQueueTracksList from '@/widgets/tracks-queue-editor/ui/draggable-queue-tracks-list.vue'
import {
    clearQueue,
    shuffleQueue,
    useTracksQueueStore,
} from '@/entities/tracks-queue'
import { PlaylistTrack, TRACKS_PORTION_SIZE } from '@/entities/tracks'
import ResponsiveDrawer from '@/shared/ui/responsive-drawer.vue'
import PaginatedContent from '@/shared/ui/paginated-content.vue'

defineProps<{
    openButtonVisible: boolean
}>()

const opened = ref(false)

const { tracksQueue, currentTrack } = storeToRefs(useTracksQueueStore())

const loadedTracks = computed(() => {
    const firstNotLoadedTrackIndex = tracksQueue.value.findIndex(
        track => track.__typename === 'TrackReferenceGraphQL',
    )

    return tracksQueue.value.slice(
        0,
        firstNotLoadedTrackIndex === -1 ? undefined : firstNotLoadedTrackIndex,
    ) as PlaylistTrack[]
})

const tracksQuery = useLazyTracksQuery()

async function loadMoreTracks() {
    const queuePartToLoad = {
        startIndex: loadedTracks.value.length,
        endIndex: loadedTracks.value.length + TRACKS_PORTION_SIZE,
    }

    const trackReferencesToLoad = tracksQueue.value
        .slice(queuePartToLoad.startIndex, queuePartToLoad.endIndex)
        .map(trackReference => ({
            id: trackReference.id,
            platform: trackReference.platform,
            platformId: trackReference.platformId,
        }))

    if (!tracksQuery.result.value && !tracksQuery.error.value) {
        const result = await tracksQuery.load(null, {
            trackReferences: trackReferencesToLoad,
        })

        if (result && result.tracks.__typename === 'LoadedTracksResponseGraphQL') {
            tracksQueue.value = insertLoadedTracks(
                tracksQueue.value,
                queuePartToLoad,
                result.tracks.items,
            )
        }
    } else {
        const result = await tracksQuery.fetchMore({
            variables: {
                trackReferences: trackReferencesToLoad,
            },
        })

        if (result?.data.tracks.__typename === 'LoadedTracksResponseGraphQL') {
            tracksQueue.value = insertLoadedTracks(
                tracksQueue.value,
                queuePartToLoad,
                result.data.tracks.items,
            )
        }
    }
}
</script>

<template>
    <div>
        <Transition name="scale-up">
            <VBtn
                icon="mdi-playlist-play"
                elevation="2"
                border
                size="46px"
                class="open-tracks-queue-button"
                v-show="openButtonVisible && !opened"
                title="Tracks queue"
                @click.stop="opened = true"
            />
        </Transition>

        <ResponsiveDrawer
            v-model:opened="opened"
            fixed-height="70%"
            class="overflow-y-hidden"
            draggable="false"
        >
            <PaginatedContent
                :items-loaded="loadedTracks.length"
                :total-items="tracksQueue.length"
                @load-more="loadMoreTracks"
            >
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
                            tracksQueue = clearQueue(tracksQueue, currentTrack?.id)
                        "
                    >
                        Clear
                    </VBtn>

                    <VBtn
                        prepend-icon="mdi-shuffle"
                        variant="outlined"
                        @click="
                            tracksQueue = shuffleQueue(tracksQueue, currentTrack?.id)
                        "
                    >
                        Shuffle
                    </VBtn>
                </VSheet>

                <DraggableQueueTracksList
                    v-model:all-queue-tracks="tracksQueue"
                    :current-track-id="currentTrack?.id"
                    :loaded-tracks="loadedTracks"
                />
            </PaginatedContent>
        </ResponsiveDrawer>
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
