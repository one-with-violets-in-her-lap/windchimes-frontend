<script setup lang="ts">
import { NotFoundError } from '@/shared/model/errors'

throw new NotFoundError('requested page was not found')
</script>

<template>
    <div></div>
</template>
