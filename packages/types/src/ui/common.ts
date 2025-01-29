export type UIEvent = Event & {
  currentTarget: EventTarget & HTMLInputElement
} & { key?: string } & { target?: any }
