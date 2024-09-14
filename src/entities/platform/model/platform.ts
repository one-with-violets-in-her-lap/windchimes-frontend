export enum Platform {
    Soundcloud = 'SOUNDCLOUD',
    Youtube = 'YOUTUBE',
}

export const platformSelectItems = Object.keys(Platform).map(
    platform => `${platform}`,
)
