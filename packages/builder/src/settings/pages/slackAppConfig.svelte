<script lang="ts">
  import {
    Body,
    Button,
    Input,
    Label,
    Layout,
    notifications,
  } from "@budibase/bbui"
  import { agentsStore } from "@/stores/portal"

  let configToken = $state("")
  let refreshToken = $state("")
  let configured = $state(false)
  let needsReconfiguration = $state(false)
  let updatedAt = $state<string | undefined>()
  let expiresAt = $state<string | undefined>()
  let loading = $state(false)
  let saving = $state(false)
  let removing = $state(false)

  const load = async () => {
    loading = true
    try {
      const config = await agentsStore.fetchSlackAppConfig()
      configured = config.configured
      needsReconfiguration = !!config.needsReconfiguration
      updatedAt = config.updatedAt
      expiresAt = config.expiresAt
    } catch (error) {
      console.error(error)
      notifications.error("Failed to load Slack app configuration")
    } finally {
      loading = false
    }
  }

  const save = async () => {
    if (!configToken.trim() || !refreshToken.trim()) {
      return
    }
    saving = true
    try {
      const config = await agentsStore.saveSlackAppConfig({
        configToken: configToken.trim(),
        refreshToken: refreshToken.trim(),
      })
      configured = config.configured
      needsReconfiguration = !!config.needsReconfiguration
      updatedAt = config.updatedAt
      expiresAt = config.expiresAt
      configToken = ""
      refreshToken = ""
      notifications.success("Slack app configuration saved")
    } catch (error) {
      console.error(error)
      notifications.error("Failed to save Slack app configuration")
    } finally {
      saving = false
    }
  }

  const remove = async () => {
    removing = true
    try {
      const config = await agentsStore.deleteSlackAppConfig()
      configured = config.configured
      needsReconfiguration = !!config.needsReconfiguration
      updatedAt = config.updatedAt
      expiresAt = config.expiresAt
      configToken = ""
      refreshToken = ""
      notifications.success("Slack app configuration removed")
    } catch (error) {
      console.error(error)
      notifications.error("Failed to remove Slack app configuration")
    } finally {
      removing = false
    }
  }

  $effect(() => {
    load()
  })
</script>

<Layout noPadding gap="M">
  <Body size="S">
    Store the tenant-wide Slack app configuration token used to create Slack
    apps automatically for agent deployments. Budibase rotates the token using
    the matching Slack refresh token before it expires.
  </Body>

  <div class="status">
    <Label size="L">Status</Label>
    <Body size="S">
      {#if loading}
        Loading...
      {:else if needsReconfiguration}
        Needs reconfiguration
      {:else if configured}
        Configured{updatedAt
          ? `, updated ${new Date(updatedAt).toLocaleString()}`
          : ""}{expiresAt
          ? `, expires ${new Date(expiresAt).toLocaleString()}`
          : ""}
      {:else}
        Not configured
      {/if}
    </Body>
  </div>

  <div class="field">
    <Label size="L">Configuration token</Label>
    <Input
      type="password"
      placeholder={configured
        ? "Enter a new token to replace the saved token"
        : "Slack app configuration token"}
      bind:value={configToken}
    />
  </div>

  <div class="field">
    <Label size="L">Refresh token</Label>
    <Input
      type="password"
      placeholder={configured
        ? "Enter a new refresh token to replace the saved token"
        : "Slack app configuration refresh token"}
      bind:value={refreshToken}
    />
  </div>

  <div class="actions">
    <Button
      cta
      disabled={saving || !configToken.trim() || !refreshToken.trim()}
      on:click={save}
    >
      {saving ? "Saving..." : "Save"}
    </Button>
    <Button secondary disabled={removing || !configured} on:click={remove}>
      {removing ? "Removing..." : "Remove"}
    </Button>
  </div>
</Layout>

<style>
  .field,
  .status {
    display: grid;
    grid-template-columns: 160px minmax(0, 1fr);
    gap: var(--spacing-l);
    align-items: center;
    max-width: 720px;
  }

  .actions {
    display: flex;
    gap: var(--spacing-s);
  }
</style>
