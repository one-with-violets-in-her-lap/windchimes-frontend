<script setup lang="ts">
import { useAuth0, LocalStorageCache } from '@auth0/auth0-vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const { handleRedirectCallback } = useAuth0()

if (route.query.state && (route.query.code || route.query.error)) {
    handleRedirectCallback(route.fullPath).then(result => {
        router.push('/')
    })
}
</script>

<template>
    <VProgressCircular indeterminate :size="50" />
</template>
