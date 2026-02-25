export {}
declare global {
  interface Window {
    isBuilder: boolean
    closePreview: () => void
    previewFullscreenUrl: string
  }
}
