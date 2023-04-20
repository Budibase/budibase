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
  import { email, admin } from "stores/portal"
  import { API } from "api"
  import { cloneDeep } from "lodash/fp"

  import { _ } from "../../../../../../lang/i18n"

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
    try {
      const savedConfig = await API.saveConfig(smtp)
      smtpConfig._rev = savedConfig._rev
      smtpConfig._id = savedConfig._id
      await admin.getChecklist()
      notifications.success(
        $_("pages.builder.portal.settings.email.index.Settings_saved")
      )
    } catch (error) {
      notifications.error(
        `${$_("pages.builder.portal.settings.email.index.Failed_save")}: ${
          error?.message ||
          $_("pages.builder.portal.settings.email.index.Unknown")
        }`
      )
    }
  }

  async function deleteSmtp() {
    // Delete the SMTP config
    try {
      await API.deleteConfig({
        id: smtpConfig._id,
        rev: smtpConfig._rev,
      })
      smtpConfig = {
        type: ConfigTypes.SMTP,
        config: {
          secure: true,
        },
      }
      await admin.getChecklist()
      notifications.success(
        `${$_("pages.builder.portal.settings.email.index.Settings_cleared")}`
      )
    } catch (error) {
      notifications.error(
        `${$_("pages.builder.portal.settings.email.index.Failed_clear")}: ${
          error?.message ||
          $_("pages.builder.portal.settings.email.index.Unknown")
        }`
      )
    }
  }

  async function fetchSmtp() {
    loading = true
    try {
      // Fetch the configs for smtp
      const smtpDoc = await API.getConfig(ConfigTypes.SMTP)
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
      // Always attach the auth for the forms purpose -
      // this will be removed later if required
      if (!smtpDoc.config) {
        smtpDoc.config = {}
      }
      if (!smtpDoc.config.auth) {
        smtpConfig.config.auth = {
          type: "login",
        }
      }
    } catch (error) {
      notifications.error(
        $_("pages.builder.portal.settings.email.index.Error_fetching")
      )
    }
  }

  fetchSmtp()
</script>

<Layout noPadding>
  <Layout noPadding gap="XS">
    <Heading size="M">Email</Heading>
    <Body>{$_("pages.builder.portal.settings.email.index.Add_SMTP")}</Body>
  </Layout>
  <Divider />
  {#if smtpConfig}
    <Layout gap="XS" noPadding>
      <Heading size="S">SMTP</Heading>
      <Body size="S">
        {$_("pages.builder.portal.settings.email.index.app_benefit")}
      </Body>
    </Layout>
    <Layout gap="XS" noPadding>
      <div class="form-row">
        <Label size="L"
          >{$_("pages.builder.portal.settings.email.index.Host")}</Label
        >
        <Input bind:value={smtpConfig.config.host} />
      </div>
      <div class="form-row">
        <Label size="L"
          >{$_(
            "pages.builder.portal.settings.email.index.Security_type"
          )}</Label
        >
        <Select
          bind:value={smtpConfig.config.secure}
          options={[
            { label: "SSL/TLS", value: true },
            { label: "None/STARTTLS", value: false },
          ]}
        />
      </div>
      <div class="form-row">
        <Label size="L"
          >{$_("pages.builder.portal.settings.email.index.Host")}</Label
        >
        <Input type="number" bind:value={smtpConfig.config.port} />
      </div>
      <div class="form-row">
        <Label size="L"
          >{$_("pages.builder.portal.settings.email.index.Port")}</Label
        >
        <Input type="email" bind:value={smtpConfig.config.from} />
      </div>
      <div class="form-row">
        <Label size="L"
          >{$_(
            "pages.builder.portal.settings.email.index.Require_sign_in"
          )}</Label
        >
        <Checkbox bind:value={requireAuth} />
      </div>
      {#if requireAuth}
        <div class="form-row">
          <Label size="L"
            >{$_("pages.builder.portal.settings.email.index.User")}</Label
          >
          <Input bind:value={smtpConfig.config.auth.user} />
        </div>
        <div class="form-row">
          <Label size="L"
            >{$_("pages.builder.portal.settings.email.index.Password")}</Label
          >
          <Input type="password" bind:value={smtpConfig.config.auth.pass} />
        </div>
      {/if}
    </Layout>
    <div class="spectrum-ButtonGroup spectrum-Settings-buttonGroup">
      <Button cta on:click={saveSmtp}
        >{$_("pages.builder.portal.settings.email.index.Save")}</Button
      >
      <Button
        secondary
        on:click={deleteSmtp}
        disabled={!$admin.checklist.smtp.checked}
      >
        {$_("pages.builder.portal.settings.email.index.Reset")}
      </Button>
    </div>
    <Divider />
    <Layout gap="XS" noPadding>
      <Heading size="S"
        >{$_("pages.builder.portal.settings.email.index.Templates")}</Heading
      >
      <Body size="S">
        {$_("pages.builder.portal.settings.email.index.ready-made_email")}
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
    grid-template-columns: 120px 1fr;
    grid-gap: var(--spacing-l);
    align-items: center;
  }
  .spectrum-Settings-buttonGroup {
    gap: var(--spectrum-global-dimension-static-size-200);
    align-items: flex-end;
  }
</style>
