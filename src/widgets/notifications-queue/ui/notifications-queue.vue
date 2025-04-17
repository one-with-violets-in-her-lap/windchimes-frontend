<script setup lang="ts">
import { storeToRefs } from 'pinia'

import { NotificationType, useNotificationsStore } from '@/shared/model/notifications'

const notificationStore = useNotificationsStore()
const { notifications } = storeToRefs(notificationStore)
const { closeNotification } = notificationStore

const icons: Record<NotificationType, string> = {
    error: 'mdi-alert',
    info: 'mdi-information',
    success: 'mdi-check-circle',
}
</script>

<template>
    <div>
        <VSnackbar
            v-for="notification in notifications"
            :key="notification.id"
            :model-value="notification.visible"
            color="background"
            min-width="300px"
            max-width="460px"
            variant="elevated"
            content-class="border-sm elevation-2"
            @update:model-value="closeNotification(notification.id)"
        >
            <div class="d-flex align-center gc-1">
                <VIcon
                    :icon="icons[notification.type]"
                    :color="notification.type"
                    size="26"
                    class="mr-2"
                />

                <p>
                    {{ notification.message }}
                </p>
            </div>

            <template #actions>
                <VBtn
                    color="background-contrast"
                    variant="text"
                    icon="mdi-close"
                    @click="closeNotification(notification.id)"
                >
                </VBtn>
            </template>
        </VSnackbar>
    </div>
</template>

<style scoped></style>
