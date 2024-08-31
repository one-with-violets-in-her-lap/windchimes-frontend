<script setup lang="ts">
import { onMounted, ref } from 'vue'
import SiriWave from 'siriwave'

const props = defineProps<{
    audio?: HTMLAudioElement
}>()

const waveformContainer = ref<HTMLDivElement>()
let waveform: SiriWave | undefined = undefined
let waveformAnimatingIntervalId: number | undefined = 0

const audioContext = new AudioContext()

onMounted(() => {
    if (!waveformContainer.value || !props.audio) {
        return
    }

    const audioSource = audioContext.createMediaElementSource(props.audio)
    const analyser = audioContext.createAnalyser()
    audioSource.connect(analyser)

    const totalNumberOfSamples = audioContext.sampleRate / 5
    analyser.fftSize = 2 ** Math.floor(Math.log2(totalNumberOfSamples))

    analyser.connect(audioContext.destination)
    const byteTimeDomainData = new Uint8Array(analyser.frequencyBinCount)

    waveform = new SiriWave({
        container: waveformContainer.value,
        width: waveformContainer.value.clientWidth,
        color: '#FFFFFF',
        height: 200,
        autostart: true,
    })

    function updateWaveformAmplitude() {
        if (waveform) {
            analyser.getByteTimeDomainData(byteTimeDomainData)

            const amplitude =
                byteTimeDomainData.reduce((acc, y) => Math.max(acc, y), 128) - 128
            waveform.setAmplitude((amplitude / 128) * 10)

            requestAnimationFrame(updateWaveformAmplitude)
        }
    }

    requestAnimationFrame(updateWaveformAmplitude)
})
</script>

<template>
    <div ref="waveformContainer"></div>
</template>

<style scoped></style>
