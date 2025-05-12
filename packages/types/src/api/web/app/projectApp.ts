export interface ProjectAppResponse {
  _id: string
  _rev: string
  name: string
  urlPrefix: string
  icon: string
  iconColor: string
}

export interface InsertProjectAppRequest {
  name: string
  urlPrefix: string
  icon: string
  iconColor: string
}

export interface InsertProjectAppResponse {
  projectApp: ProjectAppResponse
}

export interface UpdateProjectAppRequest {
  _id: string
  _rev: string
  name: string
  urlPrefix: string
  icon: string
  iconColor: string
}

export interface UpdateProjectAppResponse {
  projectApp: ProjectAppResponse
}
