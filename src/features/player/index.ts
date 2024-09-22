import { type TrackWithAudioFileUrl, usePlayerStore } from '@/features/player/model/player-store'
import { usePlayerShortcuts } from '@/features/player/model/shortcuts'
import { usePlayerVolume } from '@/features/player/model/volume'
import TrackTimeSlider from '@/features/player/track-time-slider/ui/track-time-slider.vue'
import VolumeMenuButton from '@/features/player/volume-menu-button/ui/volume-menu-button.vue'

export {
    VolumeMenuButton,
    TrackTimeSlider,
    usePlayerStore,
    usePlayerShortcuts,
    usePlayerVolume,
    TrackWithAudioFileUrl
}
