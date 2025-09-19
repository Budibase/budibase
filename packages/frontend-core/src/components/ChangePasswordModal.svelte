<script lang="ts">
  import { ModalContent, Body, notifications } from "@budibase/bbui"
  import PasswordRepeatInput from "./PasswordRepeatInput.svelte"
  import type { APIClient } from "@budibase/frontend-core"
  import { createEventDispatcher } from "svelte"

  export let API: APIClient
  export let passwordMinLength: string | undefined = undefined
  export let notifySuccess = notifications.success
  export let notifyError = notifications.error
  export let labels: any = {}

  const dispatch = createEventDispatcher()

  let password: string = ""
  let error: string = ""

  const updatePassword = async () => {
    try {
      await API.updateSelf({ password })
      notifySuccess("Password changed successfully")
      dispatch("save")
    } catch (error) {
      notifyError("Failed to update password")
    }
  }

  const handleKeydown = (evt: KeyboardEvent) => {
    if (evt.key === "Enter" && !error && password) {
      updatePassword()
    }
  }
</script>

<svelte:window on:keydown={handleKeydown} />
<ModalContent
  title={labels?.title ?? "Update password"}
  confirmText={labels?.saveText ?? "Update password"}
  cancelText={labels?.cancelText ?? "Cancel"}
  onConfirm={updatePassword}
  disabled={!!error || !password}
>
  <Body size="S">{labels?.body ?? "Enter your new password below."}</Body>
  <PasswordRepeatInput
    bind:password
    bind:error
    minLength={passwordMinLength}
    {labels}
  />
</ModalContent>
