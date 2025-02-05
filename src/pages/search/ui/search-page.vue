<script setup lang="ts">
import { useRoute } from 'vue-router'

import LoadingContent from '@/shared/ui/feedback/loading-content.vue'

const route = useRoute()
</script>

<template>
    <LoadingContent :error="undefined" :loading="false">
        
    </LoadingContent>
</template>

<style scoped></style>
