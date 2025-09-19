import type { Meta, StoryObj } from '@storybook/vue3-vite'

import DragAndDropStory from './drag-and-drop-story.vue'
import dragAndDropSampleCode from './drag-and-drop-story.vue?raw'

const meta = {
    component: DragAndDropStory,
    title: 'Drag and drop',
    tags: ['autodocs'],
    //👇 Our exports that end in "Data" are not stories.
    excludeStories: /.*Data$/,
    parameters: {
        docs: {
            source: {
                code: dragAndDropSampleCode,
            },
        },
    },
} satisfies Meta<typeof DragAndDropStory>

export default meta
type Story = StoryObj<typeof meta>

export const DragAndDropList: Story = {}
