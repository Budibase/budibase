<script>
  import {
    Layout,
    Button,
    Modal,
    Table,
    InlineAlert,
    notifications,
  } from "@budibase/bbui"
  import { environment, licensing } from "stores/portal"
  import { onMount } from "svelte"
  import CreateEditVariableModal from "components/portal/environment/CreateEditVariableModal.svelte"
  import EditVariableColumn from "./_components/EditVariableColumn.svelte"
  import LockedFeature from "../../_components/LockedFeature.svelte"

  import { _ } from "../../../../../../lang/i18n"

  let modal

  const customRenderers = [{ column: "edit", component: EditVariableColumn }]

  $: noEncryptionKey = $environment.status?.encryptionKeyAvailable === false
  $: schema = buildSchema(noEncryptionKey)

  onMount(async () => {
    try {
      await environment.checkStatus()
      await environment.loadVariables()
    } catch (error) {
      notifications.error(
        `${$_(
          "pages.builder.portal.settings.enviroment.index.Error_environment"
        )}: ${error.message}`
      )
    }
  })

  const buildSchema = noEncryptionKey => {
    const schema = {
      name: {
        width: "2fr",
      },
    }
    if (!noEncryptionKey) {
      schema.edit = {
        width: "auto",
        borderLeft: true,
        displayName: "",
      }
    }
    return schema
  }

  const save = async data => {
    try {
      await environment.createVariable(data)
      modal.hide()
    } catch (err) {
      notifications.error(
        `${$_(
          "pages.builder.portal.settings.enviroment.index.Error_saving"
        )}: ${err.message}`
      )
    }
  }
</script>

<LockedFeature
  title={$_(
    "pages.builder.portal.settings.enviroment.index.Environment_Variables"
  )}
  planType={$_("pages.builder.portal.settings.enviroment.index.Business_plan")}
  description={$_(
    "pages.builder.portal.settings.enviroment.index.Add_manage_environment"
  )}
  enabled={$licensing.environmentVariablesEnabled}
  upgradeButtonClick={async () => {
    await environment.upgradePanelOpened()
    $licensing.goToUpgradePage()
  }}
>
  {#if noEncryptionKey}
    <InlineAlert
      message={$_(
        "pages.builder.portal.settings.enviroment.index.Budibase_encryption"
      )}
      header={$_(
        "pages.builder.portal.settings.enviroment.index.No_encryption"
      )}
      type="error"
    />
  {/if}
  <div>
    <Button on:click={modal.show} cta disabled={noEncryptionKey}
      >{$_(
        "pages.builder.portal.settings.enviroment.index.Add_Variable"
      )}</Button
    >
  </div>
  <Layout noPadding>
    <Table
      {schema}
      data={$environment.variables}
      allowEditColumns={false}
      allowEditRows={false}
      allowSelectRows={false}
      {customRenderers}
    />
  </Layout>
</LockedFeature>

<Modal bind:this={modal}>
  <CreateEditVariableModal {save} />
</Modal>

<style>
</style>
