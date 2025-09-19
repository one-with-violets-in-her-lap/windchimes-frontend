import type { Meta, StoryObj } from '@storybook/vue3-vite'

import ErrorAlert from './error-alert.vue'

const meta = {
    component: ErrorAlert,
    title: 'Alert',
    tags: ['autodocs'],
    //👇 Our exports that end in "Data" are not stories.
    excludeStories: /.*Data$/,
} satisfies Meta<typeof ErrorAlert>

export default meta
type Story = StoryObj<typeof meta>

export const Error: Story = {
    args: {
        title: 'Error occurred',
        error: {
            technicalExplanation: 'Fetch failed',
            explanation: 'No internet connection',
            name: 'no-internet-error',
        },
    },
}
