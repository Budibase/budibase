<script>
  import MicrosoftLogo from "assets/microsoft-logo.png"
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
  } from "@budibase/bbui"
  import { onMount } from "svelte"
  import { API } from "@/api"
  import { organisation } from "@/stores/portal/organisation"
  import { admin } from "@/stores/portal/admin"

  const ConfigTypes = {
    Microsoft: "microsoft",
  }

  $: microsoftCallbackReadonly = true
  $: microsoftCallbackTooltip = $admin.cloud
    ? null
    : "Visit the organisation page to update the platform URL"
  $: microsoftCallbackUrl = `${$organisation.platformUrl}/api/global/auth/datasource/microsoft/callback`

  $: MicrosoftConfigFields = {
    Microsoft: [
      { name: "clientID", label: "Client ID" },
      { name: "clientSecret", label: "Client Secret" },
      {
        name: "tenantId",
        label: "Tenant ID (optional)",
        placeholder: "common",
      },
      {
        name: "callbackURL",
        label: "Callback URL",
        readonly: microsoftCallbackReadonly,
        tooltip: microsoftCallbackTooltip,
        placeholder: microsoftCallbackUrl,
        copyButton: true,
      },
    ],
  }

  let microsoft
  const providers = { microsoft }

  let originalMicrosoftDoc
  let microsoftSaveButtonDisabled
  $: {
    isEqual(providers.microsoft?.config, originalMicrosoftDoc?.config)
      ? (microsoftSaveButtonDisabled = true)
      : (microsoftSaveButtonDisabled = false)
  }

  $: microsoftComplete = !!(
    providers.microsoft?.config?.clientID &&
    providers.microsoft?.config?.clientSecret
  )

  async function saveConfig(config) {
    delete config.createdAt
    delete config.updatedAt
    return API.saveConfig(config)
  }

  async function saveMicrosoft() {
    if (!microsoftComplete) {
      notifications.error(
        `Please fill in all required ${ConfigTypes.Microsoft} fields`
      )
      return
    }

    const microsoft = providers.microsoft

    try {
      const res = await saveConfig(microsoft)
      providers[res.type]._rev = res._rev
      providers[res.type]._id = res._id
      notifications.success(`Settings saved`)
    } catch (e) {
      notifications.error(e.message)
      return
    }

    microsoftSaveButtonDisabled = true
    originalMicrosoftDoc = cloneDeep(providers.microsoft)
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

    let microsoftDoc
    try {
      microsoftDoc = await API.getConfig(ConfigTypes.Microsoft)
    } catch (error) {
      notifications.error("Error fetching Microsoft OAuth config")
    }

    if (!microsoftDoc?._id) {
      providers.microsoft = {
        type: ConfigTypes.Microsoft,
        config: { activated: false, tenantId: "common" },
      }
      originalMicrosoftDoc = cloneDeep(microsoftDoc)
    } else {
      if (microsoftDoc.config.activated === undefined) {
        microsoftDoc.config.activated = true
      }
      if (!microsoftDoc.config.tenantId) {
        microsoftDoc.config.tenantId = "common"
      }
      originalMicrosoftDoc = cloneDeep(microsoftDoc)
      providers.microsoft = microsoftDoc
    }
  })
</script>

{#if providers.microsoft}
  <Divider />
  <Layout gap="XS" noPadding>
    <Heading size="S">
      <div class="provider-title">
        <img src={MicrosoftLogo} alt="Microsoft" />
        <span>Microsoft</span>
      </div>
    </Heading>
    <Body size="S">
      Configure Microsoft OAuth credentials used for datasource and SharePoint
      knowledge-base connection flows.
    </Body>
  </Layout>
  <Layout gap="XS" noPadding>
    {#each MicrosoftConfigFields.Microsoft as field}
      <div class="form-row">
        <Label size="L" tooltip={field.tooltip}>{field.label}</Label>
        <div class="inputContainer">
          <div class="input">
            <Input
              bind:value={providers.microsoft.config[field.name]}
              readonly={field.readonly}
              placeholder={field.placeholder}
            />
          </div>
          {#if field.copyButton}
            <div
              class="copy"
              on:click={() => copyToClipboard(field.placeholder)}
            >
              <Icon size="S" name="copy" />
            </div>
          {/if}
        </div>
      </div>
    {/each}
    <div class="form-row">
      <Label size="L">Activated</Label>
      <Toggle text="" bind:value={providers.microsoft.config.activated} />
    </div>
  </Layout>
  <div>
    <Button
      disabled={microsoftSaveButtonDisabled}
      cta
      on:click={() => saveMicrosoft()}
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
  .provider-title img {
    width: 20px;
    height: 20px;
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
