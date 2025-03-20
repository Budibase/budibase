import ConfirmDialog from "@/components/common/ConfirmDialog.svelte"

export enum ConfirmOutput {}

export async function confirm(props: {
  title: string
  body?: string
  okText?: string
  cancelText?: string
  size?: "S" | "M" | "L" | "XL"
  onConfirm?: () => void
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
        onOk: () => {
          dialog.$destroy()
          resolve(props.onConfirm?.() || true)
        },
        onCancel: () => {
          dialog.$destroy()
          resolve(props.onCancel?.() || false)
        },
        onClose: () => {
          dialog.$destroy()
          resolve(props.onClose?.() || false)
        },
      },
    })
    dialog.show()
  })
}
