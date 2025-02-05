<script setup lang="ts">
import { reactive } from 'vue'
import { useRouter } from 'vue-router'

const MIN_SEARCH_QUERY_LENGTH = 2

const router = useRouter()

const searchFormData = reactive<{
    query: string
}>({
    query: '',
})

function handleSearch(closeMenu: VoidFunction) {
    if (searchFormData.query.length >= MIN_SEARCH_QUERY_LENGTH) {
        router.push({
            name: 'search',
            query: {
                'search-query': searchFormData.query,
            },
        })

        searchFormData.query = ''

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
                        v-model.trim="searchFormData.query"
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
                            :disabled="searchFormData.query.length < 3"
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
