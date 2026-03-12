<script lang="ts">
  import { EnvDropdown, Modal, notifications } from "@budibase/bbui"
  import { environment, licensing } from "@/stores/portal"
  import CreateEditVariableModal from "./CreateEditVariableModal.svelte"
  import type { CreateEnvironmentVariableRequest } from "@budibase/types"
  import { createEventDispatcher, onMount } from "svelte"

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

  onMount(async () => {
    try {
      // load the environment variables
      await environment.loadVariables()
    } catch (error) {
      notifications.error(`Error getting environment variables - ${error}`)
    }
  })
</script>

<EnvDropdown
  on:change
  on:blur
  bind:value
  {label}
  type={type === "port" ? "text" : type}
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
