import {
    type TrackWithAudioFileUrl,
    usePlayerStore,
} from '@/features/player/model/player-store'
import { usePlayerShortcuts } from '@/features/player/model/shortcuts'
import { usePlayerVolume } from '@/features/player/model/volume'
import TrackProgressBar from '@/features/player/track-progress-bar/ui/track-progress-bar.vue'
import VolumeMenuButton from '@/features/player/volume-menu-button/ui/volume-menu-button.vue'

export {
    VolumeMenuButton,
    TrackProgressBar,
    usePlayerStore,
    usePlayerShortcuts,
    usePlayerVolume,
    TrackWithAudioFileUrl,
}
