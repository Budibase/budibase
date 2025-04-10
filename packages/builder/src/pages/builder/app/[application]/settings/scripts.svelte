<script lang="ts">
  import {
    Body,
    Button,
    Link,
    Divider,
    Heading,
    Layout,
    Table,
    Label,
    Input,
    TextArea,
    Select,
    Helpers,
    notifications,
    Tag,
    Tags,
    ButtonGroup,
  } from "@budibase/bbui"
  import { appStore } from "@/stores/builder"
  import { type AppScript } from "@budibase/types"
  import { getSequentialName } from "@/helpers/duplicate"
  import ConfirmDialog from "@/components/common/ConfirmDialog.svelte"
  import { licensing, auth, admin } from "@/stores/portal"

  const schema = {
    name: {
      type: "string",
      label: "Name",
    },
    location: {
      type: "string",
      label: "Location",
    },
  }

  let selectedScript: AppScript | undefined
  let isNew = false
  let confirmDeleteModal: any

  $: nameError = selectedScript?.name ? undefined : "Please enter a name"
  $: invalid = !!nameError
  $: enabled = $licensing.customAppScriptsEnabled

  const addScript = () => {
    const name = getSequentialName($appStore.scripts, "Script ", {
      getName: script => script.name,
      numberFirstItem: true,
    })
    selectedScript = { id: Helpers.uuid(), location: "Head", name }
    isNew = true
  }

  const editScript = (e: any) => {
    selectedScript = { ...(e.detail as AppScript) }
    isNew = false
  }

  const cancel = () => {
    selectedScript = undefined
  }

  const save = async () => {
    if (!selectedScript) {
      return
    }
    const newScripts = $appStore.scripts
      .filter(script => script.id !== selectedScript!.id)
      .concat([selectedScript])
    await appStore.updateApp({ scripts: newScripts })
    notifications.success("Script saved successfully")
    selectedScript = undefined
  }

  const requestDeletion = () => {
    confirmDeleteModal?.show()
  }

  const deleteScript = async () => {
    if (!selectedScript) {
      return
    }
    const newScripts = $appStore.scripts.filter(
      script => script.id !== selectedScript!.id
    )
    await appStore.updateApp({ scripts: newScripts })
    notifications.success("Script deleted successfully")
    selectedScript = undefined
  }
</script>

<Layout noPadding>
  <Layout gap="XS" noPadding>
    <div class="title">
      <Heading>App scripts</Heading>
      {#if !enabled}
        <Tags>
          <Tag icon="LockClosed">Enterprise</Tag>
        </Tags>
      {/if}
    </div>
    <div class="subtitle">
      <Body>
        Inject analytics, scripts or stylesheets into your app<br />
        <Link href="https://docs.budibase.com/docs/app-scripts" target="_blank">
          Learn more about script injection in the docs
        </Link>
      </Body>
      {#if !selectedScript && enabled}
        <Button cta on:click={addScript}>Add script</Button>
      {/if}
    </div>
  </Layout>
  <Divider />
  {#if !enabled}
    {#if $admin.cloud && !$auth.accountPortalAccess}
      <Body>Contact your account holder to upgrade your plan.</Body>
    {/if}
    <ButtonGroup>
      {#if $admin.cloud && $auth.accountPortalAccess}
        <Button cta on:click={$licensing.goToUpgradePage}>Upgrade</Button>
      {/if}
      <Button
        secondary
        on:click={() => window.open("https://budibase.com/pricing/", "_blank")}
      >
        View plans
      </Button>
    </ButtonGroup>
  {:else if selectedScript}
    <Heading size="S">{isNew ? "Add new script" : "Edit script"}</Heading>
    <div class="form">
      <Label size="L">Name</Label>
      <Input bind:value={selectedScript.name} error={nameError} />
      <Label size="L">Location</Label>
      <Select
        bind:value={selectedScript.location}
        options={["Head", "Body"]}
        placeholder={false}
      />
      <Label size="L">HTML</Label>
      <TextArea
        bind:value={selectedScript.html}
        minHeight={200}
        placeholder="&lt;script&gt;...&lt;/script&gt;"
      />
      <Label size="L">
        CSP whitelist<br />
        <Link
          href="https://docs.budibase.com/docs/app-scripts#domain-whitelisting-for-content-security-policy-csp"
          target="_blank"
        >
          Learn more
        </Link>
      </Label>
      <TextArea
        bind:value={selectedScript.cspWhitelist}
        minHeight={100}
        placeholder="https://external.api.com&#013;https://*.domain.com"
      />
      <div />
      <div class="buttons">
        {#if !isNew}
          <Button warning quiet on:click={requestDeletion}>Delete</Button>
        {/if}
        <Button secondary on:click={cancel}>Cancel</Button>
        <Button cta disabled={invalid} on:click={save}>Save</Button>
      </div>
    </div>
  {:else}
    <Table
      on:click={editScript}
      {schema}
      data={$appStore.scripts}
      allowSelectRows={false}
      allowEditColumns={false}
      allowEditRows={false}
      placeholderText="You haven't added any scripts yet"
    />
  {/if}
</Layout>

<ConfirmDialog
  bind:this={confirmDeleteModal}
  title="Delete script"
  body="Are you sure you want to delete this script?"
  onOk={deleteScript}
/>

<style>
  .title,
  .subtitle {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    gap: var(--spacing-l);
  }
  .subtitle {
    justify-content: space-between;
  }
  .form {
    display: grid;
    grid-template-columns: 100px 480px;
    row-gap: var(--spacing-l);
  }
  .form :global(.spectrum-FieldLabel) {
    padding-top: 7px;
  }
  .buttons {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    gap: var(--spacing-l);
  }
</style>
