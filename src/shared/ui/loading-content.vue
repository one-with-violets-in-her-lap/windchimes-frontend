<script setup lang="ts">
import type { ApolloError } from '@apollo/client'

defineProps<{
    loading: boolean
    skeleton?:
        | 'button'
        | 'article'
        | 'table'
        | 'image'
        | 'text'
        | 'divider'
        | 'table-row'
        | 'list-item'
        | 'subtitle'
        | 'chip'
        | 'avatar'
        | 'actions'
        | 'heading'
        | 'sentences'
        | 'paragraph'
        | 'ossein'
        | 'card'
        | 'card-avatar'
        | 'date-picker'
        | 'date-picker-options'
        | 'date-picker-days'
        | 'list-item-avatar'
        | 'list-item-two-line'
        | 'list-item-avatar-two-line'
        | 'list-item-three-line'
        | 'list-item-avatar-three-line'
        | 'table-heading'
        | 'table-thead'
        | 'table-tbody'
        | 'table-row-divider'
        | 'table-tfoot'
    error: ApolloError | null | undefined
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
        <p class="my-3"><b>Error:</b> {{ error.message }}</p>

        <VBtn prepend-icon="mdi-reload" @click="emit('retry')">
            Try again
        </VBtn>
    </VAlert>

    <slot v-else></slot>
</template>
