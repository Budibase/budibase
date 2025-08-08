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
  import { environment } from "@/stores/portal"
  import ConfirmDialog from "@/components/common/ConfirmDialog.svelte"
  import { getContext } from "svelte"

  const modalContext = getContext(Context.Modal)

  export let save: any
  export let row: { name: string } | undefined = undefined

  let deleteDialog: ConfirmDialog
  let name = row?.name || ""
  let productionValue: string
  let developmentValue: string
  let useProductionValue = true

  const HasSpacesRegex = /[\\"\s]/

  const deleteVariable = async (name: string) => {
    try {
      await environment.deleteVariable(name)
      modalContext.hide()
      notifications.success("Environment variable deleted")
    } catch (err: any) {
      notifications.error(err.message)
    }
  }

  const saveVariable = async () => {
    try {
      await save({
        name,
        production: productionValue,
        development: developmentValue,
      })
      notifications.success("Environment variable saved")
    } catch (err: any) {
      notifications.error(`Error saving environment variable - ${err.message}`)
    }
  }
</script>

<ModalContent
  disabled={HasSpacesRegex.test(name)}
  onConfirm={() => saveVariable()}
  title={!row ? "Add new environment variable" : "Edit environment variable"}
>
  <Input
    disabled={!!row}
    label="Name"
    bind:value={name}
    error={HasSpacesRegex.test(name) ? "Must not include spaces" : undefined}
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
      <Button on:click={deleteDialog.show} warning>Delete</Button>
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
