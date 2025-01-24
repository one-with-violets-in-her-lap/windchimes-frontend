<script setup lang="ts">
import { storeToRefs } from 'pinia'

import { usePreferencesStore } from '@/entities/preferences'

import Drawer from '@/shared/ui/drawer.vue'

const opened = defineModel<boolean>('opened', { required: true })

const { hideDiscoverSectionOnHomePage } = storeToRefs(usePreferencesStore())
</script>

<template>
    <Drawer
        v-model:opened="opened"
        position="right"
        class="drawer preferences-drawer"
    >
        <div class="d-flex justify-end">
            <VBtn icon="mdi-close" variant="text" @click="opened = false" />
        </div>

        <VForm>
            <VSwitch
                v-model="hideDiscoverSectionOnHomePage"
                flat
                base-color="background-contrast"
                color="primary"
                label='Hide "Discover" section'
                class="elevation-0"
            />
        </VForm>
    </Drawer>
</template>

<style>
.preferences-drawer.preferences-drawer {
    width: 90%;
    max-width: 500px;
}
</style>
