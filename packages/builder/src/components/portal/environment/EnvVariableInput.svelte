<script lang="ts">
  import {
    EnvDropdown,
    Modal,
    notifications,
    type EnvDropdownType,
  } from "@budibase/bbui"
  import { environment, licensing } from "@/stores/portal"
  import CreateEditVariableModal from "./CreateEditVariableModal.svelte"
  import type { CreateEnvironmentVariableRequest } from "@budibase/types"
  import { onMount } from "svelte"

  export let label: string = ""
  export let type: EnvDropdownType = "text"
  export let value: string | undefined = undefined
  export let error: string | undefined = undefined
  export let placeholder: string | undefined = undefined

  let modal: Modal

  async function handleUpgradePanel() {
    await environment.upgradePanelOpened()
    $licensing.goToUpgradePage()
  }

  async function saveVariable(data: CreateEnvironmentVariableRequest) {
    await environment.createVariable(data)
    value = `{{ env.${data.name} }}`
    modal.hide()
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
  variables={$environment.variables}
  environmentVariablesEnabled={$licensing.environmentVariablesEnabled}
  showModal={() => modal.show()}
  {handleUpgradePanel}
/>

<Modal bind:this={modal}>
  <CreateEditVariableModal save={saveVariable} />
</Modal>
