<script setup lang="ts">
import { computed } from 'vue'
import { useDisplay } from 'vuetify'

const props = withDefaults(
    defineProps<{
        /**
         * Flag that determines if drawer must be positioned at the bottom on mobile
         * screens. Overrides `position` prop
         *
         * Equals `true` by default
         */
        positionAtTheBottomOnMobile?: boolean

        position?: 'left' | 'bottom' | 'right'

        fixedHeight?: string
    }>(),
    { fixedHeight: undefined, position: 'left' },
)

const opened = defineModel<boolean>('opened', { required: true })

const { mobile } = useDisplay()
const responsivePosition = computed(() => (mobile.value ? 'bottom' : props.position))
</script>

<template>
    <div>
        <VNavigationDrawer
            v-model="opened"
            :width="500"
            temporary
            rounded
            class="responsive-drawer elevation-0"
            touchless
            :location="positionAtTheBottomOnMobile ? responsivePosition : position"
            :class="{
                'side-drawer': !mobile || !positionAtTheBottomOnMobile,
                'fixed-height': fixedHeight,
            }"
            v-bind="$attrs"
        >
            <slot></slot>
        </VNavigationDrawer>
    </div>
</template>

<style scoped>
.responsive-drawer {
    padding: 20px;
    background-color: rgba(var(--v-theme-background), 0.75);
    backdrop-filter: blur(3px);
    max-height: 90%;
}

.side-drawer {
    height: 100% !important;
    top: 0px !important;
    max-height: 100%;
    max-width: 500px;
    width: 90% !important;
    min-width: 300px;
}

.fixed-height {
    min-height: v-bind(fixedHeight);
}
</style>
