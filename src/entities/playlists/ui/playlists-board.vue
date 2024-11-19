<script setup lang="ts">
import { computed } from 'vue'
import { useDisplay } from 'vuetify'
import PlaylistCard from '@/entities/playlists/ui/playlist-card.vue'
import { PlaylistsListItemFragment } from '@/shared/model/graphql-generated-types/graphql'

const { smAndUp, mdAndUp, lgAndUp } = useDisplay()

withDefaults(
    defineProps<{
        playlists?: PlaylistsListItemFragment[]
        noPlaylistsMessage?: string
    }>(),
    { noPlaylistsMessage: 'No playlists were found' },
)

const columnsCount = computed(() => {
    if (lgAndUp.value) {
        return 3
    }

    if (mdAndUp.value) {
        return 4
    }

    if (smAndUp.value) {
        return 6
    }

    return 12
})
</script>

<template>
    <Transition name="slide-left" appear>
        <VRow v-if="playlists && playlists.length > 0" class="playlists-row">
            <VCol
                v-for="playlist in playlists"
                :key="playlist.id"
                :cols="columnsCount"
            >
                <PlaylistCard :playlist="playlist" class="h-100" />
            </VCol>
        </VRow>

        <p v-else>
            {{ noPlaylistsMessage }}
        </p>
    </Transition>
</template>

<style scoped>
.playlists-row {
    max-width: 1300px;
}
</style>
