import MediaUpload from "./media-upload";
import { FetchHandler } from './fetch-handler'

export interface Color {
    name: string,
    slug: string,
    color: string
}

export interface Gradient {
    name: string,
    slug: string,
    gradient: string
}

export interface FontSize {
    name: string,
    slug: string,
    size: number
}

export interface EditorStyle {
    css?: string,
    baseURL?: string,
    __unstableType?: string,
    isGlobalStyles?: boolean,
}

export default interface EditorSettings {
    // Laraberg settings
    height?: string,
    mediaUpload?: (upload: MediaUpload) => void,
    fetchHandler?: FetchHandler,
    disabledCoreBlocks?: string[],

    // WordPress settings
    alignWide?: boolean,
    supportsLayout?: boolean,
    maxWidth?: number,
    imageEditing?: boolean,

    colors?: Color[],
    gradients?: Gradient[],
    fontSizes?: FontSize[],

    // Iframe/canvas settings
    styles?: EditorStyle[],
    __unstableResolvedAssets?: {
        styles?: string,
        scripts?: string,
    },
    __internalIsInitialized?: boolean,
}
