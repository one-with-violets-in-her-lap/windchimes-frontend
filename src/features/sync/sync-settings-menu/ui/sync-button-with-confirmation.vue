<script setup lang="ts">
const emit = defineEmits<{
    (event: 'sync-confirm'): void
}>()
</script>

<template>
    <VDialog location="center center" max-width="500px" min-width="300px">
        <template #activator="{ props: confirmationDialogActivatorProps }">
            <VBtn
                v-bind="confirmationDialogActivatorProps"
                color="primary"
                variant="flat"
                prepend-icon="mdi-sync"
                class="flex-grow-1"
            >
                Sync
            </VBtn>
        </template>

        <template #default="{ isActive }">
            <VCard class="rounded-lg py-4">
                <VCardTitle class="text-wrap text-center mb-5">
                    This action will replace all existing tracks
                </VCardTitle>

                <VCardActions class="justify-center flex-wrap">
                    <VBtn
                        variant="flat"
                        color="primary"
                        prepend-icon="mdi-check"
                        @click="
                            () => {
                                emit('sync-confirm')
                                isActive.value = false
                            }
                        "
                    >
                        Continue
                    </VBtn>

                    <VBtn
                        variant="flat"
                        color="error"
                        prepend-icon="mdi-close"
                        @click="isActive.value = false"
                    >
                        Cancel
                    </VBtn>
                </VCardActions>
            </VCard>
        </template>
    </VDialog>
</template>

<style scoped></style>
