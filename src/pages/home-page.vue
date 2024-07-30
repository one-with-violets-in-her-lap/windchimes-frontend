<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const searchQuery = ref('')

function search() {
    if (searchQuery.value.length < 1) {
        return
    }

    router.push(`/search?query=${searchQuery.value}`)
}
</script>

<template>
    <h1 class="page-heading">MUSIC</h1>

    <form class="search-form" @submit.prevent="search">
        <VTextField
            v-model.trim="searchQuery"
            class="search-field"
            placeholder="Search tracks"
            variant="solo-filled"
            hide-details
            flat
            rounded
        />

        <VBtn variant="flat" color="primary" icon="mdi-magnify" type="submit" />
    </form>
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
