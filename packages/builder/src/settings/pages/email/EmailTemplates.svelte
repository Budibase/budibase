<script lang="ts">
  import { notifications, Layout, Body, Table } from "@budibase/bbui"
  import { email } from "@/stores/portal"
  import {
    type FindConfigResponse,
    type FetchGlobalTemplateDefinitionResponse,
  } from "@budibase/types"
  import { onMount } from "svelte"
  import { bb } from "@/stores/bb"
  import { fetchSmtp } from "./utils"

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
