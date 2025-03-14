import ConfirmDialog from "@/components/common/ConfirmDialog.svelte"

export async function confirm(props: {
  title: string
  body?: string
  okText?: string
  cancelText?: string
  size?: "S" | "M" | "L" | "XL"
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
        onOk: () => {
          dialog.$destroy()
          resolve(true)
        },
        onCancel: () => {
          dialog.$destroy()
          resolve(false)
        },
      },
    })
    dialog.show()
  })
}
