<script>
  import {
    Layout,
    Heading,
    Body,
    Button,
    Divider,
    Modal,
    Table,
    Tags,
    Tag,
    InlineAlert,
    notifications,
  } from "@budibase/bbui"
  import { environment, licensing, auth, admin } from "stores/portal"
  import { onMount } from "svelte"
  import CreateEditVariableModal from "components/portal/environment/CreateEditVariableModal.svelte"
  import EditVariableColumn from "./_components/EditVariableColumn.svelte"

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
        `Error loading environment variables: ${error.message}`
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
      notifications.error(`Error saving variable: ${err.message}`)
    }
  }
</script>

<Layout noPadding>
  <Layout gap="XS" noPadding>
    <div class="title">
      <Heading size="M">Environment Variables</Heading>
      {#if !$licensing.environmentVariablesEnabled}
        <Tags>
          <Tag icon="LockClosed">Business plan</Tag>
        </Tags>
      {/if}
    </div>
    <Body
      >Add and manage environment variables for development and production</Body
    >
  </Layout>
  <Divider size="S" />

  {#if $licensing.environmentVariablesEnabled}
    {#if noEncryptionKey}
      <InlineAlert
        message="Your Budibase installation does not have a key for encryption, please update your app service's environment variables to contain an 'ENCRYPTION_KEY' value."
        header="No encryption key found"
        type="error"
      />
    {/if}
    <div>
      <Button on:click={modal.show} cta disabled={noEncryptionKey}
        >Add Variable</Button
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
  {:else}
    <div class="buttons">
      <Button
        primary
        disabled={!$auth.accountPortalAccess && $admin.cloud}
        on:click={async () => {
          await environment.upgradePanelOpened()
          $licensing.goToUpgradePage()
        }}
      >
        Upgrade
      </Button>
      <!--Show the view plans button-->
      <Button
        secondary
        on:click={() => {
          window.open("https://budibase.com/pricing/", "_blank")
        }}
      >
        View Plans
      </Button>
    </div>
  {/if}
</Layout>

<Modal bind:this={modal}>
  <CreateEditVariableModal {save} />
</Modal>

<style>
  .buttons {
    display: flex;
    gap: var(--spacing-l);
  }
  .title {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    gap: var(--spacing-m);
  }

  .buttons {
    display: flex;
    flex-direction: row;
    gap: var(--spacing-m);
  }
</style>
