<script setup lang="ts">
import { computed } from 'vue'
import type {
    GetPlaylistWithTracksQuery
} from '@/shared/model/graphql-generated-types/graphql'

const props = defineProps<{
    track: NonNullable<
        GetPlaylistWithTracksQuery['playlist']
    >['tracks']['items'][0]
    trackNumber: number
}>()

const duration = computed(() => {
    const minutes = String(Math.floor(props.track.secondsDuration / 60)).padStart(2, '0')
    const seconds = String(Math.floor(props.track.secondsDuration % 60)).padStart(2, '0')

    return `${minutes}:${seconds}`
})
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
            <VBtn icon="mdi-play" variant="flat" color="primary" size="38px" />
        </template>
    </VListItem>
</template>

<style scoped></style>
