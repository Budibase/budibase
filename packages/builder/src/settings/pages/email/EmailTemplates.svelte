<script lang="ts">
  import {
    notifications,
    Layout,
    Body,
    Table,
    ButtonGroup,
    Button,
  } from "@budibase/bbui"
  import { email } from "@/stores/portal/email"
  import {
    type FindConfigResponse,
    type FetchGlobalTemplateDefinitionResponse,
  } from "@budibase/types"
  import { onMount } from "svelte"
  import { bb } from "@/stores/bb"
  import { fetchSmtp } from "./utils"
  import { downloadFile } from "@budibase/frontend-core"

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
  $: hasCustom = ($email.templates || []).find(template => template._id)

  let smtpConfig: FindConfigResponse | null
  let loading = false

  function getEmailInfo(
    definitions: FetchGlobalTemplateDefinitionResponse | undefined
  ) {
    if (!definitions) {
      return []
    }
    const entries = Object.entries(definitions.info)
    return entries.map(([key, value]) => ({ purpose: key, ...value }))
  }

  onMount(async () => {
    try {
      smtpConfig = await fetchSmtp()
      await email.fetchTemplates()
    } catch (error) {
      notifications.error("Error fetching email templates")
    }
  })
</script>

<Layout gap="S" noPadding>
  {#if smtpConfig}
    <Layout gap="XS" noPadding>
      <Body size="S">
        Budibase comes out of the box with ready-made email templates to help
        with user onboarding.
      </Body>
    </Layout>
    <div>
      <ButtonGroup>
        <Button
          quiet
          on:click={async () => {
            const downloaded = await downloadFile(
              "/api/global/template/email/export"
            )
            if (!downloaded) {
              notifications.error("Could not download email templates")
            }
          }}
        >
          Export default
        </Button>
        {#if !!hasCustom}
          <Button
            secondary
            on:click={async () => {
              const downloaded = await downloadFile(
                "/api/global/template/email/export",
                {
                  type: "custom",
                }
              )
              if (!downloaded) {
                notifications.error("Could not download email templates")
              }
            }}
          >
            Export
          </Button>
        {/if}
      </ButtonGroup>
    </div>
    <Table
      data={emailInfo}
      schema={templateSchema}
      {loading}
      on:click={({ detail }) => {
        bb.settings(`/email/templates/${detail.purpose}`)
      }}
      allowEditRows={false}
      allowSelectRows={false}
      allowEditColumns={false}
    />
  {/if}
</Layout>
