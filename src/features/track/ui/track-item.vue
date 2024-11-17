<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useApolloClient } from '@vue/apollo-composable'
import { queryTrackAudioFile, type PlaylistTrack } from '@/entities/tracks'
import { usePlayerStore } from '@/features/player'
import { TrackReferenceGraphQl } from '@/shared/model/graphql-generated-types/graphql'
import DurationTimestamp from '@/shared/ui/duration-timestamp.vue'
import { computed } from 'vue'

const props = defineProps<{
    track: PlaylistTrack
    allPlaylistTracks: (TrackReferenceGraphQl | PlaylistTrack)[]
    trackNumber: number
    compact?: boolean
}>()

const { client: apolloClient } = useApolloClient()

const playerStore = usePlayerStore()
const { tracksQueue, currentTrack, paused } = storeToRefs(playerStore)
const { play, pause } = playerStore

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
    <VListItem lines="two" :class="{ 'px-3 py-1': compact }">
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
                    class="text-sm-body-1 text-body-2"
                    :class="{ 'text-primary': isCurrentTrack }"
                >
                    {{ track.owner.name }} - {{ track.name }}
                </span>
            </div>
        </template>

        <template #subtitle>
            {{ trackNumber }} ·

            <DurationTimestamp
                :seconds-duration="track.secondsDuration"
                unstyled
                class="mr-2"
            />

            <VIcon :icon="`mdi-${track.platform.toLowerCase()}`" />
        </template>

        <template #prepend>
            <div class="d-flex gc-3 mr-4 align-center">
                <VAvatar
                    :image="track.pictureUrl || undefined"
                    icon="mdi-music"
                    :size="compact ? '30px' : '34px'"
                    color="surface-3"
                    tile
                    rounded
                />

                <VBtn
                    v-if="!compact"
                    :icon="playing ? 'mdi-pause' : 'mdi-play'"
                    :variant="isCurrentTrack ? 'tonal' : 'flat'"
                    color="primary"
                    size="38px"
                    @click="playing ? pause() : playTrack()"
                />
            </div>
        </template>

        <template #append>
            <slot name="append"></slot>
        </template>
    </VListItem>
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
