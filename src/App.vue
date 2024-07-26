<script setup lang="ts"></script>

<template>
    <div class="root-container">
        <main class="main-content-container">
            <RouterView />
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
