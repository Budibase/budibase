export interface PutAccountUser {
  createdAt: number
}

export interface PutAccountUserResponse {
  userId: string
  createdAt: number
}

export interface PostAccountUserActivity {
  timestamp: number
}

export interface PostAccountUserActivityResponse {
  userId: string
  timestamp: number
}
