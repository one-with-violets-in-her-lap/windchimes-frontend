<script setup lang="ts">
import { useAuth0 } from '@auth0/auth0-vue'

const { user, isLoading, loginWithRedirect } = useAuth0()
</script>

<template>
    <span v-if="user">
        {{ user.nickname }}
    </span>

    <VBtn
        v-else
        variant="flat"
        density="compact"
        class="text-capitalize px-0"
        prepend-icon="mdi-login"
        @click="loginWithRedirect"
    >
        Log in
    </VBtn>
</template>

<style scoped></style>
