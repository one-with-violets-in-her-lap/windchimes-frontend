import type { Meta, StoryObj } from '@storybook/vue3-vite'

import ShinyLabelStory from './shiny-label-story.vue'

const meta = {
    component: ShinyLabelStory,
    title: 'Shine effect',
    tags: ['autodocs'],
    //👇 Our exports that end in "Data" are not stories.
    excludeStories: /.*Data$/,
} satisfies Meta<typeof ShinyLabelStory>

export default meta
type Story = StoryObj<typeof meta>

export const ShinyLabel: Story = {}
