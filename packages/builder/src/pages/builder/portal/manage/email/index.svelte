<script>
  import { goto } from "@roxi/routify"
  import {
    Button,
    Heading,
    Divider,
    Label,
    notifications,
    Layout,
    Input,
    Select,
    Body,
    Table,
    Checkbox,
  } from "@budibase/bbui"
  import { email } from "stores/portal"
  import api from "builderStore/api"
  import { cloneDeep } from "lodash/fp"

  const ConfigTypes = {
    SMTP: "smtp",
  }

  const templateSchema = {
    name: {
      displayName: "Name",
      editable: false,
    },
    category: {
      displayName: "Category",
      editable: false,
    },
  }

  $: emailInfo = getEmailInfo($email.definitions)

  let smtpConfig
  let loading
  let requireAuth = false

  function getEmailInfo(definitions) {
    if (!definitions) {
      return []
    }
    const entries = Object.entries(definitions.info)
    return entries.map(([key, value]) => ({ purpose: key, ...value }))
  }

  async function saveSmtp() {
    // clone it so we can remove stuff if required
    const smtp = cloneDeep(smtpConfig)
    if (!requireAuth) {
      delete smtp.config.auth
    }
    // Save your SMTP config
    const response = await api.post(`/api/admin/configs`, smtp)

    if (response.status !== 200) {
      const error = await response.text()
      let message
      try {
        message = JSON.parse(error).message
      } catch (err) {
        message = error
      }
      notifications.error(`Failed to save email settings, reason: ${message}`)
    } else {
      const json = await response.json()
      smtpConfig._rev = json._rev
      smtpConfig._id = json._id
      notifications.success(`Settings saved.`)
    }
  }

  async function fetchSmtp() {
    loading = true
    // fetch the configs for smtp
    const smtpResponse = await api.get(`/api/admin/configs/${ConfigTypes.SMTP}`)
    const smtpDoc = await smtpResponse.json()

    if (!smtpDoc._id) {
      smtpConfig = {
        type: ConfigTypes.SMTP,
        config: {
          secure: true,
        },
      }
    } else {
      smtpConfig = smtpDoc
    }
    loading = false
    requireAuth = smtpConfig.config.auth != null
    // always attach the auth for the forms purpose -
    // this will be removed later if required
    smtpConfig.config.auth = {
      type: "login",
    }
  }

  fetchSmtp()
</script>

<Layout>
  <Layout noPadding gap="XS">
    <Heading size="M">Email</Heading>
    <Body>
      Sending email is not required, but highly recommended for processes such
      as password recovery. To setup automated auth emails, simply add the
      values below and click activate.
    </Body>
  </Layout>
  <Divider />
  {#if smtpConfig}
    <Layout gap="XS" noPadding>
      <Heading size="S">SMTP</Heading>
      <Body size="S">
        To allow your app to benefit from automated auth emails, add your SMTP
        details below.
      </Body>
    </Layout>
    <Layout gap="XS" noPadding>
      <div class="form-row">
        <Label size="L">Host</Label>
        <Input bind:value={smtpConfig.config.host} />
      </div>
      <div class="form-row">
        <Label size="L">Security type</Label>
        <Select
          bind:value={smtpConfig.config.secure}
          options={[
            { label: "SSL/TLS", value: true },
            { label: "None/STARTTLS", value: false },
          ]}
        />
      </div>
      <div class="form-row">
        <Label size="L">Port</Label>
        <Input type="number" bind:value={smtpConfig.config.port} />
      </div>
      <div class="form-row">
        <Label size="L">From email address</Label>
        <Input type="email" bind:value={smtpConfig.config.from} />
      </div>
      <Checkbox bind:value={requireAuth} text="Require sign-in" />
      {#if requireAuth}
        <div class="form-row">
          <Label size="L">User</Label>
          <Input bind:value={smtpConfig.config.auth.user} />
        </div>
        <div class="form-row">
          <Label size="L">Password</Label>
          <Input type="password" bind:value={smtpConfig.config.auth.pass} />
        </div>
      {/if}
    </Layout>
    <div>
      <Button cta on:click={saveSmtp}>Save</Button>
    </div>
    <Divider />
    <Layout gap="XS" noPadding>
      <Heading size="S">Templates</Heading>
      <Body size="S">
        Budibase comes out of the box with ready-made email templates to help
        with user onboarding. Please refrain from changing the links.
      </Body>
    </Layout>
    <Table
      data={emailInfo}
      schema={templateSchema}
      {loading}
      on:click={({ detail }) => $goto(`./${detail.purpose}`)}
      allowEditRows={false}
      allowSelectRows={false}
      allowEditColumns={false}
    />
  {/if}
</Layout>

<style>
  .form-row {
    display: grid;
    grid-template-columns: 25% 1fr;
    grid-gap: var(--spacing-l);
    align-items: center;
  }
</style>
