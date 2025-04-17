<script setup lang="ts">
import { storeToRefs } from 'pinia'

import { NotificationType, useNotificationsStore } from '@/shared/utils/notifications'

const notificationStore = useNotificationsStore()
const { notifications } = storeToRefs(notificationStore)
const { removeNotification } = notificationStore

const ICONS: Record<NotificationType, string> = {
    error: 'mdi-alert',
    info: 'mdi-information',
    success: 'mdi-check-circle',
}
</script>

<template>
    <TransitionGroup
        tag="div"
        name="notification-slide-fade"
        class="notifications-queue"
    >
        <VCard
            v-for="notification in notifications"
            :key="notification.id"
            tag="output"
            color="background"
            density="compact"
            width="100%"
            elevation="6"
            class="border-sm d-flex"
        >
            <VCardText class="d-flex align-center gc-2 py-3">
                <VIcon
                    :icon="ICONS[notification.type]"
                    :color="notification.type"
                    size="26"
                    class="mr-2"
                />

                {{ notification.message }}
            </VCardText>

            <VCardActions class="py-0 pr-1">
                <VBtn
                    color="background-contrast"
                    variant="text"
                    density="comfortable"
                    icon="mdi-close"
                    @click="removeNotification(notification.id)"
                >
                </VBtn>
            </VCardActions>
        </VCard>
    </TransitionGroup>
</template>

<style scoped>
.notifications-queue {
    z-index: 2;
    position: fixed;
    bottom: 90px;
    left: 50%;
    transform: translateX(-50%);

    display: flex;
    flex-direction: column-reverse;
    align-items: end;
    gap: 16px;
    width: 95%;
    max-width: 400px;
}

.notification-slide-fade-move,
.notification-slide-fade-enter-active,
.notification-slide-fade-leave-active {
    transition: all 0.3s cubic-bezier(0.55, 0, 0.1, 1);
}

.notification-slide-fade-enter-from,
.notification-slide-fade-leave-to {
    opacity: 0;
    transform: scaleY(0.01) translate(30px, 0);
}

.notification-slide-fade-leave-active {
    position: absolute;
}
</style>
