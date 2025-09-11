<script>
  import {
    Button,
    Label,
    notifications,
    Layout,
    Input,
    Select,
    Checkbox,
  } from "@budibase/bbui"
  import { admin } from "@/stores/portal/admin"
  import { API } from "@/api"
  import { cloneDeep } from "lodash/fp"
  import { onMount } from "svelte"
  import { fetchSmtp } from "@/settings/pages/email/utils"

  const ConfigTypes = {
    SMTP: "smtp",
  }

  let smtpConfig
  let requireAuth = false

  async function saveSmtp() {
    // clone it so we can remove stuff if required
    const smtp = cloneDeep(smtpConfig)
    if (!requireAuth) {
      delete smtp.config.auth
    }
    // Save your SMTP config
    try {
      const savedConfig = await API.saveConfig(smtp)
      smtpConfig._rev = savedConfig._rev
      smtpConfig._id = savedConfig._id
      await admin.getChecklist()
      notifications.success(`Settings saved`)
    } catch (error) {
      notifications.error(
        `Failed to save email settings, reason: ${error?.message || "Unknown"}`
      )
    }
  }

  async function deleteSmtp() {
    // Delete the SMTP config
    try {
      await API.deleteConfig(smtpConfig._id, smtpConfig._rev)
      smtpConfig = {
        type: ConfigTypes.SMTP,
        config: {
          secure: true,
        },
      }
      await admin.getChecklist()
      notifications.success(`Settings cleared`)
    } catch (error) {
      notifications.error(
        `Failed to clear email settings, reason: ${error?.message || "Unknown"}`
      )
    }
  }

  onMount(async () => {
    smtpConfig = await fetchSmtp()

    requireAuth =
      smtpConfig && "config" in smtpConfig && smtpConfig.config.auth != null
  })
</script>

<Layout noPadding gap="S">
  {#if smtpConfig}
    <Layout gap="XS" noPadding>
      <div class="form-row">
        <Label size="L">Host</Label>
        <Input bind:value={smtpConfig.config.host} />
      </div>
      <div class="form-row">
        <Label size="L">Security type</Label>
        <Select
          bind:value={smtpConfig.config.secure}
          options={[
            { label: "SSL/TLS", value: true },
            { label: "None/STARTTLS", value: false },
          ]}
        />
      </div>
      <div class="form-row">
        <Label size="L">Port</Label>
        <Input type="number" bind:value={smtpConfig.config.port} />
      </div>
      <div class="form-row">
        <Label size="L">From email address</Label>
        <Input type="email" bind:value={smtpConfig.config.from} />
      </div>
      <div class="form-row">
        <Label size="L">Require sign in</Label>
        <Checkbox bind:value={requireAuth} />
      </div>
      {#if requireAuth}
        <div class="form-row">
          <Label size="L">User</Label>
          <Input bind:value={smtpConfig.config.auth.user} />
        </div>
        <div class="form-row">
          <Label size="L">Password</Label>
          <Input type="password" bind:value={smtpConfig.config.auth.pass} />
        </div>
      {/if}
    </Layout>
    <div class="spectrum-ButtonGroup spectrum-Settings-buttonGroup">
      <Button cta on:click={saveSmtp}>Save</Button>
      <Button
        secondary
        on:click={deleteSmtp}
        disabled={!$admin.checklist?.smtp?.checked}
      >
        Reset
      </Button>
    </div>
  {/if}
</Layout>

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
