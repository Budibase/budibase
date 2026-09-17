<script lang="ts">
  import { ModalContent, Body, notifications } from "@budibase/bbui"
  import type { APIClient } from "@budibase/frontend-core"
  import {
    DEFAULT_PASSWORD_POLICY,
    resolveTranslationGroup,
  } from "@budibase/shared-core"
  import type { PasswordPolicy } from "@budibase/types"
  import { createEventDispatcher } from "svelte"
  import PasswordRepeatInput from "./PasswordRepeatInput.svelte"

  export let API: APIClient
  export let passwordPolicy: PasswordPolicy = DEFAULT_PASSWORD_POLICY
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
    policy={passwordPolicy}
    labels={resolvedLabels}
  />
</ModalContent>
