import type { Meta, StoryObj } from '@storybook/vue3-vite'

import ShinyLabelStory from './shiny-label-story.vue'

const meta = {
    component: ShinyLabelStory,
    title: 'Shine effect',
    tags: ['autodocs'],
    //👇 Our exports that end in "Data" are not stories.
    excludeStories: /.*Data$/,

    parameters: {
        docs: {
            source: {
                code: `
    <ShineEffectWrapper :shine-disabled="shineDisabled" :duration="duration">
        <div
            class="d-inline-block bg-primary rounded-lg pa-4 text-white text-h5 text-center"
            style="width: 300px"
        >
            Shiny
        </div>
    </ShineEffectWrapper>
`,
            },
        },
    },
} satisfies Meta<typeof ShinyLabelStory>

export default meta
type Story = StoryObj<typeof meta>

export const ShinyLabel: Story = {}
