import { toRef } from 'vue'
import { defineStore } from 'pinia'
import { usePlayerVolume } from '@/features/player/model/volume'
import type { PlaylistTrack } from '@/entities/tracks'
import { useTracksQueue } from '@/entities/tracks-queue/model/tracks-queue'
import { useAudio } from '@/shared/model/reactive-audio'

export type TrackWithAudioFileUrl = Omit<
    PlaylistTrack & { trackAudioFileUrl: string },
    '__typename'
>

export const usePlayerStore = defineStore('player', () => {
    const {
        currentTrack,
        currentTrackId,
        tracksQueue,
        loop,
        playNextTrack,
        playPreviousTrack,
        shuffleQueue,
    } = useTracksQueue(play)

    const { audio, currentSecond, pauseAudio, paused, playAudio, rewind } = useAudio(
        toRef(() => currentTrack.value?.secondsDuration),
        {
            playNext: playNextTrack,
            playPrevious: playPreviousTrack,
        },
    )

    let { volume } = usePlayerVolume(audio)

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
        tracksQueue,
        volume,
        loop,
        paused,
        currentSecond,

        audio,

        pause: pauseAudio,
        play,
        rewind,
        playNextTrack,
        playPreviousTrack,
        shuffleQueue,
    }
})
