<script setup lang="ts">
import { ref, watch } from 'vue'

import { LoadedTrackGraphQl } from '@/shared/model/graphql-generated-types/graphql'

import { type SearchState, searchTracksInPlaylist } from '../model/search'

const props = defineProps<{
    loadedTracks: (LoadedTrackGraphQl | null)[]
}>()

const searchState = defineModel<SearchState>('searchState', { required: true })

const searchQuery = ref<string | null>(null)
watch(searchQuery, handleSearch)

function handleSearch() {
    if (searchQuery.value === null || searchQuery.value === '') {
        searchState.value = {
            enabled: false,
            filteredTracks: [],
        }
    } else {
        searchState.value = {
            enabled: true,
            filteredTracks: searchTracksInPlaylist(
                props.loadedTracks,
                searchQuery.value,
            ),
        }
    }
}
</script>

<template>
    <VTextField
        v-model.trim="searchQuery"
        rounded
        variant="outlined"
        hide-details
        clearable
        density="comfortable"
        label="Tracks search"
        placeholder="Track name or artist"
        prepend-inner-icon="mdi-magnify"
        class="w-full mb-3"
    />
</template>

<style scoped></style>
