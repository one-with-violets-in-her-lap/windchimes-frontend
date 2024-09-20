<script setup lang="ts">
import DurationTimestamp from '@/shared/ui/duration-timestamp.vue'

import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useApolloClient } from '@vue/apollo-composable'
import { queryTrackAudioFile, type PlaylistTrack } from '@/entities/tracks'
import { usePlayerStore } from '@/features/player'
import { TrackReferenceGraphQl } from '@/shared/model/graphql-generated-types/graphql'

const props = defineProps<{
    track: PlaylistTrack
    allPlaylistTracks: (TrackReferenceGraphQl | PlaylistTrack)[]
    trackNumber: number
}>()

const { client: apolloClient } = useApolloClient()

const playerStore = usePlayerStore()
const { tracksQueue } = storeToRefs(playerStore)
const { play } = playerStore

const titleTooltipVisible = ref(false)

async function playTrack() {
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
    <VListItem
        prepend-icon="mdi-music"
        lines="two"
        :prepend-avatar="track.pictureUrl || undefined"
    >
        <template #title>
            <VTooltip
                v-model="titleTooltipVisible"
                :text="`${track.owner.name} - ${track.name}`"
                location="end center"
            >
                <template #activator="{ props: activatorProps }">
                    <span
                        v-bind="activatorProps"
                        @pointerdown="titleTooltipVisible = true"
                    >
                        {{ track.owner.name }} - {{ track.name }}
                    </span>
                </template>
            </VTooltip>
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
