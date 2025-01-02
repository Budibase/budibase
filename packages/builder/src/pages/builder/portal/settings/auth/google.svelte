<script>
  import GoogleLogo from "./_logos/Google.svelte"
  import { isEqual, cloneDeep } from "lodash/fp"
  import {
    Button,
    Heading,
    Divider,
    Label,
    notifications,
    Layout,
    Input,
    Body,
    Toggle,
    Icon,
    Helpers,
    Link,
  } from "@budibase/bbui"
  import { onMount } from "svelte"
  import { API } from "@/api"
  import { organisation, admin } from "@/stores/portal"

  const ConfigTypes = {
    Google: "google",
  }

  // Some older google configs contain a manually specified value - retain the functionality to edit the field
  // When there is no value or we are in the cloud - prohibit editing the field, must use platform url to change
  $: googleCallbackUrl = undefined
  $: googleCallbackReadonly = $admin.cloud || !googleCallbackUrl

  // Indicate to user that callback is based on platform url
  // If there is an existing value, indicate that it may be removed to return to default behaviour
  $: googleCallbackTooltip = $admin.cloud
    ? null
    : googleCallbackReadonly
    ? "Visit the organisation page to update the platform URL"
    : "Leave blank to use the default callback URL"
  $: googleSheetsCallbackUrl = `${$organisation.platformUrl}/api/global/auth/datasource/google/callback`

  $: GoogleConfigFields = {
    Google: [
      { name: "clientID", label: "Client ID" },
      { name: "clientSecret", label: "Client secret" },
      {
        name: "callbackURL",
        label: "Callback URL",
        readonly: googleCallbackReadonly,
        tooltip: googleCallbackTooltip,
        placeholder: $organisation.googleCallbackUrl,
        copyButton: true,
      },
      {
        name: "sheetsURL",
        label: "Sheets URL",
        readonly: googleCallbackReadonly,
        tooltip: googleCallbackTooltip,
        placeholder: googleSheetsCallbackUrl,
        copyButton: true,
      },
    ],
  }

  let google

  const providers = { google }

  // control the state of the save button depending on whether form has changed
  let originalGoogleDoc
  let googleSaveButtonDisabled
  $: {
    isEqual(providers.google?.config, originalGoogleDoc?.config)
      ? (googleSaveButtonDisabled = true)
      : (googleSaveButtonDisabled = false)
  }

  $: googleComplete = !!(
    providers.google?.config?.clientID && providers.google?.config?.clientSecret
  )

  async function saveConfig(config) {
    // Delete unsupported fields
    delete config.createdAt
    delete config.updatedAt
    return API.saveConfig(config)
  }

  async function saveGoogle() {
    if (!googleComplete) {
      notifications.error(
        `Please fill in all required ${ConfigTypes.Google} fields`
      )
      return
    }

    const google = providers.google

    try {
      const res = await saveConfig(google)
      providers[res.type]._rev = res._rev
      providers[res.type]._id = res._id
      notifications.success(`Settings saved`)
    } catch (e) {
      notifications.error(e.message)
      return
    }

    googleSaveButtonDisabled = true
    originalGoogleDoc = cloneDeep(providers.google)
  }

  const copyToClipboard = async value => {
    await Helpers.copyToClipboard(value)
    notifications.success("Copied")
  }

  onMount(async () => {
    try {
      await organisation.init()
    } catch (error) {
      notifications.error("Error getting org config")
    }

    // Fetch Google config
    let googleDoc
    try {
      googleDoc = await API.getConfig(ConfigTypes.Google)
    } catch (error) {
      notifications.error("Error fetching Google OAuth config")
    }
    if (!googleDoc?._id) {
      providers.google = {
        type: ConfigTypes.Google,
        config: { activated: false },
      }
      originalGoogleDoc = cloneDeep(googleDoc)
    } else {
      // Default activated to true for older configs
      if (googleDoc.config.activated === undefined) {
        googleDoc.config.activated = true
      }
      originalGoogleDoc = cloneDeep(googleDoc)
      providers.google = googleDoc
    }
    googleCallbackUrl = providers?.google?.config?.callbackURL
  })
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
{#if providers.google}
  <Divider />
  <Layout gap="XS" noPadding>
    <Heading size="S">
      <div class="provider-title">
        <GoogleLogo />
        <span>Google</span>
      </div>
    </Heading>
    <Body size="S">
      To allow users to authenticate using their Google accounts, fill out the
      fields below. Read the <Link
        size="M"
        href={"https://docs.budibase.com/docs/sso-with-google"}
        >documentation</Link
      > for more information.
    </Body>
  </Layout>
  <Layout gap="XS" noPadding>
    {#each GoogleConfigFields.Google as field}
      <div class="form-row">
        <Label size="L" tooltip={field.tooltip}>{field.label}</Label>
        <div class="inputContainer">
          <div class="input">
            <Input
              bind:value={providers.google.config[field.name]}
              readonly={field.readonly}
              placeholder={field.placeholder}
            />
          </div>
          {#if field.copyButton}
            <div
              class="copy"
              on:click={() => copyToClipboard(field.placeholder)}
            >
              <Icon size="S" name="Copy" />
            </div>
          {/if}
        </div>
      </div>
    {/each}
    <div class="form-row">
      <Label size="L">Activated</Label>
      <Toggle text="" bind:value={providers.google.config.activated} />
    </div>
  </Layout>
  <div>
    <Button
      disabled={googleSaveButtonDisabled}
      cta
      on:click={() => saveGoogle()}
    >
      Save
    </Button>
  </div>
{/if}

<style>
  .form-row {
    display: grid;
    grid-template-columns: 120px 1fr;
    grid-gap: var(--spacing-l);
    align-items: center;
  }

  .provider-title {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    gap: var(--spacing-m);
  }
  .provider-title span {
    flex: 1 1 auto;
  }
  .inputContainer {
    display: flex;
    flex-direction: row;
  }
  .input {
    flex: 1;
  }
  .copy {
    display: flex;
    align-items: center;
    margin-left: 10px;
  }
</style>
