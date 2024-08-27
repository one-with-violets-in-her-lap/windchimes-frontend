<script setup lang="ts">
import { useRouter } from 'vue-router'
import AccountMenu from '@/features/account-menu/ui/account-menu.vue'
import ThemeToggleButtons from '@/features/theme-toggle-buttons/ui/theme-toggle-buttons.vue'

const router = useRouter()
</script>

<template>
    <VAppBar class="position-static border-b-thin" elevation="0">
        <VBtn icon="mdi-arrow-left" @click="router.back" />

        <template #append>
            <nav class="gc-3 d-flex items-center">
                <AccountMenu>
                    <template #append-items>
                        <VListItem class="d-sm-none">
                            <ThemeToggleButtons />
                        </VListItem>
                    </template>
                </AccountMenu>

                <ThemeToggleButtons class="d-none d-sm-flex" />
            </nav>
        </template>
    </VAppBar>
</template>

<style scoped>

</style>
