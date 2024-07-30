<script setup lang="ts">
import { onErrorCaptured } from 'vue'
import { storeToRefs } from 'pinia'
import { useAppErrorStore } from '@/app/model/app-error-store'
import NavigationBar from '@/widgets/navigation-bar/ui/navigation-bar.vue'

const appErrorStore = useAppErrorStore()
const { handleError } = appErrorStore
const { error } = storeToRefs(appErrorStore)

onErrorCaptured(handleError)
</script>

<template>
    <div class="root-container">
        <NavigationBar />

        <main class="main-content-container">
            <RouterView v-if="!error" />

            <div v-else>
                {{ error.explanation }}
            </div>
        </main>
    </div>
</template>

<style>
@import url('@/assets/styles/typography.css');

.root-container {
    display: flex;
    min-height: 100vh;
    flex-direction: column;
}

.main-content-container {
    flex-grow: 1;
    padding: 15px 12px;
    background-color: rgb(var(--v-theme-background));
}
</style>
