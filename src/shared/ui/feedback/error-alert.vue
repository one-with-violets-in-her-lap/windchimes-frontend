<script setup lang="ts">
import { ApolloError } from '@apollo/client/core'
import { computed } from 'vue'

import { ErrorFragment } from '@/shared/model/graphql-generated-types/graphql'
import { useNotificationsStore } from '@/shared/model/notifications'

const props = withDefaults(
    defineProps<{
        title: string
        error: ApolloError | ErrorFragment
    }>(),
    { title: 'Error occurred' },
)

const emit = defineEmits<{
    (event: 'retry'): void
}>()

const { showNotification } = useNotificationsStore()

const errorData = computed(() => {
    if (props.error instanceof ApolloError) {
        // `ApolloError` errors are internal and should not be displayed to the user
        return {
            explanationToShow: 'Check your internet connection or try again',
            moreInfo: props.error.message,
        }
    } else {
        return {
            explanationToShow: props.error.explanation,
            moreInfo: props.error.technicalExplanation,
        }
    }
})

async function copyMoreInfo(moreInfo: string) {
    try {
        await navigator.clipboard.writeText(moreInfo)
        showNotification('success', 'Error copied')
    } catch (error) {
        showNotification(
            'error',
            'Failed to copy, check that this website has proper permissions',
        )
    }
}
</script>

<template>
    <VAlert :title type="error" variant="tonal" max-width="800">
        <p class="my-3">
            {{ errorData.explanationToShow }}
        </p>

        <div class="d-flex ga-2 flex-wrap">
            <VBtn
                variant="flat"
                color="error"
                prepend-icon="mdi-reload"
                class="w-sm-auto w-100"
                @click="emit('retry')"
            >
                Try again
            </VBtn>

            <VMenu
                v-if="errorData.moreInfo"
                max-width="500px"
                :close-on-content-click="false"
            >
                <template #activator="{ props: menuActivatorProps }">
                    <VBtn
                        v-bind="menuActivatorProps"
                        variant="outlined"
                        prepend-icon="mdi-dots-horizontal"
                        class="w-sm-auto w-100"
                    >
                        More info
                    </VBtn>
                </template>

                <VCard class="my-6" color="surface" elevation="0">
                    <VCardText class="pb-0">
                        {{ errorData.moreInfo }}
                    </VCardText>

                    <VCardActions>
                        <VBtn
                            variant="text"
                            color="primary"
                            prepend-icon="mdi-clipboard-outline"
                            @click="copyMoreInfo(errorData.moreInfo)"
                        >
                            Copy
                        </VBtn>
                    </VCardActions>
                </VCard>
            </VMenu>
        </div>
    </VAlert>
</template>

<style scoped></style>
