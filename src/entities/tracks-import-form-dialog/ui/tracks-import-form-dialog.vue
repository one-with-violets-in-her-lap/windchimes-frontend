<script setup lang="ts">
import { watch } from 'vue'
import * as zod from 'zod'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { TracksImportFormData } from '@/entities/tracks-import-form-dialog/model/tracks-import-form-data'
import { Platform, platformSelectItems } from '@/entities/platform/model/platform'

const opened = defineModel<boolean>('opened', { required: true })

const emit = defineEmits<{
    (event: 'submit', formData: Required<TracksImportFormData>): void
}>()

const { defineField, errors, meta, handleSubmit } = useForm({
    validationSchema: toTypedSchema(
        zod.object({
            playlistToImportUrl: zod
                .string()
                .min(1, { message: 'Field is required' })
                .url({ message: 'Must be a valid url' }),
            platform: zod.string().min(1, { message: 'Field is required' }),
        }),
    ),
})
const [playlistToImportUrl] = defineField('playlistToImportUrl')
const [platform] = defineField('platform')

watch(playlistToImportUrl, () => {
    const matchedPlatform = platformSelectItems.find(platform =>
        playlistToImportUrl.value?.toLowerCase().includes(platform.toLowerCase()),
    )

    if (matchedPlatform && !platform.value) {
        platform.value = matchedPlatform
    }
})

const handleFormSubmit = handleSubmit(values => {
    emit('submit', {
        ...values,
        platform: Platform[values.platform as keyof typeof Platform],
    })
})
</script>

<template>
    <div>
        <VDialog v-model="opened" max-width="600px">
            <template #activator="{ props }">
                <VBtn
                    color="background-contrast"
                    prepend-icon="mdi-import"
                    v-bind="props"
                >
                    Import tracks
                </VBtn>
            </template>

            <VCard elevation="0" density="default">
                <template #title>
                    <span class="text-wrap">
                        Import playlist tracks from other platform
                    </span>
                </template>

                <template #text>
                    <VForm @submit.prevent="handleFormSubmit">
                        <VTextField
                            v-model="playlistToImportUrl"
                            label="Playlist to import url"
                            placeholder="https://..."
                            :error-messages="errors.playlistToImportUrl"
                            variant="outlined"
                            class="mb-3"
                        />

                        <VSelect
                            variant="outlined"
                            v-model="platform"
                            placeholder="Platform"
                            label="Platform"
                            :items="platformSelectItems"
                            :error-messages="errors.platform"
                            class="mb-3"
                        />

                        <div class="d-flex ga-3 items-center flex-wrap">
                            <VBtn
                                variant="flat"
                                color="primary"
                                prepend-icon="mdi-check"
                                type="submit"
                                :disabled="!meta.valid"
                            >
                                Import
                            </VBtn>

                            <VBtn
                                variant="tonal"
                                color="error"
                                prepend-icon="mdi-close"
                                @click="opened = false"
                            >
                                Cancel
                            </VBtn>
                        </div>
                    </VForm>
                </template>
            </VCard>
        </VDialog>
    </div>
</template>

<style scoped></style>
