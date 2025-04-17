<script setup lang="ts">
import { useApolloClient } from '@vue/apollo-composable'
import { storeToRefs } from 'pinia'
import { computed, ref } from 'vue'

import { usePlayerStore } from '@/features/player'

import { LoadedQueueItem, useTracksQueueStore } from '@/entities/tracks-queue'
import { queryTrackAudioFile } from '@/entities/tracks/api/audio-file-query'
import { type PlaylistTrack } from '@/entities/tracks/model/track'
import TrackOptionsDropdown from '@/entities/tracks/ui/track-options-dropdown.vue'

import {
    LoadedTrackFragment,
    PlaylistBasicInfoFragment,
    TrackReferenceToReadGraphQl,
} from '@/shared/model/graphql-generated-types/graphql'
import DurationTimestamp from '@/shared/ui/duration-timestamp.vue'
import { IgnoreTypename } from '@/shared/utils/graphql'
import { showTemporaryNotification } from '@/shared/utils/notifications'

class AudioFileObtainingError extends Error {}

class TrackPlayingNotConfiguredError extends Error {
    constructor() {
        super(
            "Can't play the track because playing is not configured in track " +
                "item component's `playingOptions` prop",
        )
    }
}

const props = defineProps<{
    track: PlaylistTrack
    trackNumber: number

    currentPlaylist?: IgnoreTypename<PlaylistBasicInfoFragment>

    compact?: boolean

    /**
     * ID of the queue item the track belongs to. Used to determine if the track is being
     * played right now
     *
     * If not specified, the id of the track is used
     */
    queueItemId?: number

    /**
     * Options that define how to play the track: play it a new queue or in an existing
     * queue item
     *
     * **If this prop is empty or not defined, error is thrown on play attempt**
     */
    playingOptions?: {
        /**
         * List of tracks that contains current track. If specified, the track is played in
         * the new queue constructed from this list
         */
        tracksToCreateNewQueueFrom?: (
            | LoadedTrackFragment
            | TrackReferenceToReadGraphQl
        )[]

        /**
         * Existing queue item which the track belongs to. If specified, the existing
         * queue item is played
         */
        queueItemToPlay?: LoadedQueueItem
    }
}>()

const { client: apolloClient } = useApolloClient()

const playerStore = usePlayerStore()
const { currentQueueItem, paused } = storeToRefs(playerStore)
const { play, pause } = playerStore

const tracksQueueStore = useTracksQueueStore()
const { createQueueItem } = tracksQueueStore
const { tracksQueue } = storeToRefs(tracksQueueStore)

const isCurrentTrack = computed(() =>
    props.queueItemId
        ? currentQueueItem.value?.id === props.queueItemId
        : currentQueueItem.value?.track.id === props.track.id,
)
const playing = computed(() => isCurrentTrack.value && !paused.value)

const audioFileLoading = ref(false)

async function getAudioFileUrl() {
    audioFileLoading.value = true

    const response = await queryTrackAudioFile(apolloClient, props.track)

    audioFileLoading.value = false

    if (response.data.trackAudioFile?.__typename === 'TrackAudioFileGraphQL') {
        return response.data.trackAudioFile.url
    } else if (response.data.trackAudioFile?.__typename === 'GraphQLApiError') {
        throw new AudioFileObtainingError(response.data.trackAudioFile.explanation)
    } else {
        throw new AudioFileObtainingError(response.error?.message)
    }
}

function playTrackInNewQueue(
    tracksToCreateNewQueueFrom: (LoadedTrackFragment | TrackReferenceToReadGraphQl)[],
    audioFileUrl: string,
) {
    const queueItemToPlay = createQueueItem(props.track)
    const allQueueItemsFromPlaylist = tracksToCreateNewQueueFrom.map(track =>
        createQueueItem(track),
    )

    const queueItemToPlayIndex = allQueueItemsFromPlaylist.findIndex(
        item => item.track.id === props.track.id,
    )
    allQueueItemsFromPlaylist[queueItemToPlayIndex] = queueItemToPlay

    tracksQueue.value = allQueueItemsFromPlaylist

    play({
        ...queueItemToPlay,
        audioFileUrl: audioFileUrl,
    })
}

function playQueueItem(queueItem: LoadedQueueItem, audioFileUrl: string) {
    play({
        ...queueItem,
        audioFileUrl: audioFileUrl,
    })
}

async function handleTrackPlaying() {
    if (isCurrentTrack.value) {
        play()
        return
    }

    try {
        const audioFileUrl = await getAudioFileUrl()

        if (props.playingOptions?.tracksToCreateNewQueueFrom) {
            playTrackInNewQueue(
                props.playingOptions.tracksToCreateNewQueueFrom,
                audioFileUrl,
            )
        } else if (props.playingOptions?.queueItemToPlay) {
            playQueueItem(props.playingOptions.queueItemToPlay, audioFileUrl)
        } else {
            throw new TrackPlayingNotConfiguredError()
        }
    } catch (error) {
        console.error(error)
        showTemporaryNotification('error', 'Failed to load track data')
    }
}
</script>

<template>
    <VHover>
        <template #default="{ isHovering, props: propsForHoverEffect }">
            <VListItem
                lines="two"
                class="px-3 py-2"
                :class="{ 'py-1': compact }"
                height="100"
                v-bind="{ ...propsForHoverEffect, ...$attrs }"
                @click="playing ? pause() : handleTrackPlaying()"
            >
                <template #title>
                    <div class="d-flex gc-1 align-center">
                        <VIcon
                            v-show="isCurrentTrack"
                            icon="mdi-equalizer"
                            size="20"
                            color="primary"
                            :class="{ 'pulse-animation': playing }"
                        />

                        <span
                            class="text-sm-body-1 text-body-2 text-truncate"
                            :class="{ 'text-primary': isCurrentTrack }"
                        >
                            {{ track.name }}
                        </span>
                    </div>
                </template>

                <template #subtitle>
                    <div class="text-sm-body-1 text-body-2 text-truncate mb-1">
                        {{ track.owner.name }}
                    </div>

                    <div class="d-flex gc-1 align-center">
                        {{ trackNumber }} ·

                        <DurationTimestamp
                            :seconds-duration="track.secondsDuration"
                            unstyled
                        />

                        ·

                        <VIcon
                            :icon="`mdi-${track.platform.toLowerCase()}`"
                            size="20px"
                        />
                    </div>
                </template>

                <template #prepend>
                    <div class="position-relative d-flex gc-3 mr-4 align-center">
                        <VAvatar
                            :image="track.pictureUrl || undefined"
                            icon="mdi-music"
                            :size="compact ? '30px' : '34px'"
                            color="surface-3"
                            tile
                            rounded
                        />

                        <VOverlay
                            contained
                            :model-value="isHovering === true || isCurrentTrack"
                            class="d-flex justify-center align-center rounded"
                            theme="light"
                            style="z-index: 0"
                        >
                            <VIcon
                                :icon="
                                    isCurrentTrack && playing
                                        ? 'mdi-pause'
                                        : 'mdi-play'
                                "
                                color="white"
                            />
                        </VOverlay>

                        <VOverlay
                            contained
                            :model-value="audioFileLoading"
                            class="d-flex justify-center align-center rounded"
                            theme="light"
                            style="z-index: 0"
                        >
                            <VProgressCircular
                                color="white"
                                size="small"
                                indeterminate
                            />
                        </VOverlay>
                    </div>
                </template>

                <template #append>
                    <TrackOptionsDropdown :track :current-playlist>
                        <template #activator="{ menuActivatorProps }">
                            <VBtn
                                v-bind="menuActivatorProps"
                                icon="mdi-dots-horizontal"
                                variant="text"
                                density="comfortable"
                                @click.stop
                            ></VBtn>
                        </template>
                    </TrackOptionsDropdown>

                    <slot name="append"></slot>
                </template>
            </VListItem>
        </template>
    </VHover>
</template>

<style scoped>
.pulse-animation {
    animation-name: pulse;
    animation-duration: 0.5s;
    animation-iteration-count: infinite;
    animation-direction: alternate;

    transition: transform 0.3s ease;
}

@keyframes pulse {
    0% {
        transform: scale(1);
    }

    100% {
        transform: scale(1.1);
    }
}
</style>
