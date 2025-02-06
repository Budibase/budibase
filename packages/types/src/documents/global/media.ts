export interface Media {
  name: string
  url: string
  size: number
  private: boolean
}

export interface UploadMediaRequest extends Omit<Media, "url"> {}
export interface UploadMediaResponse {
  size: number
  name: string
  url: string
  key: string
}

export interface DeleteMediaResponse {
  message: string
}

export interface FetchMediaResponse {
  assets: Media[]
  totalSize: number
}
