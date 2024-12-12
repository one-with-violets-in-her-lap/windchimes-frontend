<script setup lang="ts">
import { useDisplay } from 'vuetify'

withDefaults(
    defineProps<{
        fixedHeight?: string
    }>(),
    { fixedHeight: undefined },
)

const opened = defineModel<boolean>('opened', { required: true })

const { mobile } = useDisplay()
</script>

<template>
    <div>
        <VNavigationDrawer
            v-model="opened"
            width="500"
            temporary
            rounded
            class="responsive-drawer"
            touchless
            :location="mobile ? 'bottom' : 'left'"
            :class="{ 'side-drawer': !mobile, 'fixed-height': fixedHeight }"
            v-bind="$attrs"
        >
            <slot></slot>
        </VNavigationDrawer>
    </div>
</template>

<style scoped>
.responsive-drawer {
    padding: 20px;
    background-color: rgba(var(--v-theme-background), 0.75);
    backdrop-filter: blur(3px);
    max-height: 90%;
}

.side-drawer {
    height: 100% !important;
    top: 0px !important;
    max-height: 100%;
}

.fixed-height {
    min-height: v-bind(fixedHeight);
}
</style>
