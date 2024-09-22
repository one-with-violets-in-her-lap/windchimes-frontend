<script setup lang="ts">
import { computed, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { usePlayerStore } from '@/features/player'
import { useLazyTracksQuery } from '@/features/tracks-queue-editor/api/tracks-query'
import { useTracksQueueActions } from '@/features/tracks-queue-editor/model/tracks-queue-actions'
import { DraggableQueueTracksList } from '@/entities/tracks-queue'
import { PlaylistTrack, TRACKS_PORTION_SIZE } from '@/entities/tracks'
import ResponsiveDrawer from '@/shared/ui/responsive-drawer.vue'
import PaginatedContent from '@/shared/ui/paginated-content.vue'

defineProps<{
    openButtonVisible: boolean
}>()

const opened = ref(false)

const { tracksQueue } = storeToRefs(usePlayerStore())
const { clearQueue, insertLoadedTracks, shuffleQueue } = useTracksQueueActions()

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
            insertLoadedTracks(queuePartToLoad, result.tracks.items)
        }
    } else {
        const result = await tracksQuery.fetchMore({
            variables: {
                trackReferences: trackReferencesToLoad,
            },
        })

        if (result?.data.tracks.__typename === 'LoadedTracksResponseGraphQL') {
            insertLoadedTracks(queuePartToLoad, result.data.tracks.items)
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

        <ResponsiveDrawer v-model:opened="opened" fixed-height="70%">
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
                        @click="clearQueue"
                    >
                        Clear
                    </VBtn>

                    <VBtn
                        prepend-icon="mdi-shuffle"
                        variant="outlined"
                        @click="shuffleQueue"
                    >
                        Shuffle
                    </VBtn>
                </VSheet>

                <DraggableQueueTracksList
                    v-model:all-queue-tracks="tracksQueue"
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
    bottom: 40px;
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
