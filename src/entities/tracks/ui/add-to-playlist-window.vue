<script setup lang="ts">
import { computed, ref } from 'vue'
import { PlaylistTrack } from '@/entities/tracks/model/track'
import { useLazyPlaylistsBasicInfoQuery } from '@/entities/tracks/api/playlists-basic-info-query'
import LoadingContent from '@/shared/ui/feedback/loading-content.vue'

const props = defineProps<{
    track: PlaylistTrack
    currentUserId: string
}>()

const playlistsQuery = useLazyPlaylistsBasicInfoQuery(props.currentUserId)

const playlistsQueryError = computed(() => {
    if (playlistsQuery.result.value?.playlists.__typename === 'ErrorGraphQL') {
        return playlistsQuery.result.value.playlists
    } else if (playlistsQuery.error.value) {
        return playlistsQuery.error.value
    } else {
        return undefined
    }
})

const playlists = computed(() =>
    playlistsQuery.result.value?.playlists.__typename ===
    'PlaylistGraphQLListResponseWrapperGraphQL'
        ? playlistsQuery.result.value.playlists.items
        : null,
)

const selectedPlaylistsIds = ref<number[]>([])
</script>

<template>
    <VBottomSheet @update:model-value="playlistsQuery.load()" inset>
        <template #activator="{ props: openDialogButtonProps }">
            <slot name="activator" v-bind="{ openDialogButtonProps }"></slot>
        </template>

        <template #default="{ isActive }">
            <VCard title="Add to playlists" class="h-100">
                <VCardItem class="pt-0">
                    <LoadingContent
                        :error="playlistsQueryError"
                        :loading="playlistsQuery.loading.value"
                    >
                        <p class="mb-5">Select the playlists to add the track to</p>

                        <VForm
                            v-if="playlists && playlists.length > 0"
                            @submit.prevent
                        >
                            <VSheet class="pa-0 mb-5 overflow-y-auto" height="40vh">
                                <VCheckbox
                                    v-for="playlist in playlists"
                                    v-model="selectedPlaylistsIds"
                                    :value="playlist.id"
                                    :key="playlist.id"
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
                                >
                                    Add to selected
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
                                    @click="
                                        selectedPlaylistsIds = playlists.map(
                                            playlist => playlist.id,
                                        )
                                    "
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
                                @click="isActive.value = false"
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
