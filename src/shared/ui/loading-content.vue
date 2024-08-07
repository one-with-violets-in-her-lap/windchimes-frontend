<script setup lang="ts">
import type { ApolloError } from '@apollo/client'

defineProps<{
    loading: boolean
    error: ApolloError | null | undefined
}>()

const emit = defineEmits<{
    (event: 'retry'): void
}>()
</script>

<template>
    <VProgressCircular indeterminate :size="50" v-if="loading" />

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
