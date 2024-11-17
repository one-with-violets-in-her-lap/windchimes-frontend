<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import AccountMenu from '@/features/account-menu/ui/account-menu.vue'

const router = useRouter()
const route = useRoute()
</script>

<template>
    <VAppBar
        class="z-index-default position-static border-b-sm"
        color="background"
        elevation="0"
    >
        <VBtn
            v-if="route.name !== 'home'"
            icon="mdi-arrow-left"
            @click="router.back"
        />

        <template #append>
            <nav class="gc-3 d-flex align-center">
                <AccountMenu />
            </nav>
        </template>
    </VAppBar>
</template>

<style scoped>
.z-index-default {
    z-index: 0 !important;
}
</style>
