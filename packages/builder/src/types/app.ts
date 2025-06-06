export type AppTemplate =
  | {
      fromFile: true
    }
  | {
      key: string
      name: string
      fromFile: false
      image: string
      background: string
      icon: string
    }
