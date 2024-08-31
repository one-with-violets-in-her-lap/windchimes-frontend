import WaveformData from 'waveform-data'

export async function getWaveformData(audioFileUrl: string) {
    const audioArrayBuffer = await (await fetch(audioFileUrl)).arrayBuffer()

    return new Promise<number[]>(resolve => {
        WaveformData.createFromAudio(
            {
                array_buffer: audioArrayBuffer,
                audio_context: new AudioContext(),
            },
            (_, result) => resolve(result.toJSON().data),
        )
    })
}
