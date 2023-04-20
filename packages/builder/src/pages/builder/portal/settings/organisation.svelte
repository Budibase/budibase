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

  import { _ } from "../../../../../lang/i18n"

  // Only admins allowed here
  $: {
    if (!$auth.isAdmin) {
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
      notifications.error(
        $_("pages.builder.portal.settings.organisation.Error_saving")
      )
    }
    loading = false
  }
</script>

{#if $auth.isAdmin}
  <Layout noPadding>
    <Layout gap="XS" noPadding>
      <Heading size="M"
        >{$_(
          "pages.builder.portal.settings.organisation.Organisation"
        )}</Heading
      >
      <Body>{$_("pages.builder.portal.settings.organisation.Edit_manage")}</Body
      >
    </Layout>
    <Divider />
    <div class="fields">
      <div class="field">
        <Label size="L"
          >{$_("pages.builder.portal.settings.organisation.Org_name")}</Label
        >
        <Input thin bind:value={$values.company} />
      </div>

      {#if !$admin.cloud}
        <div class="field">
          <Label
            size="L"
            tooltip={$_(
              "pages.builder.portal.settings.organisation.Update_URL"
            )}
          >
            {$_("pages.builder.portal.settings.organisation.Platform_URL")}
          </Label>
          <Input thin bind:value={$values.platformUrl} />
        </div>
      {/if}
      {#if !$admin.cloud}
        <div class="field">
          <Label size="L"
            >{$_("pages.builder.portal.settings.organisation.Analytics")}</Label
          >
          <Toggle text="" bind:value={$values.analyticsEnabled} />
        </div>
      {/if}
    </div>
    <div>
      <Button disabled={loading} on:click={saveConfig} cta
        >{$_("pages.builder.portal.settings.organisation.Save")}</Button
      >
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
