<script>
  import {
    Layout,
    Heading,
    Body,
    Button,
    Divider,
    Label,
    Input,
    Toggle,
    Dropzone,
    notifications,
  } from "@budibase/bbui"
  import { auth, organisation } from "stores/portal"
  import { post } from "builderStore/api"
  import analytics from "analytics"
  import { writable } from "svelte/store"
  import { redirect } from "@roxi/routify"
  import { _ as t } from "svelte-i18n"

  // Only admins allowed here
  $: {
    if (!$auth.isAdmin) {
      $redirect("../../portal")
    }
  }

  const values = writable({
    analytics: !analytics.disabled(),
    company: $organisation.company,
    platformUrl: $organisation.platformUrl,
    logo: $organisation.logoUrl
      ? { url: $organisation.logoUrl, type: "image", name: "Logo" }
      : null,
  })
  let loading = false

  async function uploadLogo(file) {
    let data = new FormData()
    data.append("file", file)
    const res = await post(
      "/api/admin/configs/upload/settings/logoUrl",
      data,
      {}
    )
    return await res.json()
  }

  async function saveConfig() {
    loading = true

    // Set analytics preference
    if ($values.analytics) {
      analytics.optIn()
    } else {
      analytics.optOut()
    }

    // Upload logo if required
    if ($values.logo && !$values.logo.url) {
      await uploadLogo($values.logo)
      await organisation.init()
    }

    const config = {
      company: $values.company ?? "",
      platformUrl: $values.platformUrl ?? "",
    }
    // remove logo if required
    if (!$values.logo) {
      config.logoUrl = ""
    }

    // Update settings
    const res = await organisation.save(config)
    if (res.status === 200) {
      notifications.success($t("settings-saved-successfully"))
    } else {
      notifications.error(res.message)
    }

    loading = false
  }
</script>

{#if $auth.isAdmin}
  <Layout>
    <Layout gap="XS" noPadding>
      <Heading size="M">{$t("organisation")}</Heading>
      <Body>
        {$t(
          "organisation-settings-is-where-you-can-edit-your-organisation-name-and-logo-you-can-also-configure-your-platform-url-and-enable-or-disable-analytics"
        )}
      </Body>
    </Layout>
    <Divider size="S" />
    <Layout gap="XS" noPadding>
      <Heading size="S">{$t("information")}</Heading>
      <Body size="S"
        >{$t("here-you-can-update-your-logo-and-organization-name")}</Body
      >
    </Layout>
    <div class="fields">
      <div class="field">
        <Label size="L">{$t("organization-name")}</Label>
        <Input thin bind:value={$values.company} />
      </div>
      <div class="field logo">
        <Label size="L">Logo</Label>
        <div class="file">
          <Dropzone
            value={[$values.logo]}
            on:change={e => {
              if (!e.detail || e.detail.length === 0) {
                $values.logo = null
              } else {
                $values.logo = e.detail[0]
              }
            }}
          />
        </div>
      </div>
    </div>
    <Divider size="S" />
    <Layout gap="XS" noPadding>
      <Heading size="S">{$t("platform")}</Heading>
      <Body size="S">{$t("here-you-can-set-up-general-platform-settings")}</Body
      >
    </Layout>
    <div class="fields">
      <div class="field">
        <Label size="L">{$t("platform-url")}</Label>
        <Input thin bind:value={$values.platformUrl} />
      </div>
    </div>
    <Divider size="S" />
    <Layout gap="S" noPadding>
      <Layout gap="XS" noPadding>
        <Heading size="S">{$t("analytics")}</Heading>
        <Body size="S">
          {$t(
            "if-you-would-like-to-send-analytics-that-help-us-make-budibase-better-please-let-us-know-below"
          )}
        </Body>
      </Layout>
      <div class="fields">
        <div class="field">
          <Label size="L">{$t("send-analytics-to-budibase")}</Label>
          <Toggle text="" bind:value={$values.analytics} />
        </div>
      </div>
      <div>
        <Button disabled={loading} on:click={saveConfig} cta
          >{$t("save")}</Button
        >
      </div>
    </Layout>
  </Layout>
{/if}

<style>
  .fields {
    display: grid;
    grid-gap: var(--spacing-m);
  }
  .field {
    display: grid;
    grid-template-columns: 33% 1fr;
    align-items: center;
  }
  .file {
    max-width: 30ch;
  }
  .logo {
    align-items: start;
  }
</style>
