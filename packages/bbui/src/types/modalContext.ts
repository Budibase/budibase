import { ModalCancelFrom } from "../constants"

export interface ModalContext {
  cancel: (from: ModalCancelFrom) => void
  hide: () => void
}
