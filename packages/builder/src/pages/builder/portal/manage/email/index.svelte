<script>
  import { goto } from "@roxi/routify"
  import {
    Menu,
    MenuItem,
    Button,
    Heading,
    Divider,
    Label,
    Modal,
    ModalContent,
    notifications,
    Layout,
    Input,
    TextArea,
    Body,
    Page,
    Select,
    MenuSection,
    MenuSeparator,
    Table,
  } from "@budibase/bbui"
  import { onMount } from "svelte"
  import { email } from "stores/portal"
  import Editor from "components/integration/QueryEditor.svelte"
  import TemplateBindings from "./_components/TemplateBindings.svelte"
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
  let bindingsOpen = false
  let htmlModal
  let htmlEditor
  let loading

  async function saveSmtp() {
    try {
      // Save your SMTP config
      const response = await api.post(`/api/admin/configs`, smtpConfig)
      const json = await response.json()
      if (response.status !== 200) throw new Error(json.message)
      smtpConfig._rev = json._rev
      smtpConfig._id = json._id

      notifications.success(`Settings saved.`)
    } catch (err) {
      notifications.error(`Failed to save email settings. ${err}`)
    }
  }

  async function saveTemplate() {
    try {
      await email.templates.save(selectedTemplate)
      notifications.success(`Template saved.`)
    } catch (err) {
      notifications.error(`Failed to update template settings. ${err}`)
    }
  }

  async function fetchSmtp() {
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
  }

  onMount(async () => {
    loading = true
    await fetchSmtp()
    await email.templates.fetch()
    loading = false
  })
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
