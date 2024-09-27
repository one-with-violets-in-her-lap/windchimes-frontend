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
    compact?: boolean
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
    <VListItem lines="two" :class="{ 'px-3 py-1': compact }">
        <template #title>
            <VTooltip
                v-model="titleTooltipVisible"
                :text="`${track.owner.name} - ${track.name}`"
                location="end center"
                class="text-sm-body-1 text-body-2"
            >
                <template #activator="{ props: activatorProps }">
                    <span
                        v-bind="activatorProps"
                        @pointerdown="titleTooltipVisible = true"
                        class="text-sm-body-1 text-body-2"
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
                    icon="mdi-play"
                    variant="flat"
                    color="primary"
                    size="38px"
                    @click="playTrack"
                />
            </div>
        </template>

        <template #append>
            <slot name="append"></slot>
        </template>
    </VListItem>
</template>

<style scoped></style>
