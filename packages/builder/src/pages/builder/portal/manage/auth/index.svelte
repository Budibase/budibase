<script>
  import GoogleLogo from "./_logos/Google.svelte"
  import OIDCLogo from "./_logos/OIDC.svelte"
  import {
    Button,
    Heading,
    Divider,
    Label,
    notifications,
    Layout,
    Input,
    Body,
    Select
  } from "@budibase/bbui"
  import { onMount } from "svelte"
  import api from "builderStore/api"

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
    Oidc: [
      "issuer",
      "authUrl",
      "tokenUrl",
      "userInfoUrl",
      "clientId",
      "clientSecret",
      "callbackUrl",
      "name"
    ],
  }
  const OIDCConfigLabels = {
    Oidc: {
      issuer: "Issuer",
      authUrl: "Authorization URL",
      tokenUrl: "Token URL",
      userInfoUrl: "User Info URL",
      clientId: "Client ID",
      clientSecret: "Client Secret",
      callbackUrl: "Callback URL",
      name: "Name"
    },
  }
  
  let google
  let oidc
  const providers = {google, oidc}

  async function save(docs) {
    let calls = []
    docs.forEach(element => {
      calls.push(api.post(`/api/admin/configs`, element))
    })
    Promise.all(calls)
      .then(responses => {
        return Promise.all(responses.map(response => {
          return response.json()
        }))
      }).then(data => {
        data.forEach(res => {
          providers[res.type]._rev = res._rev
          providers[res.type]._id = res._id
        })
          //res.json()._rev = res.json()._rev
          //res.json().id = res.json().id
        notifications.success(`Settings saved.`)
      })
      .catch(err => {
        notifications.error(`Failed to update OAuth settings. ${err}`)
        throw new Error(err.message)
      })
  }

  onMount(async () => {
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

    const oidcResponse = await api.get(`/api/admin/configs/${ConfigTypes.OIDC}`)
    const oidcDoc = await oidcResponse.json()

    if (!oidcDoc._id) {
      providers.oidc = {
        type: ConfigTypes.OIDC,
        config: {},
      }
    } else {
      providers.oidc = oidcDoc
    }
  })  
  let fileInput

</script>

<Layout>
  <Layout gap="XS" noPadding>
    <Heading size="M">OAuth</Heading>
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
          <GoogleLogo />
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
          <Input bind:value={providers.oidc.config[field]} />
        </div>
      {/each}
      <Body size="S">
        To customize your login button, fill out the fields below. 
      </Body>
      <div class="form-row">
        <Label size="L">{OIDCConfigLabels.Oidc['name']}</Label>
        <Select
          options={["Upload File"]}
          placeholder={null}
        />

      </div>      
    </Layout>
  {/if}
  <div>
    <Button cta on:click={() => save([providers.google, providers.oidc])}>Save</Button>
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
</style>
