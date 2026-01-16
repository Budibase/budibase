import ConfirmDialog from "@/components/common/ConfirmDialog.svelte"
import { tick, mount, unmount, flushSync } from "svelte"

export enum ConfirmOutput {}

type DialogExports = {
  show: () => void
  hide: () => void
}

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
    let dialog: DialogExports | null = null
    let mounted = false

    const cleanup = () => {
      if (dialog && mounted) {
        unmount(dialog)
        dialog = null
      }
    }

    dialog = mount(ConfirmDialog, {
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
          cleanup()
          resolve(result || true)
        },
        onCancel: () => {
          if (!mounted) return
          const result = props.onCancel?.()
          cleanup()
          resolve(result || false)
        },
        onClose: () => {
          if (!mounted) return
          const result = props.onClose?.()
          cleanup()
          resolve(result || false)
        },
      },
    })

    flushSync()
    mounted = true
    dialog.show()
  })
}
