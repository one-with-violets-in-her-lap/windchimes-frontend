import { toRef } from 'vue'
import { defineStore, storeToRefs } from 'pinia'
import { usePlayerVolume } from '@/features/player'
import type { PlaylistTrack } from '@/entities/tracks'
import { useTracksQueueStore } from '@/entities/tracks-queue'
import { useAudio } from '@/shared/model/reactive-audio'

export type TrackWithAudioFileUrl = Omit<
    PlaylistTrack & { trackAudioFileUrl: string },
    '__typename'
>

export const usePlayerStore = defineStore('player', () => {
    const tracksQueueStore = useTracksQueueStore()
    const { currentTrackId, currentTrack } = storeToRefs(tracksQueueStore)
    const { playNextTrack, playPreviousTrack, playTrackFromQueue } = tracksQueueStore

    const { audio, currentSecond, pauseAudio, paused, playAudio, rewind } = useAudio(
        toRef(() => currentTrack.value?.secondsDuration),
        {
            playNext: playNextTrack,
            playPrevious: playPreviousTrack,
        },
    )

    const { volume } = usePlayerVolume(audio)

    /**
     * resumes the current track or plays a new one if `track` param is specified
     */
    function play(track?: TrackWithAudioFileUrl) {
        if (!track) {
            playAudio()
            return
        }

        currentTrackId.value = track.id

        playAudio(track.trackAudioFileUrl, {
            title: currentTrack.value?.name,
            artist: currentTrack.value?.owner.name,
            artwork: [{ src: currentTrack.value?.pictureUrl || '' }],
        })
    }

    return {
        currentTrack,
        volume,
        paused,
        currentSecond,

        audio,

        pause: pauseAudio,
        play,
        rewind,
        playNextTrack,
        playPreviousTrack,
        playTrackFromQueue,
    }
})
