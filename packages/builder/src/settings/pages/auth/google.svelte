<script lang="ts">
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
  import { organisation } from "@/stores/portal/organisation"
  import { admin } from "@/stores/portal/admin"
  import {
    ConfigType,
    isConfig,
    isGoogleConfig,
    type GoogleConfig,
    type GoogleInnerConfig,
  } from "@budibase/types"

  interface EditableGoogleConfig extends GoogleInnerConfig {
    sheetsURL?: string
  }

  interface EditableGoogleProvider extends Omit<GoogleConfig, "config"> {
    config: EditableGoogleConfig
  }

  interface GoogleConfigField {
    name: "clientID" | "clientSecret" | "callbackURL" | "sheetsURL"
    label: string
    readonly?: boolean
    tooltip?: string
    placeholder?: string
    copyButton?: boolean
  }

  // Some older google configs contain a manually specified value - retain the functionality to edit the field
  // When there is no value or we are in the cloud - prohibit editing the field, must use platform url to change
  let googleCallbackUrl = $state<string | undefined>()
  const googleCallbackReadonly = $derived($admin.cloud || !googleCallbackUrl)

  // Indicate to user that callback is based on platform url
  // If there is an existing value, indicate that it may be removed to return to default behaviour
  const googleCallbackTooltip = $derived(
    $admin.cloud
      ? undefined
      : googleCallbackReadonly
        ? "Visit the organisation page to update the platform URL"
        : "Leave blank to use the default callback URL"
  )
  const googleSheetsCallbackUrl = $derived(
    `${$organisation.platformUrl}/api/global/auth/datasource/google/callback`
  )

  const googleConfigFields = $derived<GoogleConfigField[]>([
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
  ])

  let googleProvider = $state<EditableGoogleProvider>()

  // control the state of the save button depending on whether form has changed
  let originalGoogleDoc = $state<EditableGoogleProvider>()
  const googleSaveButtonDisabled = $derived(
    isEqual(googleProvider?.config, originalGoogleDoc?.config)
  )

  const googleComplete = $derived(
    !!(googleProvider?.config.clientID && googleProvider.config.clientSecret)
  )

  async function saveConfig(config: GoogleConfig) {
    // Delete unsupported fields
    delete config.createdAt
    delete config.updatedAt
    return API.saveConfig(config)
  }

  async function saveGoogle() {
    if (!googleComplete) {
      notifications.error(
        `Please fill in all required ${ConfigType.GOOGLE} fields`
      )
      return
    }

    const google = googleProvider
    if (!google) return

    try {
      const res = await saveConfig(google)
      google._rev = res._rev
      google._id = res._id
      notifications.success(`Settings saved`)
    } catch (error) {
      notifications.error(
        error instanceof Error
          ? error.message
          : "Unable to save Google OAuth config"
      )
      return
    }

    originalGoogleDoc = cloneDeep(googleProvider)
  }

  const copyToClipboard = async (value?: string) => {
    if (!value) return
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
      googleDoc = await API.getConfig(ConfigType.GOOGLE)
    } catch (error) {
      notifications.error("Error fetching Google OAuth config")
    }
    if (!googleDoc || !isConfig(googleDoc) || !isGoogleConfig(googleDoc)) {
      googleProvider = {
        type: ConfigType.GOOGLE,
        config: {
          activated: false,
          clientID: "",
          clientSecret: "",
        },
      }
    } else {
      // Default activated to true for older configs
      if (googleDoc.config.activated === undefined) {
        googleDoc.config.activated = true
      }
      originalGoogleDoc = cloneDeep(googleDoc)
      googleProvider = googleDoc
    }
    googleCallbackUrl = googleProvider.config.callbackURL
  })
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<!-- svelte-ignore a11y_click_events_have_key_events -->
{#if googleProvider}
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
    {#each googleConfigFields as field}
      <div class="form-row">
        <Label size="L" tooltip={field.tooltip}>{field.label}</Label>
        <div class="inputContainer">
          <div class="input">
            <Input
              bind:value={googleProvider.config[field.name]}
              readonly={field.readonly}
              placeholder={field.placeholder}
            />
          </div>
          {#if field.copyButton}
            <div
              class="copy"
              onclick={() => copyToClipboard(field.placeholder)}
            >
              <Icon size="S" name="copy" />
            </div>
          {/if}
        </div>
      </div>
    {/each}
    <div class="form-row">
      <Label size="L">Activated</Label>
      <Toggle text="" bind:value={googleProvider.config.activated} />
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
