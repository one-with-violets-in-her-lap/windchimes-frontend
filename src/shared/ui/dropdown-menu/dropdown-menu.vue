<script setup lang="ts"></script>

<template>
    <VMenu>
        <template #activator="{ props }">
            <slot name="activator" v-bind="{ props }"></slot>
        </template>

        <template #default="{ isActive }">
            <VList
                elevation="0"
                class="mt-1 border dropdown-list"
                bg-color="background"
            >
                <slot :is-active></slot>
            </VList>
        </template>
    </VMenu>
</template>

<style scoped>
.dropdown-list {
    backdrop-filter: blur(2px);
    background-color: rgba(var(--v-theme-background), 0.86) !important;
}
</style>
