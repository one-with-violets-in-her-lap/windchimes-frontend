<script setup lang="ts">
import { reactive } from 'vue'
import type { Track } from '@/types/track'

const foundTracks = reactive<{
    loading: boolean
    data: Track[] | null
}>({
    loading: true,
    data: null,
})

setTimeout(() => {
    foundTracks.data = [
        {
            platform: 'soundcloud',
            title: 'track546',
            author: {
                username: 'user2323',
            },
        },
    ]
    foundTracks.loading = false
}, 1000)
</script>

<template>
    <h1 class="page-heading">SEARCH</h1>

    <ul v-if="foundTracks.data !== null && !foundTracks.loading">
        <VCard
            v-for="track in foundTracks.data"
            :key="track.title"
            tag="li"
            :title="track.title"
            :subtitle="track.author.username"
            :text="`posted on ${track.platform}`"
            hover
            append-icon="mdi-music"
            color="surface-darken-1"
            variant="flat"
        >
        </VCard>
    </ul>

    <VProgressCircular
        v-else-if="foundTracks.loading"
        indeterminate
        :size="50"
    />
</template>

<style scoped></style>
