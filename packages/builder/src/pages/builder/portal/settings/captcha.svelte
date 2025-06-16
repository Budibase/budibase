<script>
  import {
    Layout,
    Heading,
    Body,
    Divider,
    File,
    notifications,
    Tags,
    Tag,
    Button,
    Toggle,
    Input,
    Label,
    TextArea,
  } from "@budibase/bbui"
  import { auth, organisation, licensing, admin } from "@/stores/portal"
  import { API } from "@/api"
  import { onMount } from "svelte"
  import { goto } from "@roxi/routify"
  import { sdk } from "@budibase/shared-core"

  let config = {}
  let updated = false

  let mounted = false
  let saving = false

  $: onConfigUpdate(config)
  $: initialised = Object.keys(config).length > 0

  $: isCloud = $admin.cloud
  $: brandingEnabled = $licensing.brandingEnabled

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
        {#if !isCloud && !brandingEnabled}
          <Tags>
            <Tag icon="LockClosed">Premium</Tag>
          </Tags>
        {/if}
        {#if isCloud && !brandingEnabled}
          <Tags>
            <Tag icon="LockClosed">Premium</Tag>
          </Tags>
        {/if}
      </div>
      <Body>Add enhanced security to your forms.</Body>
    </Layout>
    <Divider />
    <div class="field">
      <Label>Site Key</Label>
      <Input></Input>
    </div>
    <div class="field">
      <Label>Secret Key</Label>
      <Input></Input>
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
