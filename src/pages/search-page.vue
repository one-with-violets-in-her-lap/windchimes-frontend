<script setup lang="ts">
import { reactive } from 'vue'
import { useRoute } from 'vue-router'

const foundTracks = reactive<{
    loading: boolean
    data: any[] | null
}>({
    loading: true,
    data: null,
})

const searchQuery = useRoute().query['query']?.toString()

fetch(
    `https://api-v2.soundcloud.com/search?q=${searchQuery}' +
        '&client_id=yTInTFyeJ10yiPJhRlQUbkBkQdWVyFpD&limit=100&offset=0`,
)
    .then(async response => {
        const data: { title?: string }[] = (await response.json()).collection
        foundTracks.data = data.map(resource => ({
            platform: 'soundcloud',
            author: { username: 'test' },
            title: resource.title || 'test',
        }))
        foundTracks.loading = false
    })
    .catch(error => {
        console.log('ERROR:', error)
    })
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
