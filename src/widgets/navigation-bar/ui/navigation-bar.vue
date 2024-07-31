<script setup lang="ts">
import AccountMenu from '@/features/account-menu/ui/account-menu.vue'
</script>

<template>
    <header class="header">
        <nav class="navigation">
            <AccountMenu />
        </nav>
    </header>
</template>

<style scoped>
.header {
    display: flex;
    align-items: center;
    gap: 13px;
    padding: 12px 15px;
    border-bottom: 1px solid rgb(212, 212, 212);
}

.navigation {
    margin-left: auto;
}

.logo {
    width: 46px;
}
</style>
