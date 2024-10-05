<script setup lang="ts">
import { computed } from 'vue'
import { useAuth0 } from '@auth0/auth0-vue'
import { usePlaylistsQuery } from '@/widgets/personal-playlists-list/api/playlists-query'
import { useCurrentAccountActions } from '@/features/account-menu/api/current-account-actions'
import PlaylistCreationDialog from '@/features/playlist-creation-dialog/ui/playlist-creation-dialog.vue'
import { PlaylistsList } from '@/entities/playlists'
import LoadingContent from '@/shared/ui/loading-content.vue'

const { user } = useAuth0()
const { requestLogout } = useCurrentAccountActions()

const { loading, error, result, restart, onResult } = usePlaylistsQuery(
    user.value?.sub || '',
)

const playlistsQueryError = computed(() => {
    if (result.value?.playlists.__typename === 'ErrorGraphQL') {
        return result.value.playlists
    } else {
        return null
    }
})

onResult(async () => {
    if (user.value && playlistsQueryError.value?.name === 'unauthorized-error') {
        await requestLogout()
    }
})
</script>

<template>
    <div v-if="user">
        <LoadingContent
            :loading="loading"
            :error="playlistsQueryError || error"
            @retry="restart"
        >
            <PlaylistCreationDialog />

            <PlaylistsList
                v-if="
                    result?.playlists.__typename ===
                    'PlaylistGraphQLListResponseWrapperGraphQL'
                "
                :playlists="result.playlists.items"
                :no-playlists-message="'You don\'t have any playlists'"
            />
        </LoadingContent>
    </div>

    <p v-else>No public playlists feed for now. Log in to view your saved music</p>
</template>

<style scoped></style>
