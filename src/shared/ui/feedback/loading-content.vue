<script setup lang="ts">
import { ApolloError } from '@apollo/client/core'

import { ErrorFragment } from '@/shared/model/graphql-generated-types/graphql'
import { VuetifySkeleton } from '@/shared/model/vuetify-skeleton'
import ErrorAlert from '@/shared/ui/feedback/error-alert.vue'

defineProps<{
    loading: boolean
    skeleton?: VuetifySkeleton
    errorAlertTitle?: string
    error: ErrorFragment | ApolloError | null | undefined
}>()

const emit = defineEmits<{
    (event: 'retry'): void
}>()
</script>

<template>
    <VSkeletonLoader v-if="loading && skeleton" :type="skeleton" />
    <VProgressCircular v-else-if="loading" indeterminate :size="50" />

    <ErrorAlert
        v-else-if="error"
        :title="errorAlertTitle"
        :error
        @retry="emit('retry')"
    />

    <slot v-else></slot>
</template>
