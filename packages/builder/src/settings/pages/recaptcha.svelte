<script lang="ts">
  import {
    Body,
    Button,
    Divider,
    Input,
    Label,
    Layout,
    notifications,
  } from "@budibase/bbui"
  import { auth, licensing } from "@/stores/portal"
  import { redirect } from "@roxi/routify"
  import { sdk, BUILDER_URLS } from "@budibase/shared-core"
  import { ConfigType, type RecaptchaConfig } from "@budibase/types"
  import { API } from "@/api"
  import { writable, get } from "svelte/store"
  import { onMount } from "svelte"
  import LockedFeature from "@/pages/builder/_components/LockedFeature.svelte"
  import { routeActions } from "."

  let loading = false

  // Only admins allowed here
  $: {
    if (!sdk.users.isAdmin($auth.user)) {
      $redirect(BUILDER_URLS.WORKSPACES)
    }
  }

  const values = writable<{ siteKey?: string; secretKey?: string }>({
    siteKey: "",
    secretKey: "",
  })

  $: configComplete = $values.siteKey && $values.secretKey
  $: recaptchaEnabled = $licensing.recaptchaEnabled

  async function saveConfig() {
    const config = get(values)
    // shouldn't error under normal conditions
    if (!config.siteKey || !config.secretKey) {
      throw new Error("Recaptcha config not completed")
    }
    try {
      loading = true
      let recaptchaConfig: RecaptchaConfig = {
        type: ConfigType.RECAPTCHA,
        config: {
          siteKey: config.siteKey,
          secretKey: config.secretKey,
        },
      }
      await API.saveConfig(recaptchaConfig)
      notifications.success(`Recaptcha configuration updated`)
    } catch (err: any) {
      notifications.error(
        err.message || "Failed to updated recaptcha configuration"
      )
    } finally {
      loading = false
    }
  }

  onMount(async () => {
    try {
      const recaptchaConfig = (await API.getConfig(
        ConfigType.RECAPTCHA
      )) as RecaptchaConfig
      values.set({
        siteKey: recaptchaConfig.config.siteKey,
        secretKey: recaptchaConfig.config.secretKey,
      })
    } catch (err) {
      // ignore - doesn't exist yet
    }
  })
</script>

<LockedFeature
  planType={"Enterprise"}
  enabled={recaptchaEnabled}
  title={"Recaptcha"}
  description={"Configuration for app level Recaptcha protection"}
  upgradeButtonClick={async () => {
    licensing.goToUpgradePage()
  }}
  showContentWhenDisabled
>
  <Layout noPadding>
    {#if recaptchaEnabled}
      <Layout gap="XS" noPadding>
        <Body size="S">Configuration for app level Recaptcha protection</Body>
      </Layout>
      <Divider noMargin />
    {/if}
    <div class="fields">
      <div class="field">
        <Label size="L">Site key</Label>
        <Input bind:value={$values.siteKey} disabled={!recaptchaEnabled} />
      </div>
      <div class="field">
        <Label size="L">Secret key</Label>
        <Input
          type="password"
          bind:value={$values.secretKey}
          disabled={!recaptchaEnabled}
        />
      </div>
    </div>
    {#if recaptchaEnabled}
      <div use:routeActions>
        <Button
          disabled={loading || !configComplete}
          on:click={() => saveConfig()}
          cta
        >
          Save
        </Button>
      </div>
    {/if}
  </Layout>
</LockedFeature>

<style>
  .fields {
    display: grid;
    grid-gap: var(--spacing-s);
  }
  .field {
    display: grid;
    grid-template-columns: 120px 1fr;
    grid-gap: var(--spacing-l);
    align-items: center;
  }
</style>
