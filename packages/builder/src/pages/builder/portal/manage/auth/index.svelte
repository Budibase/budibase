<script>
  import GoogleLogo from "./_logos/Google.svelte"
  import OidcLogo from "./_logos/OIDC.svelte"
  import MicrosoftLogo from "assets/microsoft-logo.png"
  import Auth0Logo from "assets/auth0-logo.png"
  import OktaLogo from "assets/okta-logo.png"
  import OneLoginLogo from "assets/onelogin-logo.png"
  import OidcLogoPng from "assets/oidc-logo.png"

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
  } from "@budibase/bbui"
  import { onMount } from "svelte"
  import api from "builderStore/api"
  import { organisation } from "stores/portal"
  import { uuid } from "builderStore/uuid"

  const ConfigTypes = {
    Google: "google",
    OIDC: "oidc",
    // Github: "github",
    // AzureAD: "ad",
  }

  const GoogleConfigFields = {
    Google: ["clientID", "clientSecret", "callbackURL"],
  }
  const GoogleConfigLabels = {
    Google: {
      clientID: "Client ID",
      clientSecret: "Client secret",
      callbackURL: "Callback URL",
    },
  }

  const OIDCConfigFields = {
    Oidc: ["configUrl", "clientID", "clientSecret"],
  }
  const OIDCConfigLabels = {
    Oidc: {
      configUrl: "Config URL",
      clientID: "Client ID",
      clientSecret: "Client Secret",
    },
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

  // Create a flag so that it will only try to save completed forms

  $: trySaveGoogle =
    providers.google?.config.clientID ||
    providers.google?.config.clientSecret ||
    providers.google?.config.callbackURL
  $: trySaveOidc =
    providers.oidc?.config?.configs[0].configUrl ||
    providers.oidc?.config?.configs[0].clientID ||
    providers.oidc?.config?.configs[0].clientSecret
  $: googleComplete =
    providers.google?.config.clientID &&
    providers.google?.config.clientSecret &&
    providers.google?.config.callbackURL
  $: oidcComplete =
    providers.oidc?.config?.configs[0].configUrl &&
    providers.oidc?.config?.configs[0].clientID &&
    providers.oidc?.config?.configs[0].clientSecret

  async function uploadLogo(file) {
    let data = new FormData()
    data.append("file", file)
    const res = await api.post(
      `/api/admin/configs/upload/logos_oidc/${file.name}`,
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
    let completed = []
    docs.forEach(element => {
      if (element.type === ConfigTypes.OIDC) {
        //Add a UUID here so each config is distinguishable when it arrives at the login page.
        element.config.configs.forEach(config => {
          !config.uuid && (config.uuid = uuid())
        })
        if (trySaveOidc) {
          if (!oidcComplete) {
            notifications.error(
              `Please fill in all required ${ConfigTypes.OIDC} fields`
            )
          } else {
            calls.push(api.post(`/api/admin/configs`, element))
            completed.push(ConfigTypes.OIDC)
          }
        }
      }
      if (element.type === ConfigTypes.Google) {
        if (trySaveGoogle) {
          if (!googleComplete) {
            notifications.error(
              `Please fill in all required ${ConfigTypes.Google} fields`
            )
          } else {
            calls.push(api.post(`/api/admin/configs`, element))
            completed.push(ConfigTypes.Google)
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
      `/api/admin/configs/${ConfigTypes.Google}`
    )
    const googleDoc = await googleResponse.json()

    if (!googleDoc._id) {
      providers.google = {
        type: ConfigTypes.Google,
        config: {},
      }
    } else {
      providers.google = googleDoc
    }

    //Get the list of user uploaded logos and push it to the dropdown options.
    //This needs to be done before the config call so they're available when the dropdown renders
    const res = await api.get(`/api/admin/configs/logos_oidc`)
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
    const oidcResponse = await api.get(`/api/admin/configs/${ConfigTypes.OIDC}`)
    const oidcDoc = await oidcResponse.json()

    if (!oidcDoc._id) {
      providers.oidc = {
        type: ConfigTypes.OIDC,
        config: { configs: [{}] },
      }
    } else {
      providers.oidc = oidcDoc
    }
  })
</script>

<Layout>
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
        <span>
          <GoogleLogo />
          Google
        </span>
      </Heading>
      <Body size="S">
        To allow users to authenticate using their Google accounts, fill out the
        fields below.
      </Body>
    </Layout>
    <Layout gap="XS" noPadding>
      {#each GoogleConfigFields.Google as field}
        <div class="form-row">
          <Label size="L">{GoogleConfigLabels.Google[field]}</Label>
          <Input bind:value={providers.google.config[field]} />
        </div>
      {/each}
    </Layout>
  {/if}
  {#if providers.oidc}
    <Divider />
    <Layout gap="XS" noPadding>
      <Heading size="S">
        <span>
          <OidcLogo />
          OpenID Connect
        </span>
      </Heading>
      <Body size="S">
        To allow users to authenticate using OIDC, fill out the fields below.
      </Body>
    </Layout>
    <Layout gap="XS" noPadding>
      {#each OIDCConfigFields.Oidc as field}
        <div class="form-row">
          <Label size="L">{OIDCConfigLabels.Oidc[field]}</Label>
          <Input bind:value={providers.oidc.config.configs[0][field]} />
        </div>
      {/each}
      <div class="form-row">
        <Label size="L">Callback URL</Label>
        <Input readonly placeholder="/api/admin/auth/oidc/callback" />
      </div>
      <br />
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
    </Layout>
  {/if}
  <div>
    <Button cta on:click={() => save([providers.google, providers.oidc])}
      >Save</Button
    >
  </div>
</Layout>

<style>
  .form-row {
    display: grid;
    grid-template-columns: 20% 1fr;
    grid-gap: var(--spacing-l);
    align-items: center;
  }
  span {
    display: flex;
    align-items: center;
    gap: var(--spacing-s);
  }

  input {
    display: none;
  }
</style>
