import { defineStore } from 'pinia'
import { readonly, ref } from 'vue'

export type NotificationType = 'error' | 'success' | 'info'

const MAX_NOTIFICATIONS_TO_DISPLAY = 2

export interface Notification {
    id: number
    message: string
    type: NotificationType
}

export const useNotificationsStore = defineStore('notifications', () => {
    const notifications = ref<Notification[]>([])

    /**
     * Adds a notification to the queue and schedules its removal after some time
     *
     * @param lifetimeMilliseconds Amount of milliseconds to wait before hiding the
     * notification
     *
     * **Please, specify a larger number for notifications with a lot of info**
     */
    function showTemporaryNotification(
        type: NotificationType,
        message: string,
        lifetimeMilliseconds?: number,
    ) {
        const lastNotification = notifications.value.at(-1)
        const newNotificationId = lastNotification ? lastNotification.id + 1 : 1

        notifications.value.push({
            id: newNotificationId,
            type,
            message,
        })

        if (notifications.value.length > MAX_NOTIFICATIONS_TO_DISPLAY) {
            notifications.value.shift()
        }

        setTimeout(
            () => closeNotification(newNotificationId),
            lifetimeMilliseconds || 4200,
        )
    }

    function closeNotification(id: number) {
        notifications.value = notifications.value.filter(
            notification => notification.id !== id,
        )
    }

    return {
        notifications: readonly(notifications),
        showTemporaryNotification,
        closeNotification,
    }
})
