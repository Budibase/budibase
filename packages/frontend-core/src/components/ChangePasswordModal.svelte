<script lang="ts">
  import { ModalContent, Body, notifications } from "@budibase/bbui"
  import PasswordRepeatInput from "./PasswordRepeatInput.svelte"
  import type { APIClient } from "@budibase/frontend-core"
  import { createEventDispatcher } from "svelte"
  import { resolveTranslationGroup } from "@budibase/shared-core"

  export let API: APIClient
  export let passwordMinLength: string | undefined = undefined
  export let notifySuccess = notifications.success
  export let notifyError = notifications.error
  // Get the default translations for the password modal and derive a type from it.
  // `labels` can override any subset of these defaults while keeping type safety.
  const DEFAULT_LABELS = resolveTranslationGroup("passwordModal")
  type PasswordModalLabels = typeof DEFAULT_LABELS

  export let labels: Partial<PasswordModalLabels> = {}

  const dispatch = createEventDispatcher()

  $: resolvedLabels = {
    ...DEFAULT_LABELS,
    ...labels,
  } as PasswordModalLabels

  let password: string = ""
  let error: string = ""

  const updatePassword = async () => {
    try {
      await API.updateSelf({ password })
      notifySuccess(resolvedLabels.successText)
      dispatch("save")
    } catch (error) {
      notifyError(resolvedLabels.errorText)
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
  title={resolvedLabels.title}
  confirmText={resolvedLabels.saveText}
  cancelText={resolvedLabels.cancelText}
  onConfirm={updatePassword}
  disabled={!!error || !password}
>
  <Body size="S">{resolvedLabels.body}</Body>
  <PasswordRepeatInput
    bind:password
    bind:error
    minLength={passwordMinLength}
    labels={resolvedLabels}
  />
</ModalContent>
