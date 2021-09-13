<script>
  import GoogleLogo from "./_logos/Google.svelte"
  import OidcLogo from "./_logos/OIDC.svelte"
  import MicrosoftLogo from "assets/microsoft-logo.png"
  import Auth0Logo from "assets/auth0-logo.png"
  import OktaLogo from "assets/okta-logo.png"
  import OneLoginLogo from "assets/onelogin-logo.png"
  import OidcLogoPng from "assets/oidc-logo.png"
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
    Select,
    Toggle,
  } from "@budibase/bbui"
  import { onMount } from "svelte"
  import api from "builderStore/api"
  import { organisation, auth, admin } from "stores/portal"
  import { uuid } from "builderStore/uuid"

  $: tenantId = $auth.tenantId
  $: multiTenancyEnabled = $admin.multiTenancy

  const ConfigTypes = {
    Google: "google",
    OIDC: "oidc",
  }

  function callbackUrl(tenantId, end) {
    let url = `/api/global/auth`
    if (multiTenancyEnabled && tenantId) {
      url += `/${tenantId}`
    }
    url += end
    return url
  }

  $: GoogleConfigFields = {
    Google: [
      { name: "clientID", label: "Client ID" },
      { name: "clientSecret", label: "Client secret" },
      {
        name: "callbackURL",
        label: "Callback URL",
        readonly: true,
        placeholder: callbackUrl(tenantId, "/google/callback"),
      },
    ],
  }

  $: OIDCConfigFields = {
    Oidc: [
      { name: "configUrl", label: "Config URL" },
      { name: "clientID", label: "Client ID" },
      { name: "clientSecret", label: "Client Secret" },
      {
        name: "callbackURL",
        label: "Callback URL",
        readonly: true,
        placeholder: callbackUrl(tenantId, "/oidc/callback"),
      },
    ],
  }

  let iconDropdownOptions = [
    {
      label: "Microsoft",
      value: "Microsoft",
      icon: MicrosoftLogo,
    },
    {
      label: "Okta",
      value: "Okta",
      icon: OktaLogo,
    },
    {
      label: "OneLogin",
      value: "OneLogin",
      icon: OneLoginLogo,
    },
    {
      label: "Auth0",
      value: "Auth0",
      icon: Auth0Logo,
    },
    {
      label: "OIDC",
      value: "Oidc",
      icon: OidcLogoPng,
    },
    {
      label: "Upload your own",
      value: "Upload",
    },
  ]

  let fileinput
  let image

  let google
  let oidc
  const providers = { google, oidc }

  // control the state of the save button depending on whether form has changed
  let originalGoogleDoc
  let originalOidcDoc
  let googleSaveButtonDisabled
  let oidcSaveButtonDisabled
  $: {
    isEqual(providers.google?.config, originalGoogleDoc?.config)
      ? (googleSaveButtonDisabled = true)
      : (googleSaveButtonDisabled = false)
    isEqual(providers.oidc?.config, originalOidcDoc?.config)
      ? (oidcSaveButtonDisabled = true)
      : (oidcSaveButtonDisabled = false)
  }

  // Create a flag so that it will only try to save completed forms
  $: partialGoogle =
    providers.google?.config?.clientID || providers.google?.config?.clientSecret
  $: partialOidc =
    providers.oidc?.config?.configs[0].configUrl ||
    providers.oidc?.config?.configs[0].clientID ||
    providers.oidc?.config?.configs[0].clientSecret
  $: googleComplete =
    providers.google?.config?.clientID && providers.google?.config?.clientSecret
  $: oidcComplete =
    providers.oidc?.config?.configs[0].configUrl &&
    providers.oidc?.config?.configs[0].clientID &&
    providers.oidc?.config?.configs[0].clientSecret

  async function uploadLogo(file) {
    let data = new FormData()
    data.append("file", file)
    const res = await api.post(
      `/api/global/configs/upload/logos_oidc/${file.name}`,
      data,
      {}
    )
    return await res.json()
  }

  const onFileSelected = e => {
    let fileName = e.target.files[0].name
    image = e.target.files[0]
    providers.oidc.config.configs[0].logo = fileName
    iconDropdownOptions.unshift({ label: fileName, value: fileName })
  }

  async function save(docs) {
    // only if the user has provided an image, upload it.
    image && uploadLogo(image)
    let calls = []
    docs.forEach(element => {
      if (element.type === ConfigTypes.OIDC) {
        //Add a UUID here so each config is distinguishable when it arrives at the login page
        for (let config of element.config.configs) {
          if (!config.uuid) {
            config.uuid = uuid()
          }
          // callback urls shouldn't be included
          delete config.callbackURL
        }
        if (partialOidc) {
          if (!oidcComplete) {
            notifications.error(
              `Please fill in all required ${ConfigTypes.OIDC} fields`
            )
          } else {
            calls.push(api.post(`/api/global/configs`, element))
            // turn the save button grey when clicked
            oidcSaveButtonDisabled = true
            originalOidcDoc = cloneDeep(providers.oidc)
          }
        }
      }
      if (element.type === ConfigTypes.Google) {
        if (partialGoogle) {
          if (!googleComplete) {
            notifications.error(
              `Please fill in all required ${ConfigTypes.Google} fields`
            )
          } else {
            calls.push(api.post(`/api/global/configs`, element))
            googleSaveButtonDisabled = true
            originalGoogleDoc = cloneDeep(providers.google)
          }
        }
      }
    })
    calls.length &&
      Promise.all(calls)
        .then(responses => {
          return Promise.all(
            responses.map(response => {
              return response.json()
            })
          )
        })
        .then(data => {
          data.forEach(res => {
            providers[res.type]._rev = res._rev
            providers[res.type]._id = res._id
          })
          notifications.success(`Settings saved.`)
        })
        .catch(err => {
          notifications.error(`Failed to update auth settings. ${err}`)
          throw new Error(err.message)
        })
  }

  onMount(async () => {
    await organisation.init()
    // fetch the configs for oauth
    const googleResponse = await api.get(
      `/api/global/configs/${ConfigTypes.Google}`
    )
    const googleDoc = await googleResponse.json()

    if (!googleDoc._id) {
      providers.google = {
        type: ConfigTypes.Google,
        config: { activated: true },
      }
      originalGoogleDoc = cloneDeep(googleDoc)
    } else {
      // default activated to true for older configs
      if (googleDoc.config.activated === undefined) {
        googleDoc.config.activated = true
      }
      originalGoogleDoc = cloneDeep(googleDoc)
      providers.google = googleDoc
    }

    //Get the list of user uploaded logos and push it to the dropdown options.
    //This needs to be done before the config call so they're available when the dropdown renders
    const res = await api.get(`/api/global/configs/logos_oidc`)
    const configSettings = await res.json()

    if (configSettings.config) {
      const logoKeys = Object.keys(configSettings.config)

      logoKeys.map(logoKey => {
        const logoUrl = configSettings.config[logoKey]
        iconDropdownOptions.unshift({
          label: logoKey,
          value: logoKey,
          icon: logoUrl,
        })
      })
    }
    const oidcResponse = await api.get(
      `/api/global/configs/${ConfigTypes.OIDC}`
    )
    const oidcDoc = await oidcResponse.json()
    if (!oidcDoc._id) {
      providers.oidc = {
        type: ConfigTypes.OIDC,
        config: { configs: [{ activated: true }] },
      }
    } else {
      originalOidcDoc = cloneDeep(oidcDoc)
      providers.oidc = oidcDoc
    }
  })
</script>

<Layout noPadding>
  <Layout gap="XS" noPadding>
    <Heading size="M">Authentication</Heading>
    <Body>
      Every budibase app comes with basic authentication (email/password)
      included. You can add additional authentication methods from the options
      below.
    </Body>
  </Layout>
  {#if providers.google}
    <Divider />
    <Layout gap="XS" noPadding>
      <Heading size="S">
        <div class="provider-title">
          <GoogleLogo />
          <span>Google</span>
          <Button
            disabled={googleSaveButtonDisabled}
            size="s"
            cta
            on:click={() => save([providers.google])}
          >
            Save
          </Button>
        </div>
      </Heading>
      <Body size="S">
        To allow users to authenticate using their Google accounts, fill out the
        fields below.
      </Body>
    </Layout>
    <Layout gap="XS" noPadding>
      {#each GoogleConfigFields.Google as field}
        <div class="form-row">
          <Label size="L">{field.label}</Label>
          <Input
            bind:value={providers.google.config[field.name]}
            readonly={field.readonly}
            placeholder={field.placeholder}
          />
        </div>
      {/each}
      <div class="form-row">
        <Label size="L">Activated</Label>
        <Toggle text="" bind:value={providers.google.config.activated} />
      </div>
    </Layout>
  {/if}
  {#if providers.oidc}
    <Divider />
    <Layout gap="XS" noPadding>
      <Heading size="S">
        <div class="provider-title">
          <OidcLogo />
          <span>OpenID Connect</span>
          <Button
            disabled={oidcSaveButtonDisabled}
            size="s"
            cta
            on:click={() => save([providers.oidc])}
          >
            Save
          </Button>
        </div>
      </Heading>
      <Body size="S">
        To allow users to authenticate using OIDC, fill out the fields below.
      </Body>
    </Layout>
    <Layout gap="XS" noPadding>
      {#each OIDCConfigFields.Oidc as field}
        <div class="form-row">
          <Label size="L">{field.label}</Label>
          <Input
            bind:value={providers.oidc.config.configs[0][field.name]}
            readonly={field.readonly}
            placeholder={field.placeholder}
          />
        </div>
      {/each}
    </Layout>
    <Layout gap="XS" noPadding>
      <Body size="S">
        To customize your login button, fill out the fields below.
      </Body>
      <div class="form-row">
        <Label size="L">Name</Label>
        <Input bind:value={providers.oidc.config.configs[0].name} />
      </div>
      <div class="form-row">
        <Label size="L">Icon</Label>
        <Select
          label=""
          bind:value={providers.oidc.config.configs[0].logo}
          options={iconDropdownOptions}
          on:change={e => e.detail === "Upload" && fileinput.click()}
        />
      </div>
      <input
        type="file"
        accept=".jpg, .jpeg, .png"
        on:change={e => onFileSelected(e)}
        bind:this={fileinput}
      />
      <div class="form-row">
        <Label size="L">Activated</Label>
        <Toggle
          text=""
          bind:value={providers.oidc.config.configs[0].activated}
        />
      </div>
    </Layout>
  {/if}
</Layout>

<style>
  .form-row {
    display: grid;
    grid-template-columns: 100px 1fr;
    grid-gap: var(--spacing-l);
    align-items: center;
  }

  input[type="file"] {
    display: none;
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
</style>
