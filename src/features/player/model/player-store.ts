import { toRef } from 'vue'
import { defineStore } from 'pinia'
import { MediaSession } from '@jofr/capacitor-media-session'
import { usePlayerVolume } from '@/features/player/model/volume'
import type { PlaylistTrack } from '@/entities/track/model/track'
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
            async playNext() {
                try {
                    await playNextTrack()
                } catch (error) {
                    console.error(error)
                }
            },

            async playPrevious() {
                try {
                    await playPreviousTrack()
                } catch (error) {
                    console.error(error)
                }
            },
        },
    )

    const { volume } = usePlayerVolume(audio)

    /**
     * resumes the current track or plays a new one if `track` param is specified
     */
    function play(track?: TrackWithAudioFileUrl) {
        console.log(track)

        if (track?.trackAudioFileUrl) {
            audio.src = track.trackAudioFileUrl
            currentTrackId.value = track.id
            MediaSession.setMetadata({
                title: currentTrack.value?.name,
                artist: currentTrack.value?.owner.name,
                artwork: [{ src: currentTrack.value?.pictureUrl || '' }],
            })
        }

        playAudio()
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
