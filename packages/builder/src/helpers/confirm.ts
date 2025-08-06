import ConfirmDialog from "@/components/common/ConfirmDialog.svelte"
import { tick } from "svelte"

export enum ConfirmOutput {}

export async function confirm(props: {
  title: string
  body?: string
  okText?: string
  cancelText?: string
  size?: "S" | "M" | "L" | "XL"
  onConfirm?: () => Promise<void> | void
  onCancel?: () => void
  onClose?: () => void
  warning?: boolean
}) {
  return await new Promise(resolve => {
    const dialog = new ConfirmDialog({
      target: document.body,
      props: {
        title: props.title,
        body: props.body,
        okText: props.okText,
        cancelText: props.cancelText,
        size: props.size,
        warning: props.warning,
        onOk: async () => {
          await tick()
          const result = await props.onConfirm?.()
          dialog.$destroy()
          resolve(result || true)
        },
        onCancel: () => {
          const result = props.onCancel?.()
          dialog.$destroy()
          resolve(result || false)
        },
        onClose: () => {
          const result = props.onClose?.()
          dialog.$destroy()
          resolve(result || false)
        },
      },
    })
    dialog.show()
  })
}
