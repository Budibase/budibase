<script>
  import {
    Heading,
    Layout,
    Button,
    ActionButton,
    ActionGroup,
    ButtonGroup,
    Select,
    Modal,
    ModalContent,
    Page,
    notifications,
    Body,
  } from "@budibase/bbui"
  import CreateAppModal from "components/start/CreateAppModal.svelte"
  import UpdateAppModal from "components/start/UpdateAppModal.svelte"
  import api, { del } from "builderStore/api"
  import analytics from "analytics"
  import { onMount } from "svelte"
  import { apps, auth, admin } from "stores/portal"
  import download from "downloadjs"
  import { goto } from "@roxi/routify"
  import ConfirmDialog from "components/common/ConfirmDialog.svelte"
  import AppCard from "components/start/AppCard.svelte"
  import AppRow from "components/start/AppRow.svelte"
  import { AppStatus } from "constants"

  let layout = "grid"
  let sortBy = "name"
  let template
  let selectedApp
  let creationModal
  let updatingModal
  let deletionModal
  let unpublishModal
  let creatingApp = false
  let loaded = false

  $: enrichedApps = enrichApps($apps, $auth.user, sortBy)

  const enrichApps = (apps, user, sortBy) => {
    const enrichedApps = apps.map(app => ({
      ...app,
      deployed: app.status === AppStatus.DEPLOYED,
      lockedYou: app.lockedBy && app.lockedBy.email === user?.email,
      lockedOther: app.lockedBy && app.lockedBy.email !== user?.email,
    }))
    if (sortBy === "status") {
      return enrichedApps.sort((a, b) => {
        if (a.status === b.status) {
          return a.name.toLowerCase() < b.name.toLowerCase() ? -1 : 1
        }
        return a.status === AppStatus.DEPLOYED ? -1 : 1
      })
    } else if (sortBy === "updated") {
      return enrichedApps.sort((a, b) => {
        const aUpdated = a.updatedAt || "9999"
        const bUpdated = b.updatedAt || "9999"
        return aUpdated < bUpdated ? 1 : -1
      })
    } else {
      return enrichedApps.sort((a, b) => {
        return a.name.toLowerCase() < b.name.toLowerCase() ? -1 : 1
      })
    }
  }

  const checkKeys = async () => {
    const response = await api.get(`/api/keys/`)
    const keys = await response.json()
    if (keys.userId) {
      analytics.identify(keys.userId)
    }
  }

  const initiateAppCreation = () => {
    creationModal.show()
    creatingApp = true
  }

  const initiateAppImport = () => {
    template = { fromFile: true }
    creationModal.show()
    creatingApp = true
  }

  const stopAppCreation = () => {
    template = null
    creatingApp = false
  }

  const viewApp = app => {
    const id = app.deployed ? app.prodId : app.devId
    window.open(`/${id}`, "_blank")
  }

  const editApp = app => {
    if (app.lockedOther) {
      notifications.error(
        `App locked by ${app.lockedBy.email}. Please allow lock to expire or have them unlock this app.`
      )
      return
    }
    $goto(`../../app/${app.devId}`)
  }

  const exportApp = app => {
    const id = app.deployed ? app.prodId : app.devId
    try {
      download(
        `/api/backups/export?appId=${id}&appname=${encodeURIComponent(
          app.name
        )}`
      )
      notifications.success("App exported successfully")
    } catch (err) {
      notifications.error(`Error exporting app: ${err}`)
    }
  }

  const unpublishApp = app => {
    selectedApp = app
    unpublishModal.show()
  }

  const confirmUnpublishApp = async () => {
    if (!selectedApp) {
      return
    }
    try {
      const response = await del(
        `/api/applications/${selectedApp.prodId}?unpublish=1`
      )
      if (response.status !== 200) {
        const json = await response.json()
        throw json.message
      }
      await apps.load()
      notifications.success("App unpublished successfully")
    } catch (err) {
      notifications.error(`Error unpublishing app: ${err}`)
    }
  }

  const deleteApp = app => {
    selectedApp = app
    deletionModal.show()
  }

  const confirmDeleteApp = async () => {
    if (!selectedApp) {
      return
    }
    try {
      const response = await del(`/api/applications/${selectedApp?.devId}`)
      if (response.status !== 200) {
        const json = await response.json()
        throw json.message
      }
      await apps.load()
      // get checklist, just in case that was the last app
      await admin.init()
      notifications.success("App deleted successfully")
    } catch (err) {
      notifications.error(`Error deleting app: ${err}`)
    }
    selectedApp = null
  }

  const updateApp = async app => {
    selectedApp = app
    updatingModal.show()
  }

  const releaseLock = async app => {
    try {
      const response = await del(`/api/dev/${app.devId}/lock`)
      if (response.status !== 200) {
        const json = await response.json()
        throw json.message
      }
      await apps.load()
      notifications.success("Lock released successfully")
    } catch (err) {
      notifications.error(`Error releasing lock: ${err}`)
    }
  }

  onMount(async () => {
    checkKeys()
    await apps.load()
    loaded = true
  })
</script>

<Page wide>
  {#if loaded && enrichedApps.length}
    <Layout noPadding>
      <div class="title">
        <Heading>Apps</Heading>
        <ButtonGroup>
          <Button secondary on:click={initiateAppImport}>Import app</Button>
          <Button cta on:click={initiateAppCreation}>Create app</Button>
        </ButtonGroup>
      </div>
      <div class="filter">
        <div class="select">
          <Select
            bind:value={sortBy}
            placeholder={null}
            options={[
              { label: "Sort by name", value: "name" },
              { label: "Sort by recently updated", value: "updated" },
              { label: "Sort by status", value: "status" },
            ]}
          />
        </div>
        <ActionGroup>
          <ActionButton
            on:click={() => (layout = "grid")}
            selected={layout === "grid"}
            quiet
            icon="ClassicGridView"
          />
          <ActionButton
            on:click={() => (layout = "table")}
            selected={layout === "table"}
            quiet
            icon="ViewRow"
          />
        </ActionGroup>
      </div>
      <div
        class:appGrid={layout === "grid"}
        class:appTable={layout === "table"}
      >
        {#each enrichedApps as app (app.appId)}
          <svelte:component
            this={layout === "grid" ? AppCard : AppRow}
            {releaseLock}
            {app}
            {unpublishApp}
            {viewApp}
            {editApp}
            {exportApp}
            {deleteApp}
            {updateApp}
          />
        {/each}
      </div>
    </Layout>
  {/if}
  {#if !enrichedApps.length && !creatingApp && loaded}
    <div class="empty-wrapper">
      <Modal inline>
        <ModalContent
          title="Create your first app"
          confirmText="Create app"
          showCancelButton={false}
          showCloseIcon={false}
          onConfirm={initiateAppCreation}
          size="M"
        >
          <div slot="footer">
            <Button on:click={initiateAppImport} secondary>Import app</Button>
          </div>
          <Body size="S">
            The purpose of the Budibase builder is to help you build beautiful,
            powerful applications quickly and easily.
          </Body>
        </ModalContent>
      </Modal>
    </div>
  {/if}
</Page>
<Modal
  bind:this={creationModal}
  padding={false}
  width="600px"
  on:hide={stopAppCreation}
>
  <CreateAppModal {template} />
</Modal>
<ConfirmDialog
  bind:this={deletionModal}
  title="Confirm deletion"
  okText="Delete app"
  onOk={confirmDeleteApp}
>
  Are you sure you want to delete the app <b>{selectedApp?.name}</b>?
</ConfirmDialog>
<ConfirmDialog
  bind:this={unpublishModal}
  title="Confirm unpublish"
  okText="Unpublish app"
  onOk={confirmUnpublishApp}
>
  Are you sure you want to unpublish the app <b>{selectedApp?.name}</b>?
</ConfirmDialog>

<UpdateAppModal app={selectedApp} bind:this={updatingModal} />

<style>
  .title,
  .filter {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }

  .select {
    width: 190px;
  }

  .appGrid {
    display: grid;
    grid-gap: 50px;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  }
  .appTable {
    display: grid;
    grid-template-rows: auto;
    grid-template-columns: 1fr 1fr 1fr 1fr auto;
    align-items: center;
  }
  .appTable :global(> div) {
    height: 70px;
    display: grid;
    align-items: center;
    grid-gap: var(--spacing-xl);
    grid-template-columns: auto 1fr;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    padding: 0 var(--spacing-s);
  }
  .appTable :global(> div) {
    border-bottom: var(--border-light);
  }
  .empty-wrapper {
    flex: 1 1 auto;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  @media (max-width: 640px) {
    .appTable {
      grid-template-columns: 1fr auto;
    }
  }
</style>
