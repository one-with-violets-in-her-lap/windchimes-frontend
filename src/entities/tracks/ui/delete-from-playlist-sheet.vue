<script setup lang="ts">
import anime from 'animejs'
import { computed, ref, watch } from 'vue'

import { useDeleteTrackFromPlaylistsMutation } from '@/entities/tracks/api/playlist-tracks-mutations'
import { useLazyPlaylistsBasicInfoQuery } from '@/entities/tracks/api/playlists-basic-info-query'
import { PlaylistTrack } from '@/entities/tracks/model/track'

import { PlaylistBasicInfoFragment } from '@/shared/model/graphql-generated-types/graphql'
import { useNotificationsStore } from '@/shared/model/notifications'
import LoadingContent from '@/shared/ui/feedback/loading-content.vue'
import { IgnoreTypename } from '@/shared/utils/graphql'

const props = defineProps<{
    track: PlaylistTrack
    currentUserId: string
    currentPlaylist?: IgnoreTypename<PlaylistBasicInfoFragment>
}>()

const opened = defineModel<boolean>('opened')

const { showNotification } = useNotificationsStore()

const playlistsQuery = useLazyPlaylistsBasicInfoQuery({
    ownerUserId: props.currentUserId,
    containingTrackReferenceId: props.track.id,
})
const playlistsQueryError = computed(() => {
    if (playlistsQuery.error.value) {
        return playlistsQuery.error.value
    } else {
        return undefined
    }
})
const playlists = computed(() => playlistsQuery.result.value?.playlists)

const otherPlaylistsWithoutCurrentPlaylist = computed(() =>
    playlists.value?.filter(
        playlist =>
            !props.currentPlaylist || playlist.id !== props.currentPlaylist.id,
    ),
)

watch(opened, () => {
    if (opened.value) {
        // loads the playlists when windows opens, if they are not already loaded
        playlistsQuery.load()
    }
})

const selectedPlaylistsIds = ref<number[]>([])
function selectAllPlaylists() {
    selectedPlaylistsIds.value = playlists.value?.map(playlist => playlist.id) || []
}

const deleteTrackFromPlaylistsMutation = useDeleteTrackFromPlaylistsMutation()

async function deleteFromSelectedPlaylists() {
    try {
        const mutationResult = await deleteTrackFromPlaylistsMutation.mutate({
            playlistsIds: selectedPlaylistsIds.value,
            trackId: props.track.id,
        })

        if (
            mutationResult?.data?.deleteTrackFromPlaylists?.__typename ===
            'GraphQLApiError'
        ) {
            showNotification(
                'error',
                mutationResult.data?.deleteTrackFromPlaylists.explanation,
            )
            return
        }

        await anime({
            targets: '#playlistsToSelectForTrackDeletion',
            scale: 0.1,
            opacity: 0,
            endDelay: 80,
            duration: 160,
            easing: 'linear',
        }).finished

        opened.value = false

        showNotification('success', 'Deleted from playlists')
    } catch (error) {
        console.error(error)
        showNotification('error', 'Failed to delete the track from playlists')
    }
}
</script>

<template>
    <VBottomSheet v-model="opened" inset>
        <template #activator="{ props: openDialogButtonProps }">
            <slot name="activator" v-bind="{ openDialogButtonProps }"></slot>
        </template>

        <template #default>
            <VCard
                title="Delete from playlists"
                elevation="0"
                :subtitle="`${track.owner.name} - ${track.name}`"
                class="h-100"
            >
                <VCardItem class="pt-0">
                    <LoadingContent
                        error-alert-title="Error occurred while loading your playlists"
                        :error="playlistsQueryError"
                        :loading="playlistsQuery.loading.value"
                    >
                        <VForm
                            v-if="playlists && playlists.length > 0"
                            @submit.prevent
                        >
                            <VSheet
                                id="playlistsToSelectForTrackDeletion"
                                class="pa-0 mb-5 overflow-y-auto"
                                height="40vh"
                            >
                                <VCheckbox
                                    v-if="currentPlaylist"
                                    :key="currentPlaylist.id"
                                    v-model="selectedPlaylistsIds"
                                    :value="currentPlaylist.id"
                                    :label="currentPlaylist.name"
                                    hide-details
                                    density="comfortable"
                                    class="mb-3"
                                />

                                <VDivider
                                    v-if="currentPlaylist"
                                    thickness="2"
                                    class="my-5"
                                />

                                <VCheckbox
                                    v-for="playlist in otherPlaylistsWithoutCurrentPlaylist"
                                    :key="playlist.id"
                                    v-model="selectedPlaylistsIds"
                                    :value="playlist.id"
                                    :label="playlist.name"
                                    hide-details
                                    density="comfortable"
                                    class="mb-3"
                                />
                            </VSheet>

                            <Transition name="slide-up">
                                <VBtn
                                    v-show="selectedPlaylistsIds.length > 0"
                                    variant="flat"
                                    color="primary"
                                    prepend-icon="mdi-check"
                                    type="submit"
                                    class="w-100 mb-3"
                                    :loading="
                                        deleteTrackFromPlaylistsMutation.loading.value
                                    "
                                    @click="deleteFromSelectedPlaylists"
                                >
                                    Delete from selected
                                </VBtn>
                            </Transition>

                            <Transition name="slide-up">
                                <VBtn
                                    v-show="
                                        selectedPlaylistsIds.length < playlists.length
                                    "
                                    variant="tonal"
                                    color="primary"
                                    class="w-100"
                                    @click="selectAllPlaylists"
                                >
                                    Select all
                                </VBtn>
                            </Transition>
                        </VForm>

                        <div
                            v-else-if="playlists && playlists.length === 0"
                            class="d-flex flex-column align-stretch"
                        >
                            <VSkeletonLoader
                                boilerplate
                                type="list-item"
                                height="30"
                            />
                            <VSkeletonLoader
                                boilerplate
                                type="list-item"
                                height="30"
                                class="mb-5"
                            />

                            <p class="text-surface-4 text-center mb-5">
                                You don't have any playlists yet
                            </p>

                            <VBtn
                                variant="flat"
                                color="primary"
                                prepend-icon="mdi-close"
                                @click="opened = false"
                            >
                                Close
                            </VBtn>
                        </div>
                    </LoadingContent>
                </VCardItem>
            </VCard>
        </template>
    </VBottomSheet>
</template>

<style scoped></style>
