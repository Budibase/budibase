<script>
  import {
    Button,
    Checkbox,
    Input,
    Label,
    Layout,
    Select,
    notifications,
  } from "@budibase/bbui"
  import { API } from "@/api"
  import { admin } from "@/stores/portal/admin"
  import { cloneDeep } from "lodash/fp"
  import { onMount } from "svelte"
  import { fetchImap } from "@/settings/pages/email/utils"
  import { ConfigType } from "@budibase/types"

  const securityOptions = [
    { label: "SSL/TLS", value: true },
    { label: "None/STARTTLS", value: false },
  ]

  let imapConfig
  let requireAuth = false

  async function saveImap() {
    const imap = cloneDeep(imapConfig)
    if (!requireAuth) {
      delete imap.config.auth
    }
    try {
      const savedConfig = await API.saveConfig(imap)
      imapConfig._rev = savedConfig._rev
      imapConfig._id = savedConfig._id
      await admin.getChecklist()
      notifications.success(`Settings saved`)
    } catch (error) {
      notifications.error(
        `Failed to save IMAP settings, reason: ${error?.message || "Unknown"}`
      )
    }
  }

  async function deleteImap() {
    if (!imapConfig?._id || !imapConfig?._rev) {
      return
    }
    try {
      await API.deleteConfig(imapConfig._id, imapConfig._rev)
      const config = await fetchImap()
      if (config) {
        imapConfig = config
      } else {
        imapConfig = {
          type: ConfigType.IMAP,
          config: {
            secure: true,
            port: 993,
          },
        }
      }
      requireAuth = !!(
        imapConfig &&
        "config" in imapConfig &&
        imapConfig.config.auth
      )
      await admin.getChecklist()
      notifications.success(`Settings cleared`)
    } catch (error) {
      notifications.error(
        `Failed to clear IMAP settings, reason: ${error?.message || "Unknown"}`
      )
    }
  }

  onMount(async () => {
    const config = await fetchImap()
    if (!config) {
      return
    }
    imapConfig = config
    requireAuth = !!(
      imapConfig &&
      "config" in imapConfig &&
      imapConfig.config.auth
    )
  })

  $: if (imapConfig && requireAuth && !imapConfig.config.auth) {
    imapConfig.config.auth = {
      type: "login",
      user: "",
      pass: "",
    }
  }
</script>

{#if imapConfig}
  <Layout noPadding gap="S">
    <Layout gap="XS" noPadding>
      <div class="form-row">
        <Label size="L">Host</Label>
        <Input bind:value={imapConfig.config.host} />
      </div>
      <div class="form-row">
        <Label size="L">Security type</Label>
        <Select
          bind:value={imapConfig.config.secure}
          options={securityOptions}
        />
      </div>
      <div class="form-row">
        <Label size="L">Port</Label>
        <Input type="number" bind:value={imapConfig.config.port} />
      </div>
      <div class="form-row">
        <Label size="L">Require sign in</Label>
        <Checkbox bind:value={requireAuth} />
      </div>
      {#if requireAuth}
        <div class="form-row">
          <Label size="L">User</Label>
          <Input bind:value={imapConfig.config.auth.user} />
        </div>
        <div class="form-row">
          <Label size="L">Password</Label>
          <Input type="password" bind:value={imapConfig.config.auth.pass} />
        </div>
      {/if}
    </Layout>

    <div class="spectrum-ButtonGroup spectrum-Settings-buttonGroup">
      <Button cta on:click={saveImap}>Save</Button>
      <Button secondary on:click={deleteImap} disabled={!imapConfig?._id}>
        Reset
      </Button>
    </div>
  </Layout>
{/if}

<style>
  .form-row {
    display: grid;
    grid-template-columns: 120px 1fr;
    grid-gap: var(--spacing-l);
    align-items: center;
  }
  .spectrum-Settings-buttonGroup {
    gap: var(--spectrum-global-dimension-static-size-200);
    align-items: flex-end;
  }
</style>
