<script setup lang="ts">
defineOptions({
    inheritAttrs: false,
})
</script>

<template>
    <VListItem class="p-0">
        <VBtn
            variant="text"
            class="text-capitalize justify-start"
            width="100%"
            v-bind="$attrs"
        >
            <slot></slot>
        </VBtn>
    </VListItem>
</template>

<style scoped></style>
