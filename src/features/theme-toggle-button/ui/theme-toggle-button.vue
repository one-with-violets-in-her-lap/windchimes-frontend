<script setup lang="ts">
import { useTheme } from 'vuetify'

const theme = useTheme()
function changeTheme(newTheme: string) {
    localStorage.setItem('theme', newTheme)
    theme.global.name.value = newTheme
}
</script>

<template>
    <v-btn-toggle
        divided
        :model-value="theme.global.name.value"
        @update:model-value="changeTheme"
    >
        <v-btn
            icon="mdi-white-balance-sunny"
            value="teaGreenLightTheme"
        ></v-btn>
        <v-btn icon="mdi-weather-night" value="teaGreenDarkTheme"></v-btn>
    </v-btn-toggle>
</template>

<style scoped></style>
