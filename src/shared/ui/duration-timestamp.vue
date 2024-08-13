<script setup lang="ts">
import {
    getDateTimeAttributeFromSeconds,
    getFormattedTimeFromSeconds,
} from '@/shared/model/duration-formatting'

defineProps<{
    secondsDuration: number
    unstyled?: boolean
}>()
</script>

<template>
    <time
        :class="unstyled ? null : 'text-surface-4'"
        :datetime="getDateTimeAttributeFromSeconds(secondsDuration)"
    >
        {{ getFormattedTimeFromSeconds(secondsDuration) }}
    </time>
</template>

<style scoped></style>
