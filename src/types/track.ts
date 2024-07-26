export interface Track {
    platform: 'soundcloud' | 'youtube'
    title: string
    author: {
        username: string
    }
}
