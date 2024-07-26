<script setup lang="ts">
import { ref } from 'vue'

const searchQuery = ref('')
</script>

<template>
    <h1 class="page-heading">MUSIC</h1>

    <div class="search-form">
        <VTextField
            v-model.trim="searchQuery"
            class="search-field"
            placeholder="Search tracks"
            variant="solo-filled"
            hide-details
            flat
            rounded
        />

        <VBtn
            variant="flat"
            color="primary"
            icon="mdi-magnify"
            :to="`/search?query=${searchQuery}`"
        />
    </div>
</template>

<style scoped>
.search-form {
    display: flex;
    align-items: center;
    column-gap: 10px;
    flex-wrap: wrap;
}

.search-form .search-field {
    /* min-width: 260px; */
    flex-grow: 1;
}
</style>
