<script setup lang="ts">
import { computed } from 'vue'
import { useApolloClient } from '@vue/apollo-composable'
import type { PlaylistTrack } from '@/features/track/model/track'
import { usePlayerStore } from '@/shared/model/player'
import { queryTrackAudioFile } from '@/features/track/api/audio-file-query'

const props = defineProps<{
    track: PlaylistTrack
    trackNumber: number
}>()

const { client: apolloClient } = useApolloClient()
const { play } = usePlayerStore()

const duration = computed(() => {
    const minutes = String(
        Math.floor(props.track.secondsDuration / 60),
    ).padStart(2, '0')
    const seconds = String(
        Math.floor(props.track.secondsDuration % 60),
    ).padStart(2, '0')

    return `${minutes}:${seconds}`
})

async function playTrack() {
    const response = await queryTrackAudioFile(apolloClient, props.track)

    if (response.data.trackAudioFileUrl) {
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
        :subtitle="`${trackNumber} · ${duration}`"
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
