<script lang="ts" setup>
import ShineEffectWrapper from '../shine-effect-wrapper.vue'

withDefaults(
    defineProps<{
        shineDisabled?: boolean
        duration?: number
    }>(),
    { duration: 650 },
)
</script>

<template>
    <ShineEffectWrapper :shine-disabled :duration>
        <div
            class="d-inline-block bg-primary rounded-lg pa-4 text-white text-h5 text-center"
            style="width: 300px"
        >
            Shiny
        </div>
    </ShineEffectWrapper>
</template>
