import {
    LoopMode,
    type QueueItemWithAudioFileUrl,
    usePlayerStore,
} from './model/player-store'
import { usePlayerShortcuts } from './model/shortcuts'
import { usePlayerVolume } from './model/volume'
import TrackProgressBar from './ui/track-progress-bar.vue'
import VolumeMenuButton from './ui/volume-menu-button.vue'
import {
    initializePlayer,
    usePlayerMediaLoadErrorNotifications,
} from './utils/player-initialization'

export {
    VolumeMenuButton,
    TrackProgressBar,
    usePlayerStore,
    usePlayerShortcuts,
    usePlayerVolume,
    usePlayerMediaLoadErrorNotifications,
    initializePlayer,
    QueueItemWithAudioFileUrl as TrackWithAudioFileUrl,
    LoopMode,
}
