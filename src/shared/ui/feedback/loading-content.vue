<script setup lang="ts">
import { ApolloError } from '@apollo/client/core'
import { ErrorGraphQl } from '@/shared/model/graphql-generated-types/graphql'
import ErrorAlert from '@/shared/ui/feedback/error-alert.vue'
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

    <ErrorAlert v-else-if="error" :error @retry="emit('retry')" />

    <slot v-else></slot>
</template>
