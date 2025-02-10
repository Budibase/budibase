export interface UIEvent extends Omit<Event, "target"> {
  currentTarget: EventTarget & HTMLInputElement
  key?: string
  target?: any
}
