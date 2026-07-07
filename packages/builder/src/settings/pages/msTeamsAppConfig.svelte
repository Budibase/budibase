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

  let azureTenantId = $state("")
  let clientId = $state("")
  let clientSecret = $state("")
  let subscriptionId = $state("")
  let resourceGroupName = $state("")
  let location = $state("")
  let configured = $state(false)
  let updatedAt = $state<string | undefined>()
  let loading = $state(false)
  let saving = $state(false)
  let removing = $state(false)

  const hasRequiredFields = $derived.by(
    () =>
      !!(
        azureTenantId.trim() &&
        clientId.trim() &&
        clientSecret.trim() &&
        subscriptionId.trim() &&
        resourceGroupName.trim() &&
        location.trim()
      )
  )

  const load = async () => {
    loading = true
    try {
      const config = await agentsStore.fetchMSTeamsAppConfig()
      configured = config.configured
      updatedAt = config.updatedAt
    } catch (error) {
      console.error(error)
      notifications.error(
        "Failed to load Microsoft Teams provisioning settings"
      )
    } finally {
      loading = false
    }
  }

  const save = async () => {
    if (!hasRequiredFields) {
      return
    }
    saving = true
    try {
      const config = await agentsStore.saveMSTeamsAppConfig({
        azureTenantId: azureTenantId.trim(),
        clientId: clientId.trim(),
        clientSecret: clientSecret.trim(),
        subscriptionId: subscriptionId.trim(),
        resourceGroupName: resourceGroupName.trim(),
        location: location.trim(),
      })
      configured = config.configured
      updatedAt = config.updatedAt
      clientSecret = ""
      notifications.success("Microsoft Teams provisioning settings saved")
    } catch (error) {
      console.error(error)
      notifications.error(
        "Failed to save Microsoft Teams provisioning settings"
      )
    } finally {
      saving = false
    }
  }

  const remove = async () => {
    removing = true
    try {
      const config = await agentsStore.deleteMSTeamsAppConfig()
      configured = config.configured
      updatedAt = config.updatedAt
      azureTenantId = ""
      clientId = ""
      clientSecret = ""
      subscriptionId = ""
      resourceGroupName = ""
      location = ""
      notifications.success("Microsoft Teams provisioning settings removed")
    } catch (error) {
      console.error(error)
      notifications.error(
        "Failed to remove Microsoft Teams provisioning settings"
      )
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
    Store tenant-wide Azure credentials used to create Microsoft Teams agent
    apps automatically. The identity needs permission to create Entra
    applications and Azure Bot Service resources in the configured resource
    group.
  </Body>

  <div class="status">
    <Label size="L">Status</Label>
    <Body size="S">
      {#if loading}
        Loading...
      {:else if configured}
        Configured{updatedAt
          ? `, updated ${new Date(updatedAt).toLocaleString()}`
          : ""}
      {:else}
        Not configured
      {/if}
    </Body>
  </div>

  <div class="field">
    <Label size="L">Directory tenant ID</Label>
    <Input bind:value={azureTenantId} />
  </div>
  <div class="field">
    <Label size="L">Client ID</Label>
    <Input bind:value={clientId} />
  </div>
  <div class="field">
    <Label size="L">Client secret</Label>
    <Input
      type="password"
      placeholder={configured
        ? "Enter a new secret to replace the saved secret"
        : "Client secret"}
      bind:value={clientSecret}
    />
  </div>
  <div class="field">
    <Label size="L">Subscription ID</Label>
    <Input bind:value={subscriptionId} />
  </div>
  <div class="field">
    <Label size="L">Resource group</Label>
    <Input bind:value={resourceGroupName} />
  </div>
  <div class="field">
    <Label size="L">Location</Label>
    <Input placeholder="global" bind:value={location} />
  </div>

  <div class="actions">
    <Button cta disabled={saving || !hasRequiredFields} on:click={save}>
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
    grid-template-columns: 180px minmax(0, 1fr);
    gap: var(--spacing-l);
    align-items: center;
    max-width: 760px;
  }

  .actions {
    display: flex;
    gap: var(--spacing-s);
  }
</style>
