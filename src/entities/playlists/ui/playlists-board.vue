<script setup lang="ts">
import { useDisplay } from 'vuetify'
import PlaylistCard from '@/entities/playlists/ui/playlist-card.vue'
import { PlaylistsListItemFragment } from '@/shared/model/graphql-generated-types/graphql'

const { smAndDown } = useDisplay()

withDefaults(
    defineProps<{
        playlists?: PlaylistsListItemFragment[]
        noPlaylistsMessage?: string
    }>(),
    { noPlaylistsMessage: 'No playlists were found' },
)
</script>

<template>
    <Transition name="slide-left" appear>
        <VRow v-if="playlists && playlists.length > 0" class="playlists-row">
            <VCol
                v-for="playlist in playlists"
                :key="playlist.id"
                :cols="smAndDown ? 12 : 4"
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
