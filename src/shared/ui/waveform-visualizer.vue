<script setup lang="ts">
import SiriWave from 'siriwave'
import { onMounted, onUnmounted, ref } from 'vue'

const WAVEFORM_SIZE = 170

const props = defineProps<{
    audio?: HTMLAudioElement
}>()

const waveformContainer = ref<HTMLDivElement>()
let waveform: SiriWave | undefined = undefined

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

    initializeWaveform()

    function updateWaveformAmplitude() {
        if (waveform) {
            analyser.getByteTimeDomainData(byteTimeDomainData)

            const amplitude =
                byteTimeDomainData.reduce((acc, y) => Math.max(acc, y), 128) - 128
            waveform.setAmplitude(amplitude / 128)

            requestAnimationFrame(updateWaveformAmplitude)
        }
    }

    requestAnimationFrame(updateWaveformAmplitude)
})

onUnmounted(async () => {
    await audioContext.close()
})

function initializeWaveform() {
    if (waveformContainer.value) {
        if (waveform) {
            waveform.dispose()
        }

        waveform = new SiriWave({
            container: waveformContainer.value,
            width: WAVEFORM_SIZE,
            height: WAVEFORM_SIZE,
            color: '#FFFFFF',
            autostart: true,
            curveDefinition: [
                { attenuation: -2, lineWidth: 2, opacity: 0.1 },
                { attenuation: -6, lineWidth: 2, opacity: 0.2 },
                { attenuation: 4, lineWidth: 2, opacity: 0.4 },
                { attenuation: 2, lineWidth: 2, opacity: 0.6 },
                { attenuation: 1, lineWidth: 2.5, opacity: 1 },
            ],
        })
    }
}
</script>

<template>
    <div ref="waveformContainer"></div>
</template>

<style scoped></style>
