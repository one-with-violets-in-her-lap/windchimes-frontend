<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'

const MIN_SEARCH_QUERY_LENGTH = 2

const router = useRouter()

const searchQuery = ref('')
const searchQueryValid = computed(
    () => searchQuery.value.length >= MIN_SEARCH_QUERY_LENGTH,
)

function handleSearch(closeMenu: VoidFunction) {
    if (searchQueryValid.value) {
        router.push({
            name: 'search',
            query: {
                'search-query': searchQuery.value,
            },
        })

        searchQuery.value = ''

        closeMenu()
    }
}
</script>

<template>
    <VMenu :close-on-content-click="false" scrim width="400" min-width="280">
        <template #activator="{ props: searchMenuActivatorProps }">
            <VBtn
                v-bind="searchMenuActivatorProps"
                icon="mdi-magnify"
                variant="outlined"
                size="small"
            />
        </template>

        <template #default="{ isActive }">
            <VCard elevation="0" border color="background">
                <VCardText
                    tag="form"
                    @submit.prevent="handleSearch(() => (isActive.value = false))"
                >
                    <VTextField
                        v-model.trim="searchQuery"
                        variant="outlined"
                        placeholder="Search for tracks and playlists"
                        density="comfortable"
                        color="primary"
                        append-inner-icon="mdi-magnify"
                        hide-details
                        class="mb-5"
                    />

                    <div class="d-flex align-center ga-3 justify-end">
                        <VBtn
                            variant="flat"
                            color="primary"
                            type="submit"
                            :disabled="searchQueryValid"
                        >
                            Search
                        </VBtn>
                    </div>
                </VCardText>
            </VCard>
        </template>
    </VMenu>
</template>

<style scoped></style>
