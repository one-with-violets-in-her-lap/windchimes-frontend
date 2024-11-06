<script setup lang="ts">
import { ApolloError } from '@apollo/client/core'
import { ErrorGraphQl } from '@/shared/model/graphql-generated-types/graphql'
import { VuetifySkeleton } from '@/shared/model/vuetify-skeleton'

defineProps<{
    loading: boolean
    skeleton?: VuetifySkeleton
    error: ErrorGraphQl | ApolloError | null | undefined
}>()

const emit = defineEmits<{
    (event: 'retry'): void
}>()
</script>

<template>
    <VSkeletonLoader v-if="loading && skeleton" :type="skeleton" />
    <VProgressCircular v-else-if="loading" indeterminate :size="50" />

    <VAlert
        v-else-if="error"
        title="Something went wrong when loading playlists"
        type="error"
    >
        <p class="my-3" v-if="error instanceof ApolloError">
            <b>Error:</b> {{ error.message }}
        </p>

        <p class="my-3" v-else><b>Error:</b> {{ error.explanation }}</p>

        <VBtn prepend-icon="mdi-reload" @click="emit('retry')"> Try again </VBtn>
    </VAlert>

    <slot v-else></slot>
</template>
