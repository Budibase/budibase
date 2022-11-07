export interface Document {
  _id?: string
  _rev?: string
  createdAt?: string | number
  updatedAt?: string
}

export interface AnyDocument extends Document {
  [key: string]: any
}
