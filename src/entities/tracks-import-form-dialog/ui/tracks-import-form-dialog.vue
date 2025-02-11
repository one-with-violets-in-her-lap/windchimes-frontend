<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { watch } from 'vue'
import zod from 'zod'

import { Platform, platformSelectItems } from '@/entities/platform/model/platform'
import { TracksImportFormData } from '@/entities/tracks-import-form-dialog/model/tracks-import-form-data'

import ShineEffectWrapper from '@/shared/ui/shine-effect-wrapper.vue'

defineProps<{
    loading: boolean
}>()

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
            replaceExistingTracks: zod.boolean(),
        }),
    ),
    initialValues: {
        replaceExistingTracks: false,
    },
})
const [playlistToImportUrl] = defineField('playlistToImportUrl')
const [platform] = defineField('platform')
const [replaceExistingTracks] = defineField('replaceExistingTracks')

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
        <VDialog v-model="opened" max-width="600px" min-width="310px">
            <template #activator="{ props }">
                <VBtn
                    color="background-contrast"
                    variant="outlined"
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
                            prepend-inner-icon="mdi-link-variant"
                            label="Playlist to import url"
                            placeholder="https://..."
                            :error-messages="errors.playlistToImportUrl"
                            variant="outlined"
                            class="mb-3"
                        />

                        <VSelect
                            v-model="platform"
                            variant="outlined"
                            :prepend-inner-icon="
                                platform
                                    ? `mdi-${platform.toLowerCase()}`
                                    : 'mdi-music-box-multiple'
                            "
                            placeholder="Platform"
                            clearable
                            label="Platform"
                            :items="platformSelectItems"
                            :error-messages="errors.platform"
                        />

                        <VSwitch
                            v-model="replaceExistingTracks"
                            color="primary"
                            label="Replace existing tracks"
                            flat
                        />

                        <div class="d-flex ga-3 items-center flex-wrap">
                            <VBtn
                                variant="flat"
                                color="primary"
                                prepend-icon="mdi-check"
                                type="submit"
                                class="flex-grow-1"
                                :disabled="!meta.valid"
                                :loading="loading"
                            >
                                Import
                            </VBtn>

                            <ShineEffectWrapper
                                class="flex-grow-1"
                                :shine-disabled="!meta.valid"
                            >
                                <VBtn
                                    variant="flat"
                                    color="primary"
                                    prepend-icon="mdi-creation"
                                    type="submit"
                                    width="100%"
                                    :disabled="!meta.valid"
                                >
                                    Setup sync
                                </VBtn>
                            </ShineEffectWrapper>

                            <VBtn
                                variant="flat"
                                color="error"
                                prepend-icon="mdi-close"
                                class="flex-grow-1"
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
