<script setup lang="ts">
import { useRoute } from 'vue-router'

const playlistId = useRoute().params.id.toString()
</script>

<template>
    <h1 class="text-h3 font-weight-bold mb-4">PLAYLIST</h1>
</template>

<style scoped></style>
