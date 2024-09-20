import { type TrackWithAudioFileUrl, usePlayerStore } from '@/features/player/model/player-store'
import { usePlayerShortcuts } from '@/features/player/model/shortcuts'
import { usePlayerVolume } from '@/features/player/model/volume'
import TrackTimeSlider from '@/features/player/track-time-slider/ui/track-time-slider.vue'
import TracksQueueDrawer from '@/features/player/tracks-queue-drawer/ui/tracks-queue-drawer.vue'
import VolumeMenuButton from '@/features/player/volume-menu-button/ui/volume-menu-button.vue'

export {
    TracksQueueDrawer,
    VolumeMenuButton,
    TrackTimeSlider,
    usePlayerStore,
    usePlayerShortcuts,
    usePlayerVolume,
    TrackWithAudioFileUrl
}
