<script setup lang="ts">
import gql from 'graphql-tag'
import { useQuery } from '@vue/apollo-composable'
import { useAuth0 } from '@auth0/auth0-vue'

const { user } = useAuth0()

const { loading, error, result } = useQuery<{
    playlists: {
        id: number
        name: string
        pictureUrl: string
        tracksCount: number
    }[]
}>(
    gql`
        query GetPlaylists($userId: String!) {
            playlists(userId: $userId) {
                id
                name
                pictureUrl
                tracksCount
            }
        }
    `,
    { userId: user.value?.sub || '' },
)
</script>

<template>
    <div v-if="user">
        <VProgressCircular indeterminate :size="50" v-if="loading" />

        <p v-else-if="error">
            {{ error.message }}
        </p>

        <ul v-else-if="result">
            <VHover>
                <template #default="{ isHovering, props }">
                    <VCard
                        v-for="playlist in result.playlists"
                        :key="playlist.id"
                        v-bind="props"
                        variant="flat"
                        :color="isHovering ? 'primary-lighten-1' : undefined"
                        :subtitle="`${playlist.tracksCount} tracks`"
                    >
                        <template #title>
                            <h3 class="text-h6 text-wrap">
                                {{ playlist.name }}
                            </h3>
                        </template>

                        <template #prepend>
                            <VAvatar
                                :image="playlist.pictureUrl"
                                :alt="playlist.name"
                                rounded
                                tile
                                size="70px"
                            />
                        </template>
                    </VCard>
                </template>
            </VHover>
        </ul>
    </div>
</template>

<style scoped></style>
