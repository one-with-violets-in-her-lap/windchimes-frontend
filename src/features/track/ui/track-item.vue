<script setup lang="ts">
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useApolloClient } from '@vue/apollo-composable'
import gql from 'graphql-tag'
import { useCurrentTrackStore } from '@/shared/model/current-track'
import {
    Platform,
    type GetPlaylistWithTracksQuery,
    type GetTrackAudioFileUrlQuery,
    type GetTrackAudioFileUrlQueryVariables,
} from '@/shared/model/graphql-generated-types/graphql'

const props = defineProps<{
    track: NonNullable<
        GetPlaylistWithTracksQuery['playlist']
    >['tracks']['items'][0]
    trackNumber: number
}>()

const { client } = useApolloClient()
const { currentTrack } = storeToRefs(useCurrentTrackStore())

const duration = computed(() => {
    const minutes = String(
        Math.floor(props.track.secondsDuration / 60),
    ).padStart(2, '0')
    const seconds = String(
        Math.floor(props.track.secondsDuration % 60),
    ).padStart(2, '0')

    return `${minutes}:${seconds}`
})

async function play() {
    const audioFileQuery = gql`
        query GetTrackAudioFileUrl($platform: Platform!, $platformId: String!) {
            trackAudioFileUrl(platform: $platform, platformId: $platformId)
        }
    `

    const response = await client.query<
        GetTrackAudioFileUrlQuery,
        GetTrackAudioFileUrlQueryVariables
    >({
        query: audioFileQuery,
        variables: {
            platform: Platform.Soundcloud,
            platformId: props.track.platformId,
        },
    })

    if (response.data.trackAudioFileUrl) {
        currentTrack.value = props.track
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
            <VBtn icon="mdi-play" variant="flat" color="primary" size="38px" @click="play" />
        </template>
    </VListItem>
</template>

<style scoped></style>
