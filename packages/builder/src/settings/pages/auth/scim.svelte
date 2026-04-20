<script>
  import {
    Button,
    Heading,
    Label,
    notifications,
    Layout,
    Body,
    Toggle,
    Input,
    Icon,
    Helpers,
    Modal,
    ModalContent,
    RadioGroup,
  } from "@budibase/bbui"
  import { onMount } from "svelte"
  import { API } from "@/api"
  import { organisation } from "@/stores/portal/organisation"
  import { auth } from "@/stores/portal/auth"

  const configType = "scim"

  let scimEnabled = false
  let savedScimEnabled = false
  let apiKey = null
  let disableScimModal
  let selectedAction = "remove"

  const disableActions = [
    {
      label: "Remove SCIM users",
      value: "remove",
      subtitle: "All SCIM-provisioned users will be permanently deleted.",
    },
    {
      label: "Convert to regular users",
      value: "convert",
      subtitle:
        "SCIM-provisioned users will remain but will no longer be synced with your identity provider.",
    },
  ]

  async function saveSCIM() {
    if (savedScimEnabled && !scimEnabled) {
      disableScimModal.show()
      return
    }
    await persistSCIMConfig()
  }

  async function persistSCIMConfig(disableAction) {
    try {
      const config = { enabled: scimEnabled }
      if (disableAction) {
        config.disableAction = disableAction
      }
      await API.saveConfig({ type: configType, config })
      savedScimEnabled = scimEnabled
      notifications.success(`Settings saved`)
    } catch (e) {
      notifications.error(e.message)
    }
  }

  async function handleDisableSCIM() {
    await persistSCIMConfig(selectedAction)
  }

  function handleModalCancel() {
    scimEnabled = savedScimEnabled
  }

  async function fetchConfig() {
    try {
      const scimConfig = await API.getConfig(configType)
      scimEnabled = scimConfig?.config?.enabled
      savedScimEnabled = scimEnabled
    } catch (error) {
      console.error(error)
      notifications.error(
        `Error fetching SCIM config - ${error?.message || "unknown error"}`
      )
    }
  }

  async function fetchAPIKey() {
    try {
      apiKey = await auth.fetchAPIKey()
    } catch (err) {
      notifications.error(
        `Unable to fetch API key - ${err?.message || "unknown error"}`
      )
    }
  }

  onMount(async () => {
    await Promise.all([fetchConfig(), fetchAPIKey()])
  })

  const copyToClipboard = async value => {
    await Helpers.copyToClipboard(value)
    notifications.success("Copied")
  }
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<Layout gap="XS" noPadding>
  <div class="provider-title">
    <Heading size="S">SCIM</Heading>
  </div>
  <Body size="S">Sync users with your identity provider.</Body>
  <div class="form-row">
    <Label size="L">Activated</Label>
    <Toggle text="" bind:value={scimEnabled} />
  </div>
  {#if scimEnabled}
    {#each [{ title: "Provisioning URL", value: `${$organisation.platformUrl}/api/global/scim/v2` }, { title: "Provisioning Token", value: apiKey }] as setting}
      <div class="form-row">
        <Label size="L" tooltip={""}>{setting.title}</Label>
        <div class="inputContainer">
          <div class="input">
            <Input value={setting.value} readonly={true} />
          </div>
          <div class="copy" on:click={() => copyToClipboard(setting.value)}>
            <Icon size="S" name="copy" />
          </div>
        </div>
      </div>
    {/each}
  {/if}
</Layout>

<div>
  <Button cta on:click={saveSCIM}>Save</Button>
</div>

<Modal bind:this={disableScimModal} on:cancel={handleModalCancel}>
  <ModalContent
    title="Disable SCIM"
    confirmText="Confirm"
    cancelText="Cancel"
    onConfirm={handleDisableSCIM}
  >
    <Body size="S">
      There are users provisioned via SCIM. Choose what to do with them before
      disabling SCIM:
    </Body>
    <RadioGroup
      options={disableActions}
      bind:value={selectedAction}
      getOptionLabel={o => o.label}
      getOptionValue={o => o.value}
      getOptionSubtitle={o => o.subtitle}
    />
  </ModalContent>
</Modal>

<!-- TODO: DRY -->
<style>
  .form-row {
    display: grid;
    grid-template-columns: 120px 1fr;
    grid-gap: var(--spacing-l);
    align-items: center;
  }

  .provider-title {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    gap: var(--spacing-m);
  }
  .inputContainer {
    display: flex;
    flex-direction: row;
  }
  .input {
    flex: 1;
  }
  .copy {
    display: flex;
    align-items: center;
    margin-left: 10px;
  }
</style>
