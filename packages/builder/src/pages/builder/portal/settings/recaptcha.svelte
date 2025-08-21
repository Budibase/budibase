<script lang="ts">
  import {
    Body,
    Button,
    Divider,
    Heading,
    Input,
    Label,
    Layout,
    notifications,
  } from "@budibase/bbui"
  import { auth } from "@/stores/portal"
  import { redirect } from "@roxi/routify"
  import { sdk } from "@budibase/shared-core"
  import { ConfigType, type RecaptchaConfig } from "@budibase/types"
  import { API } from "@/api"
  import { writable, get } from "svelte/store"
  import { onMount } from "svelte"

  let loading = false

  // Only admins allowed here
  $: {
    if (!sdk.users.isAdmin($auth.user)) {
      $redirect("../../portal")
    }
  }

  const values = writable<{ siteKey?: string; secretKey?: string }>({
    siteKey: "",
    secretKey: "",
  })

  $: configComplete = $values.siteKey && $values.secretKey

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

<Layout noPadding>
  <Layout gap="XS" noPadding>
    <Heading size="M">Recaptcha</Heading>
    <Body>Configuration for app level Recaptcha protection</Body>
  </Layout>
  <Divider />
  <div class="fields">
    <div class="field">
      <Label size="L">Site key</Label>
      <Input bind:value={$values.siteKey} />
    </div>
    <div class="field">
      <Label size="L">Secret key</Label>
      <Input type="password" bind:value={$values.secretKey} />
    </div>
  </div>
  <div>
    <Button
      disabled={loading || !configComplete}
      on:click={() => saveConfig()}
      cta>Save</Button
    >
  </div>
</Layout>

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
