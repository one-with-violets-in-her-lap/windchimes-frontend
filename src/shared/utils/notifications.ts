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
     * Adds notification to the store. Does not handle auto-hiding after some time
     *
     * Restricts max number of notifications ({@link MAX_NOTIFICATIONS_TO_DISPLAY})
     */
    function addNotification(type: NotificationType, message: string) {
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

        return {
            type,
            message,
            id: newNotificationId,
        }
    }

    function removeNotification(id: number) {
        notifications.value = notifications.value.filter(
            notification => notification.id !== id,
        )
    }

    return {
        notifications: readonly(notifications),
        addNotification,
        removeNotification,
    }
})

/**
 * Adds a notification to the queue and schedules its removal after some time
 *
 * @param timeoutMilliseconds Amount of milliseconds to wait before hiding the
 * notification
 *
 * **Please, specify a larger number for notifications with a lot of info**
 */
export function showTemporaryNotification(
    type: NotificationType,
    message: string,
    timeoutMilliseconds = 3600,
) {
    const { addNotification, removeNotification } = useNotificationsStore()

    const newNotification = addNotification(type, message)

    setTimeout(() => {
        removeNotification(newNotification.id)
    }, timeoutMilliseconds)
}
