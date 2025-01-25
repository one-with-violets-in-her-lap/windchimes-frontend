<script setup lang="ts">
import { storeToRefs } from 'pinia'

import { usePreferencesStore } from '@/entities/preferences'

import DrawerWindow from '@/shared/ui/drawer-window.vue'

const opened = defineModel<boolean>('opened', { required: true })

const { hideDiscoverSectionOnHomePage } = storeToRefs(usePreferencesStore())
</script>

<template>
    <DrawerWindow v-model:opened="opened" position="right">
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
    </DrawerWindow>
</template>
