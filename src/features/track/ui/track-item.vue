<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useApolloClient } from '@vue/apollo-composable'
import { queryTrackAudioFile } from '@/shared/api/audio-file-query'
import type { PlaylistTrack } from '@/shared/model/track'
import { usePlayerStore } from '@/shared/model/player'
import { getFormattedTimeFromSeconds } from '@/shared/model/get-formatted-time-from-seconds'

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
        :subtitle="
            `${trackNumber} · ` +
            `${getFormattedTimeFromSeconds(track.secondsDuration)}`
        "
        lines="two"
        :prepend-avatar="track.pictureUrl || undefined"
    >
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
