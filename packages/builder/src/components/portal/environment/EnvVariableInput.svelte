<script lang="ts">
  import { EnvDropdown, Modal, notifications } from "@budibase/bbui"
  import { environment, licensing } from "@/stores/portal"
  import CreateEditVariableModal from "./CreateEditVariableModal.svelte"
  import type { CreateEnvironmentVariableRequest } from "@budibase/types"
  import { createEventDispatcher, onMount } from "svelte"
  import { helpers } from "@budibase/shared-core"

  const dispatch = createEventDispatcher()

  type TypeValueProps =
    | { type?: "text" | "password"; value?: string }
    | { type: "number" | "port"; value?: string | number }

  type Props = TypeValueProps & {
    label?: string
    error?: string | undefined
    placeholder?: string | undefined
    required?: boolean
    description?: string | undefined
    autocomplete?: HTMLInputElement["autocomplete"]
  }

  let {
    label = "",
    type = "text",
    value = $bindable(),
    error = undefined,
    placeholder = undefined,
    required = false,
    description = undefined,
    autocomplete = undefined,
  }: Props = $props()

  let modal = $state<Modal>()

  async function handleUpgradePanel() {
    await environment.upgradePanelOpened()
    licensing.goToUpgradePage()
  }

  async function saveVariable(data: CreateEnvironmentVariableRequest) {
    await environment.createVariable(data)
    value = `{{ env.${data.name} }}`
    dispatch("change", value)
    modal?.hide()
  }

  const onInput = (e: Event) => {
    if (
      e.target &&
      "value" in e.target &&
      ["number", "port"].includes(type) &&
      !helpers.isEnvironmentVariableKey(e.target.value) &&
      e.target.value != null
    ) {
      const safeValue = Number(e.target.value)
      e.target.value = isNaN(safeValue) ? value : safeValue
    }
  }

  $effect(() => {
    if (
      ["number", "port"].includes(type) &&
      !helpers.isEnvironmentVariableKey(value) &&
      typeof value !== "number"
    ) {
      const numericValue = Number(value)
      value =
        typeof value === "string" && value.trim() === ""
          ? value
          : Number.isFinite(numericValue)
            ? numericValue
            : value
    }
  })

  onMount(async () => {
    try {
      // load the environment variables
      await environment.loadVariables()
    } catch (error) {
      notifications.error(`Error getting environment variables - ${error}`)
    }
  })
</script>

<!-- Type needs to always be a string, as selected env are strings. Type values are processed on onInput -->
<EnvDropdown
  on:change
  on:blur
  on:input={onInput}
  bind:value
  {label}
  type="text"
  {error}
  {placeholder}
  {autocomplete}
  {required}
  {description}
  variables={$environment.variables}
  environmentVariablesEnabled={$licensing.environmentVariablesEnabled}
  showModal={() => modal?.show()}
  {handleUpgradePanel}
/>

<Modal bind:this={modal}>
  <CreateEditVariableModal save={saveVariable} />
</Modal>
