<script>
  import { _ } from "../../../../lang/i18n"
  import {
    ModalContent,
    Button,
    Input,
    Checkbox,
    Heading,
    notifications,
    Context,
  } from "@budibase/bbui"
  import { environment } from "stores/portal"
  import ConfirmDialog from "components/common/ConfirmDialog.svelte"
  import { getContext } from "svelte"
  const modalContext = getContext(Context.Modal)

  export let save
  export let row

  let deleteDialog
  let name = row?.name || ""
  let productionValue
  let developmentValue
  let useProductionValue = true

  const HasSpacesRegex = /[\\"\s]/

  const deleteVariable = async name => {
    try {
      await environment.deleteVariable(name)
      modalContext.hide()
      notifications.success(
        $_("components.portal.environment.CreateEditVariableModal.deleted")
      )
    } catch (err) {
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
      notifications.success(
        $_("components.portal.environment.CreateEditVariableModal.saved")
      )
    } catch (err) {
      notifications.error(
        `${$_(
          "components.portal.environment.CreateEditVariableModal.Error"
        )} - ${err.message}`
      )
    }
  }
</script>

<ModalContent
  disabled={HasSpacesRegex.test(name)}
  onConfirm={() => saveVariable()}
  title={!row
    ? $_("components.portal.environment.CreateEditVariableModal.Add")
    : $_("components.portal.environment.CreateEditVariableModal.Edit")}
>
  <Input
    disabled={row}
    label="Name"
    bind:value={name}
    error={HasSpacesRegex.test(name) &&
      $_("components.portal.environment.CreateEditVariableModal.Must")}
  />
  <div>
    <Heading size="XS"
      >{$_(
        "components.portal.environment.CreateEditVariableModal.Production"
      )}</Heading
    >
    <Input
      type="password"
      label={$_("components.portal.environment.CreateEditVariableModal.Value")}
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
    <Heading size="XS"
      >{$_(
        "components.portal.environment.CreateEditVariableModal.Development"
      )}</Heading
    >
    <Input
      type="password"
      on:change={e => {
        developmentValue = e.detail
      }}
      disabled={useProductionValue}
      label="Value"
      value={useProductionValue ? productionValue : developmentValue}
      autocomplete="new-password"
    />
    <Checkbox
      bind:value={useProductionValue}
      text={$_("components.portal.environment.CreateEditVariableModal.Use")}
    />
  </div>

  <div class="footer" slot="footer">
    {#if row}
      <Button on:click={deleteDialog.show} warning
        >{$_(
          "components.portal.environment.CreateEditVariableModal.Del"
        )}</Button
      >
    {/if}
  </div>
</ModalContent>

<ConfirmDialog
  bind:this={deleteDialog}
  onOk={() => {
    deleteVariable(row.name)
  }}
  okText={$_("components.portal.environment.CreateEditVariableModal.Delete")}
  title={$_("components.portal.environment.CreateEditVariableModal.Confirm")}
>
  {$_("components.portal.environment.CreateEditVariableModal.Are")}
  <i>{row.name}?</i>
  {$_("components.portal.environment.CreateEditVariableModal.This")}
</ConfirmDialog>
