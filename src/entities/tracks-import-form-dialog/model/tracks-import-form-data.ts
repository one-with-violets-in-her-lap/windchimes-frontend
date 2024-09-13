import { Platform } from '@/entities/platform/model/platform'

export interface TracksImportFormData {
    playlistToImportUrl: string
    platform?: Platform
}
