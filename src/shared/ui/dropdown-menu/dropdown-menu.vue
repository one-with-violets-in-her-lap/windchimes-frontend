<script setup lang="ts"></script>

<template>
    <VMenu>
        <template #activator="{ props }">
            <slot name="activator" v-bind="{ props }"></slot>
        </template>

        <VList elevation="0" class="mt-1">
            <slot></slot>
        </VList>
    </VMenu>
</template>

<style scoped></style>
