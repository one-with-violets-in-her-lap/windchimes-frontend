<script setup lang="ts">
import { AppError } from '@/shared/model/app-error'

throw new AppError('not-found', 'Requested page was not found')
</script>

<template>
    <div></div>
</template>
