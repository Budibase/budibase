<script>
  import { goto } from "@roxi/routify"
  import {
    Button,
    Heading,
    Divider,
    Label,
    Page,
    notifications,
    Layout,
    Input,
    Body,
    Table,
  } from "@budibase/bbui"
  import { email } from "stores/portal"
  import TemplateLink from "./_components/TemplateLink.svelte"
  import api from "builderStore/api"

  const ConfigTypes = {
    SMTP: "smtp",
  }

  const templateSchema = {
    purpose: {
      displayName: "Email",
      editable: false,
    },
  }

  const customRenderers = [
    {
      column: "purpose",
      component: TemplateLink,
    },
  ]

  let smtpConfig
  let loading

  async function saveSmtp() {
    // Save your SMTP config
    const response = await api.post(`/api/admin/configs`, smtpConfig)

    if (response.status !== 200) {
      const error = await response.text()
      let message = error
      try {
        message = JSON.parse(error).message
      } catch (err) {}
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
          auth: {
            type: "login",
          },
        },
      }
    } else {
      smtpConfig = smtpDoc
    }
    loading = false
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
        <Label size="L">Port</Label>
        <Input type="number" bind:value={smtpConfig.config.port} />
      </div>
      <div class="form-row">
        <Label size="L">User</Label>
        <Input bind:value={smtpConfig.config.auth.user} />
      </div>
      <div class="form-row">
        <Label size="L">Password</Label>
        <Input type="password" bind:value={smtpConfig.config.auth.pass} />
      </div>
      <div class="form-row">
        <Label size="L">From email address</Label>
        <Input type="email" bind:value={smtpConfig.config.from} />
      </div>
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
      {customRenderers}
      data={$email.templates}
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
