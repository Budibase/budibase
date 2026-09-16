<script lang="ts">
  import {
    ModalContent,
    Button,
    Input,
    Checkbox,
    Heading,
    notifications,
    Context,
  } from "@budibase/bbui"
  import type { CreateEnvironmentVariableRequest } from "@budibase/types"
  import { environment } from "@/stores/portal"
  import type { EnvVar } from "@/stores/portal/environment"
  import ConfirmDialog from "@/components/common/ConfirmDialog.svelte"
  import { getContext } from "svelte"

  interface Props {
    save: (data: CreateEnvironmentVariableRequest) => void | Promise<void>
    row?: EnvVar
  }

  let { save, row }: Props = $props()
  const modalContext = getContext(Context.Modal)

  let deleteDialog = $state<ConfirmDialog>()
  let name = $state(row?.name || "")
  let productionValue = $state("")
  let developmentValue = $state("")
  let useProductionValue = $state(true)
  let submitted = $state(false)

  const HasSpacesRegex = /[\\"\s]/

  const invalidName = $derived(HasSpacesRegex.test(name))
  const disabled = $derived(invalidName || !productionValue)

  const deleteVariable = async (name: string) => {
    try {
      await environment.deleteVariable(name)
      modalContext.hide()
      notifications.success("Environment variable deleted")
    } catch (err) {
      notifications.error(err instanceof Error ? err.message : `${err}`)
    }
  }

  const saveVariable = async () => {
    submitted = true
    try {
      await save({
        name,
        production: productionValue,
        development: developmentValue,
      })
      notifications.success("Environment variable saved")
    } catch (err) {
      notifications.error(
        `Error saving environment variable - ${err instanceof Error ? err.message : err}`
      )
    }
  }
</script>

<ModalContent
  {disabled}
  onConfirm={() => saveVariable()}
  title={!row ? "Add new environment variable" : "Edit environment variable"}
>
  <Input
    disabled={!!row}
    label="Name"
    bind:value={name}
    required={!row}
    error={invalidName ? "Must not include spaces" : undefined}
  />
  <div>
    <Heading size="XS">Production</Heading>
    <Input
      label="Value"
      on:change={e => {
        productionValue = e.detail
        if (useProductionValue) {
          developmentValue = e.detail
        }
      }}
      value={productionValue}
      autocomplete="new-password"
      required={!row}
      error={submitted && !row && !productionValue ? "Required" : undefined}
    />
  </div>
  <div>
    <Heading size="XS">Development</Heading>
    <Input
      on:change={e => {
        developmentValue = e.detail
      }}
      disabled={useProductionValue}
      label="Value"
      value={useProductionValue ? productionValue : developmentValue}
      autocomplete="new-password"
    />
    <Checkbox bind:value={useProductionValue} text="Use production value" />
  </div>

  <div class="footer" slot="footer">
    {#if row}
      <Button on:click={() => deleteDialog?.show()} warning>Delete</Button>
    {/if}
  </div>
</ModalContent>

<ConfirmDialog
  bind:this={deleteDialog}
  onOk={() => {
    deleteVariable(name)
  }}
  okText="Delete Environment Variable"
  title="Confirm Deletion"
>
  Are you sure you wish to delete the environment variable
  <i>{name}?</i>
  This action cannot be undone.
</ConfirmDialog>
