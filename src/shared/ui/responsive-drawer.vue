<script setup lang="ts">
import { useDisplay } from 'vuetify'

const opened = defineModel<boolean>('opened', { required: true })

const { mobile } = useDisplay()
</script>

<template>
    <VNavigationDrawer
        v-model="opened"
        width="500"
        temporary
        rounded
        class="responsive-drawer"
        :location="mobile ? 'bottom' : 'left'"
        :class="{ 'side-drawer': !mobile }"
    >
        <slot></slot>
    </VNavigationDrawer>
</template>

<style scoped>
.responsive-drawer {
    padding: 20px;
    background-color: rgba(var(--v-theme-background), 0.8);
    backdrop-filter: blur(3px);
    max-height: 90%;
}

.side-drawer {
    height: 100% !important;
    top: 0px !important;
    max-height: 100%;
}
</style>
