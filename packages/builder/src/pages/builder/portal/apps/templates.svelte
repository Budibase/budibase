<script>
  import { goto } from "@roxi/routify"
  import { Layout, Page, notifications, ActionButton } from "@budibase/bbui"
  import TemplateDisplay from "components/common/TemplateDisplay.svelte"
  import { onMount } from "svelte"
  import { templates } from "stores/portal"

  let loaded = $templates?.length

  onMount(async () => {
    try {
      await templates.load()
      if ($templates?.length === 0) {
        notifications.error(
          "There was a problem loading quick start templates."
        )
      }
    } catch (error) {
      notifications.error("Error loading apps and templates")
    }
    loaded = true
  })
</script>

<Page wide>
  <Layout noPadding gap="XL">
    <span>
      <ActionButton
        secondary
        icon={"ArrowLeft"}
        on:click={() => {
          $goto("../")
        }}
      >
        Back
      </ActionButton>
    </span>
    {#if loaded && $templates?.length}
      <TemplateDisplay templates={$templates} />
    {/if}
  </Layout>
</Page>
