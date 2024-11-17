<script setup lang="ts">
import { useAuth0 } from '@auth0/auth0-vue'
import { useCurrentAccountActions } from '@/features/account-menu/api/current-account-actions'
import ThemeToggleButtons from '@/features/theme-toggle-buttons/ui/theme-toggle-buttons.vue'

const { user } = useAuth0()

const { requestLogIn, requestLogout } = useCurrentAccountActions()
</script>

<template>
    <VMenu :close-on-content-click="false">
        <template #activator="{ props }">
            <button v-if="user" v-bind="props">
                <VAvatar
                    :image="user.picture"
                    color="surface-darken-1"
                    icon="mdi-user"
                    class="mr-1"
                />

                {{ user.nickname }}

                <VIcon icon="mdi-chevron-down" />
            </button>

            <div v-else class="d-flex align-center gc-5 pr-2">
                <VBtn
                    variant="flat"
                    color="transparent"
                    density="compact"
                    class="text-capitalize px-0"
                    prepend-icon="mdi-login"
                    @click="requestLogIn"
                >
                    Log in
                </VBtn>

                <button v-bind="props" title="Settings" v-tooltip="'Settings'">
                    <VIcon icon="mdi-dots-horizontal-circle-outline" />
                </button>
            </div>
        </template>

        <VList>
            <VListItem>
                <ThemeToggleButtons />
            </VListItem>

            <VListItem v-if="user">
                <VBtn flat @click="requestLogout" class="text-capitalize">
                    Logout
                </VBtn>
            </VListItem>
        </VList>
    </VMenu>
</template>

<style scoped></style>
