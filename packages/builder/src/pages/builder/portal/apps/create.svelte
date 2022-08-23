<script>
  import { goto } from "@roxi/routify"
  import {
    Layout,
    Page,
    notifications,
    Button,
    Heading,
    Body,
    Modal,
    Divider,
    ActionButton,
  } from "@budibase/bbui"
  import CreateAppModal from "components/start/CreateAppModal.svelte"
  import TemplateDisplay from "components/common/TemplateDisplay.svelte"
  import { onMount } from "svelte"
  import { templates } from "stores/portal"

  let loaded = $templates?.length
  let template
  let creationModal = false
  let creatingApp = false

  const welcomeBody =
    "Start from scratch or get a head start with one of our templates"
  const createAppTitle = "Create new app"
  const createAppButtonText = "Start from scratch"

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

  const initiateAppCreation = () => {
    template = null
    creationModal.show()
    creatingApp = true
  }

  const stopAppCreation = () => {
    template = null
    creatingApp = false
  }

  const initiateAppImport = () => {
    template = { fromFile: true }
    creationModal.show()
    creatingApp = true
  }
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

    <div class="title">
      <div class="welcome">
        <Layout noPadding gap="XS">
          <Heading size="L">{createAppTitle}</Heading>
          <Body size="M">
            {welcomeBody}
          </Body>
        </Layout>

        <div class="buttons">
          <Button
            dataCy="create-app-btn"
            size="M"
            icon="Add"
            cta
            on:click={initiateAppCreation}
          >
            {createAppButtonText}
          </Button>
          <Button
            dataCy="import-app-btn"
            icon="Import"
            size="M"
            quiet
            secondary
            on:click={initiateAppImport}
          >
            Import app
          </Button>
        </div>
      </div>
    </div>

    <Divider size="S" />

    {#if loaded && $templates?.length}
      <TemplateDisplay templates={$templates} />
    {/if}
  </Layout>
</Page>

<Modal
  bind:this={creationModal}
  padding={false}
  width="600px"
  on:hide={stopAppCreation}
>
  <CreateAppModal {template} />
</Modal>

<style>
  .title .welcome > .buttons {
    padding-top: 30px;
  }
  .title {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    gap: var(--spacing-xl);
    flex-wrap: wrap;
  }
  .buttons {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    gap: var(--spacing-xl);
    flex-wrap: wrap;
  }
  @media (max-width: 640px) {
    .buttons {
      flex-direction: row-reverse;
      justify-content: flex-end;
    }
  }
</style>
