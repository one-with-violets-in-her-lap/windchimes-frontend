import type { Meta, StoryObj } from '@storybook/vue3-vite'

import SwipableElementStory from './swipable-element-story.vue'
import swipableElementSampleCode from './swipable-element-story.vue?raw'

const meta = {
    component: SwipableElementStory,
    title: 'Swipable element',
    tags: ['autodocs'],
    //👇 Our exports that end in "Data" are not stories.
    excludeStories: /.*Data$/,

    parameters: {
        docs: {
            source: {
                code: swipableElementSampleCode,
            },
        },
    },
} satisfies Meta<typeof SwipableElementStory>

export default meta
type Story = StoryObj<typeof meta>

export const SwipableElement: Story = {}
