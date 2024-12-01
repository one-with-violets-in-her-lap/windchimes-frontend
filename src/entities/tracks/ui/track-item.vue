<script setup lang="ts">
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useApolloClient } from '@vue/apollo-composable'
import { usePlayerStore } from '@/features/player'
import { queryTrackAudioFile } from '@/entities/tracks/api/audio-file-query'
import { type PlaylistTrack } from '@/entities/tracks/model/track'
import TrackOptionsDropdown from '@/entities/tracks/ui/track-options-dropdown.vue'
import { useTracksQueueStore } from '@/entities/tracks-queue'
import { TrackReferenceGraphQl } from '@/shared/model/graphql-generated-types/graphql'
import DurationTimestamp from '@/shared/ui/duration-timestamp.vue'

const props = defineProps<{
    track: PlaylistTrack
    trackNumber: number
    compact?: boolean
    /**
     * all tracks of playlist in which current track is located
     *
     * this prop is needed to construct a next tracks queue when the
     * track is played
     */
    allPlaylistTracks: (TrackReferenceGraphQl | PlaylistTrack)[]
}>()

const { client: apolloClient } = useApolloClient()

const playerStore = usePlayerStore()
const { currentTrack, paused } = storeToRefs(playerStore)
const { play, pause } = playerStore

const { tracksQueue } = storeToRefs(useTracksQueueStore())

const isCurrentTrack = computed(() => currentTrack.value?.id === props.track.id)
const playing = computed(() => isCurrentTrack.value && !paused.value)

async function playTrack() {
    if (isCurrentTrack.value) {
        play()
        return
    }

    const response = await queryTrackAudioFile(apolloClient, props.track)

    if (response.data.trackAudioFile?.__typename === 'TrackAudioFileGraphQL') {
        tracksQueue.value = props.allPlaylistTracks

        play({
            ...props.track,
            trackAudioFileUrl: response.data.trackAudioFile.url,
        })
    } else if (response.data.trackAudioFile?.__typename === 'ErrorGraphQL') {
        console.error(response.data.trackAudioFile.explanation)
    } else {
        console.error(response.error)
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
                v-bind="{ ...propsForHoverEffect, ...$attrs }"
                @click="playing ? pause() : playTrack()"
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
                            class="d-flex justify-center align-center"
                            z-index="0"
                        >
                            <VIcon
                                :icon="
                                    isCurrentTrack && playing
                                        ? 'mdi-pause'
                                        : 'mdi-play'
                                "
                                color="background"
                            />
                        </VOverlay>
                    </div>
                </template>

                <template #append>
                    <TrackOptionsDropdown :track />

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
