<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import zod from 'zod'
import { PlaylistFormData } from '@/entities/playlists/playlist-form-dialog/model/playlist-form-data'
import { useForm } from 'vee-validate'

const props = withDefaults(
    defineProps<{
        initialFormData?: Partial<PlaylistFormData>
        loading: boolean
        title: string
        submitButtonText: string
    }>(),
    { submitButtonText: 'Submit', initialFormData: undefined },
)

const emit = defineEmits<{
    (event: 'submit', formData: PlaylistFormData): void
}>()

const dialogVisible = defineModel<boolean>('visible', {
    required: false,
    default: false,
})

const { defineField, errors, meta, handleSubmit } = useForm({
    validationSchema: toTypedSchema(
        zod.object({
            name: zod.string().min(3),
            description: zod.string().optional().nullable(),
        }),
    ),
    initialValues: props.initialFormData,
})
const [name] = defineField('name')
const [description] = defineField('description')

const handleFormSubmit = handleSubmit(values => emit('submit', values))
</script>

<template>
    <VDialog v-model="dialogVisible" max-width="600px">
        <template #activator="{ props: activatorProps }">
            <slot name="activator" :activator-props="activatorProps"></slot>
        </template>

        <VCard :title="title" elevation="0">
            <template #text>
                <VForm>
                    <VTextField
                        v-model="name"
                        label="Name"
                        placeholder="Playlist 1"
                        :error-messages="errors.name"
                        variant="outlined"
                        class="mb-2"
                    />

                    <VTextarea
                        v-model="description"
                        label="Description"
                        rows="6"
                        placeholder="Playlist 1"
                        :error-messages="errors.description"
                        variant="outlined"
                    />

                    <div class="d-flex ga-3 items-center flex-wrap">
                        <VBtn
                            variant="flat"
                            color="primary"
                            prepend-icon="mdi-check"
                            type="submit"
                            :disabled="!meta.valid"
                            :loading="loading"
                            @click="handleFormSubmit"
                        >
                            {{ submitButtonText }}
                        </VBtn>

                        <VBtn
                            variant="tonal"
                            color="error"
                            prepend-icon="mdi-close"
                            @click="dialogVisible = false"
                        >
                            Cancel
                        </VBtn>
                    </div>
                </VForm>
            </template>
        </VCard>
    </VDialog>
</template>

<style scoped></style>
