import { defineStore } from 'pinia'
import { readonly, ref } from 'vue'

export type NotificationType = 'error' | 'success' | 'info'

export interface Notification {
    id: number
    message: string
    type: NotificationType
    visible: boolean
}

export const useNotificationsStore = defineStore('notifications', () => {
    const notifications = ref<Notification[]>([])

    function showNotification(type: NotificationType, message: string) {
        const lastNotification = notifications.value.at(-1)
        const newNotificationId = lastNotification ? lastNotification.id + 1 : 1

        if (notifications.value.length === 4) {
            notifications.value.splice(0, 1)
        }

        notifications.value.push({
            id: newNotificationId,
            type,
            message,
            visible: true,
        })
    }

    function closeNotification(id: number) {
        const notificationToClose = notifications.value.find(
            notification => notification.id === id,
        )

        if (notificationToClose) {
            notificationToClose.visible = false
        }
    }

    return {
        notifications: readonly(notifications),
        showNotification,
        closeNotification,
    }
})
