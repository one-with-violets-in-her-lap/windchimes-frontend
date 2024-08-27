<script setup lang="ts">
import { useAuth0 } from '@auth0/auth0-vue'
import { useCurrentAccountActions } from '@/features/account-menu/api/current-account-actions'

const { user } = useAuth0()

const { requestLogIn, requestLogout } = useCurrentAccountActions()
</script>

<template>
    <VMenu v-if="user" :close-on-content-click="false">
        <template #activator="{ props }">
            <button v-bind="props">
                <VAvatar
                    :image="user.picture"
                    color="surface-darken-1"
                    icon="mdi-user"
                    class="mr-1"
                />

                {{ user.nickname }}

                <VIcon icon="mdi-chevron-down" />
            </button>
        </template>

        <VList>
            <slot name="append-items"></slot>

            <VListItem>
                <VBtn flat @click="requestLogout" class="text-capitalize">
                    Logout
                </VBtn>
            </VListItem>
        </VList>
    </VMenu>

    <VBtn
        v-else
        variant="flat"
        color="transparent"
        density="compact"
        class="text-capitalize px-0"
        prepend-icon="mdi-login"
        @click="requestLogIn"
    >
        Log in
    </VBtn>
</template>

<style scoped></style>
