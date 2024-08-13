<script setup lang="ts">
import DurationTimestamp from '@/shared/ui/duration-timestamp.vue'
import { storeToRefs } from 'pinia'
import { useApolloClient } from '@vue/apollo-composable'
import { queryTrackAudioFile } from '@/entities/track/api/audio-file-query'
import type { PlaylistTrack } from '@/entities/track/model/track'
import { usePlayerStore } from '@/entities/player/model/player-store'

const props = defineProps<{
    track: PlaylistTrack
    allPlaylistTracks: PlaylistTrack[]
    trackNumber: number
}>()

const { client: apolloClient } = useApolloClient()

const playerStore = usePlayerStore()
const { tracksQueue } = storeToRefs(playerStore)
const { play } = playerStore

async function playTrack() {
    const response = await queryTrackAudioFile(apolloClient, props.track)

    if (response.data.trackAudioFileUrl) {
        tracksQueue.value = props.allPlaylistTracks

        play({
            ...props.track,
            trackAudioFileUrl: response.data.trackAudioFileUrl,
        })
    } else {
        console.error(response.error?.message)
    }
}
</script>

<template>
    <VListItem
        prepend-icon="mdi-music"
        :title="track.name"
        lines="two"
        :prepend-avatar="track.pictureUrl || undefined"
    >
        <template #subtitle>
            {{ trackNumber }} ·
            <DurationTimestamp
                :seconds-duration="track.secondsDuration"
                unstyled
            />
        </template>

        <template #prepend>
            <VAvatar
                :image="track.pictureUrl || undefined"
                icon="mdi-music"
                class="mr-2"
                size="38px"
                color="surface-3"
                tile
                rounded
            />
            <VBtn
                icon="mdi-play"
                variant="flat"
                color="primary"
                size="38px"
                @click="playTrack"
            />
        </template>
    </VListItem>
</template>

<style scoped></style>
