<script setup lang="ts">
import { computed, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { usePlayerStore } from '@/features/player'
import { TrackItem } from '@/features/track'
import { PlaylistTrack } from '@/entities/tracks'
import ResponsiveDrawer from '@/shared/ui/responsive-drawer.vue'

defineProps<{
    openButtonVisible: boolean
}>()

const opened = ref(false)

const { tracksQueue } = storeToRefs(usePlayerStore())
const loadedTracks = computed(() => tracksQueue.value.filter(track => track.__typename === 'TrackGraphQL'))
</script>

<template>
    <div>
        <Transition name="scale-up">
            <VBtn
                icon="mdi-playlist-play"
                elevation="2"
                border
                size="46px"
                class="open-tracks-queue-button"
                v-show="openButtonVisible && !opened"
                @click.stop="opened = true"
            >
            </VBtn>
        </Transition>

        <ResponsiveDrawer v-model:opened="opened">
            <TrackItem v-for="track, index in loadedTracks" :key="track.id" :track-number="index + 1" :track="track as PlaylistTrack" :all-playlist-tracks="tracksQueue" />
        </ResponsiveDrawer>
    </div>
</template>

<style scoped>
.open-tracks-queue-button {
    position: fixed;
    right: 10px;
    bottom: 40px;
}
</style>
