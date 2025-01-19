<script setup lang="ts">
import { User, useAuth0 } from '@auth0/auth0-vue'
import { computed } from 'vue'
import { useDisplay } from 'vuetify'

import { PlayPlaylistButton } from '@/features/playlist-actions'

import { PlaylistCard } from '@/entities/playlists'

import { PlaylistsListItemFragment } from '@/shared/model/graphql-generated-types/graphql'

const props = withDefaults(
    defineProps<{
        playlists?: PlaylistsListItemFragment[]
        noPlaylistsMessage?: string
    }>(),
    {
        noPlaylistsMessage: 'No playlists were found',
        playlists: undefined,
    },
)

const { smAndUp, mdAndUp, lgAndUp } = useDisplay()

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

const { user } = useAuth0()
function checkIfUserOwnsPlaylist(playlist: PlaylistsListItemFragment) {
    return user.value && user.value.sub === playlist.ownerUserId
}
</script>

<template>
    <Transition name="slide-left" appear>
        <VRow v-if="playlists && playlists.length > 0" class="playlists-row">
            <VCol
                v-for="playlist in playlists"
                :key="playlist.id"
                :cols="columnsCount"
            >
                <PlaylistCard
                    :playlist="playlist"
                    :hide-publicly-available-playlist-note="
                        !checkIfUserOwnsPlaylist(playlist)
                    "
                    class="h-100"
                >
                    <template #append-playlist-action-buttons>
                        <PlayPlaylistButton :playlist-id="playlist.id" />
                    </template>
                </PlaylistCard>
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
