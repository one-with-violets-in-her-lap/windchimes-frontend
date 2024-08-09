import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { Track } from '@/widgets/playlist-tracks/model/track'

export const useCurrentTrackStore = defineStore('currentTrack', () => {
    const currentTrack = ref<Track>()
    const paused = ref(false)

    return { currentTrack, paused }
})
