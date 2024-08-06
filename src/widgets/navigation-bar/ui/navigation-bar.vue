<script setup lang="ts">
import AccountMenu from '@/features/account-menu/ui/account-menu.vue'
import ThemeToggleButton from '@/features/theme-toggle-button/ui/theme-toggle-button.vue'
</script>

<template>
    <header class="header">
        <nav class="navigation">
            <AccountMenu />
            <ThemeToggleButton />
        </nav>
    </header>
</template>

<style scoped>
.header {
    display: flex;
    align-items: center;
    gap: 13px;
    padding: 12px 15px;
    background-color: rgb(var(--v-theme-surface));
    border-bottom: 1px solid rgb(var(--v-theme-surface-3));
}

.navigation {
    margin-left: auto;
    display: flex;
    align-items: center;
    column-gap: 10px;
}

.logo {
    width: 46px;
}
</style>
