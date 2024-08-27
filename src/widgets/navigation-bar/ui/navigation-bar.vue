<script setup lang="ts">
import AccountMenu from '@/features/account-menu/ui/account-menu.vue'
import ThemeToggleButton from '@/features/theme-toggle-button/ui/theme-toggle-button.vue'
</script>

<template>
    <VAppBar class="position-static border-b-thin" elevation="0">
        <template #append>
            <nav class="gc-3 d-flex">
                <AccountMenu />
                <ThemeToggleButton />
            </nav>
        </template>
    </VAppBar>
</template>

<style scoped>
</style>
