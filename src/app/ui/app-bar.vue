<script setup lang="ts">
import { useAuth0 } from '@auth0/auth0-vue'
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { PreferencesDrawer } from '@/widgets/preferences-drawer'

import { SearchMenu } from '@/features/search-menu'
import ThemeToggleButtons from '@/features/theme-toggle-buttons/ui/theme-toggle-buttons.vue'

import { DropdownButton, DropdownMenu } from '@/shared/ui/dropdown-menu'
import { useLoginAndLogout } from '@/shared/utils/login-and-logout'
import { truncateText } from '@/shared/utils/strings'

const router = useRouter()
const route = useRoute()

const { user } = useAuth0()
const { requestLogIn, requestLogout } = useLoginAndLogout()

const preferencesDrawerOpened = ref(false)
</script>

<template>
    <VAppBar
        class="z-index-default position-static border-b-sm"
        color="background"
        elevation="0"
    >
        <VBtn
            v-if="route.name !== 'home'"
            icon="mdi-arrow-left"
            @click="router.back"
        />

        <template #append>
            <nav class="gc-3 d-flex align-center">
                <DropdownMenu :close-on-content-click="false">
                    <template #activator="{ props }">
                        <button
                            v-if="user?.nickname"
                            v-bind="props"
                            class="d-flex align-center text-sm-body-1 text-body-2"
                        >
                            <VAvatar
                                :image="user.picture"
                                color="surface-darken-1"
                                icon="mdi-user"
                                class="mr-2"
                            />

                            {{ truncateText(user.nickname, 19) }}
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

                            <button
                                v-tooltip="'Settings'"
                                v-bind="props"
                                title="Settings"
                            >
                                <VIcon icon="mdi-dots-horizontal-circle-outline" />
                            </button>
                        </div>
                    </template>

                    <template #default="{ isActive }">
                        <VListItem>
                            <ThemeToggleButtons />
                        </VListItem>

                        <DropdownButton
                            prepend-icon="mdi-tune"
                            @click="
                                () => {
                                    isActive.value = false
                                    preferencesDrawerOpened = true
                                }
                            "
                        >
                            Preferences
                        </DropdownButton>

                        <DropdownButton
                            v-if="user"
                            prepend-icon="mdi-logout"
                            @click="requestLogout"
                        >
                            Logout
                        </DropdownButton>
                    </template>
                </DropdownMenu>

                <SearchMenu />
            </nav>
        </template>
    </VAppBar>

    <PreferencesDrawer v-model:opened="preferencesDrawerOpened" />
</template>

<style scoped>
.z-index-default {
    z-index: 1 !important;
}
</style>
