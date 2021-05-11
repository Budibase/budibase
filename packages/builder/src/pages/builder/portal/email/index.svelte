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
  import TemplateBindings from "./TemplateBindings.svelte"
  import TemplateLink from "./TemplateLink.svelte"
  import api from "builderStore/api"

  const ConfigTypes = {
    SMTP: "smtp",
  }

  const templateSchema = {
    purpose: {
      displayName: "Email",
      editable: false
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

<Page>
  <header>
    <Heading size="M">Email</Heading>
    <Body size="S">
      Sending email is not required, but highly recommended for processes such
      as password recovery. To setup automated auth emails, simply add the
      values below and click activate.
    </Body>
  </header>
  <Divider />
  {#if smtpConfig}
    <div class="config-form">
      <Heading size="S">SMTP</Heading>
      <Body size="S">
        To allow your app to benefit from automated auth emails, add your SMTP
        details below.
      </Body>
      <Layout gap="S">
        <Heading size="S">
          <span />
        </Heading>
        <div class="form-row">
          <Label>Host</Label>
          <Input bind:value={smtpConfig.config.host} />
        </div>
        <div class="form-row">
          <Label>Port</Label>
          <Input type="number" bind:value={smtpConfig.config.port} />
        </div>
        <div class="form-row">
          <Label>User</Label>
          <Input bind:value={smtpConfig.config.auth.user} />
        </div>
        <div class="form-row">
          <Label>Password</Label>
          <Input type="password" bind:value={smtpConfig.config.auth.pass} />
        </div>
        <div class="form-row">
          <Label>From email address</Label>
          <Input type="email" bind:value={smtpConfig.config.from} />
        </div>
      </Layout>
      <Button cta on:click={saveSmtp}>Save</Button>
    </div>
    <Divider />

    <div class="config-form">
      <Heading size="S">Templates</Heading>
      <Body size="S">
        Budibase comes out of the box with ready-made email templates to help
        with user onboarding. Please refrain from changing the links.
      </Body>
    </div>
    <Table
      {customRenderers}
      on:editrow={evt => $goto(`./${evt.detail.purpose}`)}
      data={$email.templates}
      schema={templateSchema}
      {loading}
      allowEditRows={false}
      allowSelectRows={false}
      allowEditColumns={false}
    />
  {/if}
</Page>

<style>
  .config-form {
    margin-top: 42px;
    margin-bottom: 42px;
  }

  .form-row {
    display: grid;
    grid-template-columns: 20% 1fr;
    grid-gap: var(--spacing-l);
  }

  span {
    display: flex;
    align-items: center;
    gap: var(--spacing-s);
  }

  header {
    margin-bottom: 42px;
  }
</style>
