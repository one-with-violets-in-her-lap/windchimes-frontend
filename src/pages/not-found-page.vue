<script setup lang="ts">
import { FatalError } from '@/shared/model/fatal-error'

throw new FatalError('not-found', 'Requested page was not found')
</script>

<template>
    <div></div>
</template>
