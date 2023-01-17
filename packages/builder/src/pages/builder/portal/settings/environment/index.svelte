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
  } from "@budibase/bbui"
  import { environment, licensing, auth, admin } from "stores/portal"
  import { onMount } from "svelte"
  import CreateEditVariableModal from "./_components/CreateEditVariableModal.svelte"
  import EditVariableColumn from "./_components/EditVariableColumn.svelte"

  let modal

  const schema = {
    name: {
      width: "2fr",
    },
    edit: {
      width: "auto",
      borderLeft: true,
      displayName: "",
    },
  }

  const customRenderers = [{ column: "edit", component: EditVariableColumn }]

  onMount(async () => {
    await environment.loadVariables()
  })

  const save = data => {
    environment.createVariable(data)
    modal.hide()
  }
</script>

<Layout noPadding>
  <Layout gap="XS" noPadding>
    <div class="title">
      <Heading size="M">Envrironment Variables</Heading>
      {#if !$licensing.environmentVariablesEnabled}
        <Tags>
          <Tag icon="LockClosed">Pro plan</Tag>
        </Tags>
      {/if}
    </div>
    <Body
      >Add and manage environment variables for development and production</Body
    >
  </Layout>
  {#if $licensing.environmentVariablesEnabled}
    <Divider size="S" />
    <Layout noPadding>
      <Table
        {schema}
        data={$environment}
        allowEditColumns={false}
        allowEditRows={false}
        allowSelectRows={false}
        {customRenderers}
      />
    </Layout>
    <div>
      <Button on:click={modal.show} cta>Add Variable</Button>
    </div>
  {:else}
    <Divider />
    <div class="buttons">
      <Button
        primary
        disabled={!$auth.accountPortalAccess && $admin.cloud}
        on:click={$licensing.goToUpgradePage()}
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
</style>
