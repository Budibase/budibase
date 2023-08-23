<script>
  import {
    Layout,
    Heading,
    Body,
    Button,
    Divider,
    Label,
    Input,
    notifications,
    Toggle,
  } from "@budibase/bbui"
  import { auth, organisation, admin } from "stores/portal"
  import { writable } from "svelte/store"
  import { redirect } from "@roxi/routify"
  import { sdk } from "@budibase/shared-core"

  // Only admins allowed here
  $: {
    if (!sdk.users.isAdmin($auth.user)) {
      $redirect("../../portal")
    }
  }

  const values = writable({
    isSSOEnforced: $organisation.isSSOEnforced,
    company: $organisation.company,
    platformUrl: $organisation.platformUrl,
    analyticsEnabled: $organisation.analyticsEnabled,
  })

  let loading = false

  async function saveConfig() {
    loading = true

    try {
      const config = {
        isSSOEnforced: $values.isSSOEnforced,
        company: $values.company ?? "",
        platformUrl: $values.platformUrl ?? "",
        analyticsEnabled: $values.analyticsEnabled,
      }

      // Update settings
      await organisation.save(config)
    } catch (error) {
      notifications.error("Error saving org config")
    }
    loading = false
  }
</script>

{#if sdk.users.isAdmin($auth.user)}
  <Layout noPadding>
    <Layout gap="XS" noPadding>
      <Heading size="M">Organisation</Heading>
      <Body>Edit and manage all of your organisation settings</Body>
    </Layout>
    <Divider />
    <div class="fields">
      <div class="field">
        <Label size="L">Org. name</Label>
        <Input thin bind:value={$values.company} />
      </div>

      {#if !$admin.cloud}
        <div class="field">
          <Label
            size="L"
            tooltip={"Update the Platform URL to match your Budibase web URL. This keeps email templates and authentication configs up to date."}
          >
            Platform URL
          </Label>
          <Input thin bind:value={$values.platformUrl} />
        </div>
      {/if}
      {#if !$admin.cloud}
        <div class="field">
          <Label size="L">Analytics</Label>
          <Toggle text="" bind:value={$values.analyticsEnabled} />
        </div>
      {/if}
    </div>
    <div>
      <Button disabled={loading} on:click={saveConfig} cta>Save</Button>
    </div>
  </Layout>
{/if}

<style>
  .fields {
    display: grid;
    grid-gap: var(--spacing-m);
  }
  .field {
    display: grid;
    grid-template-columns: 120px 1fr;
    grid-gap: var(--spacing-l);
    align-items: center;
  }
</style>
