<script>
  // Most of this component has been copy-pasted here from branding.svelte or organisation.svelte
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
    Tags,
    Tag,
  } from "@budibase/bbui"
  import { auth, organisation, licensing, admin } from "@/stores/portal"
  import { writable } from "svelte/store"
  import { API } from "@/api"
  import { onMount } from "svelte"
  import { sdk } from "@budibase/shared-core"
  import { redirect } from "@roxi/routify"

  // Only admins allowed here
  $: {
    if (!sdk.users.isAdmin($auth.user)) {
      $redirect("../../portal")
    }
  }
  // Not sure if there needs to changes in $organisation
  const values = writable({
    isSSOEnforced: $organisation.isSSOEnforced,
    company: $organisation.company,
    platformUrl: $organisation.platformUrl,
    analyticsEnabled: $organisation.analyticsEnabled,
  })

  let loading = false

  const saveConfig = async () => {
    loading = true
    try {
      await API.globalConfig.set("captcha", config)
      notifications.success("CAPTCHA config saved")
      updated = false
    } catch (err) {
      notifications.error("Failed to save CAPTCHA config")
    } finally {
      saving = false
    }
  }
  let mounted = false
  let saving = false

  let config = {}
  let updated = false

  $: onConfigUpdate(config)
  $: initialised = Object.keys(config).length > 0

  $: isCloud = $admin.cloud
  $: captchaEnabled = $licensing.captchaEnabled

  const onConfigUpdate = () => {
    if (!mounted || updated || !initialised) {
      return
    }
    updated = true
  }

  //   async function saveConfig() {
  //     saving = true

  //     await saveFiles()
  //     trimFields()

  //     try {
  //       // Update settings
  //       await organisation.save(config)
  //       await init()
  //       notifications.success("Branding settings updated")
  //     } catch (e) {
  //       console.error("Branding updated failed", e)
  //       notifications.error("Branding updated failed")
  //     }
  //     updated = false
  //     saving = false
  //   }

  onMount(async () => {
    // await init()
    mounted = true
  })
</script>

{#if sdk.users.isAdmin($auth.user) && mounted}
  <Layout noPadding>
    <Layout gap="XS" noPadding>
      <div class="title">
        <Heading size="M">CAPTCHA</Heading>
        {#if !isCloud && !captchaEnabled}
          <Tags>
            <Tag icon="LockClosed">Premium</Tag>
          </Tags>
        {/if}
        {#if isCloud && !captchaEnabled}
          <Tags>
            <Tag icon="LockClosed">Premium</Tag>
          </Tags>
        {/if}
      </div>
      <Body>Add enhanced security to your forms.</Body>
    </Layout>
    <Divider />
    <div class="fields">
      <div class="field">
        <Label>Site Key</Label>
        <Input bind:value={config.siteKey} />
      </div>
      <div class="field">
        <Label>Secret Key</Label>
        <Input bind:value={config.secretKey} />
      </div>
      <div class="field">
        <Label size="L">Enabled</Label>
        <Toggle text="" bind:value={$values.analyticsEnabled} />
      </div>
    </div>
    <div>
      <Button disabled={loading} on:click={saveConfig} cta>Save</Button>
    </div>
  </Layout>
{/if}

<style>
  .buttons {
    display: flex;
    gap: var(--spacing-m);
  }
  .title {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    gap: var(--spacing-m);
  }

  .branding,
  .login {
    width: 70%;
    max-width: 70%;
  }
  .fields {
    display: grid;
    grid-gap: var(--spacing-m);
  }
  .field {
    display: grid;
    grid-template-columns: 80px auto;
    grid-gap: var(--spacing-l);
    align-items: center;
  }
</style>
