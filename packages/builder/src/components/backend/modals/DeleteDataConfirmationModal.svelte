<script lang="ts">
  import { InlineAlert, Link, Input } from "@budibase/bbui"
  import { appStore } from "@/stores/builder"
  import ConfirmDialog from "@/components/common/ConfirmDialog.svelte"
  import type { Table, View, Datasource, Query } from "@budibase/types"

  export let source: Table | View | Datasource | Query | undefined
  export let type: "table" | "view" | "datasource" | "query"
  export let deleteSourceFn: () => Promise<void>

  let confirmDeleteDialog: any
  let affectedScreens: { text: string; url: string }[] = []

  let viewsMessage: string = ""
  let deleteSourceName: string | undefined

  const getViewsMessage = () => {
    if (!source || !("views" in source)) {
      return ""
    }
    const views = Object.values(source?.views ?? [])
    if (views.length < 1) {
      return ""
    }
    if (views.length === 1) {
      return ", including 1 view"
    }

    return `, including ${views.length} views`
  }

  export const show = () => {
    viewsMessage = getViewsMessage()
    // TODO: fetch information about screens affected
    confirmDeleteDialog.show()
  }

  function processScreens(
    screens: { url: string; _id: string }[]
  ): { text: string; url: string }[] {
    return screens.map(({ url, _id }) => ({
      text: url,
      url: `/builder/app/${$appStore.appId}/design/${_id}`,
    }))
  }

  function hideDeleteDialog() {
    deleteSourceName = ""
  }

  const autofillSourceName = () => {
    deleteSourceName = source?.name
  }
</script>

<ConfirmDialog
  bind:this={confirmDeleteDialog}
  okText={`Delete ${type}`}
  onOk={deleteSourceFn}
  onCancel={hideDeleteDialog}
  title="Confirm Deletion"
  disabled={deleteSourceName !== source?.name}
>
  <div class="content">
    <p class="firstWarning">
      Are you sure you wish to delete the {type}
      <span class="sourceNameLine">
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <!-- svelte-ignore a11y-no-static-element-interactions -->
        <b on:click={autofillSourceName} class="sourceName">{source?.name}</b>
        <span>?</span>
      </span>
    </p>

    <p class="secondWarning">All {type} data will be deleted{viewsMessage}.</p>
    <p class="thirdWarning">This action <b>cannot be undone</b>.</p>

    {#if affectedScreens.length > 0}
      <div class="affectedScreens">
        <InlineAlert
          header={`The following screens were originally generated from this ${type} and may no longer function as expected`}
        >
          <ul class="affectedScreensList">
            {#each affectedScreens as item}
              <li>
                <Link quiet overBackground target="_blank" href={item.url}
                  >{item.text}</Link
                >
              </li>
            {/each}
          </ul>
        </InlineAlert>
      </div>
    {/if}
    <p class="fourthWarning">
      Please enter the "<b><i>{source?.name}</i></b>" below to confirm.
    </p>
    <Input bind:value={deleteSourceName} placeholder={source?.name} />
  </div>
</ConfirmDialog>

<style>
  .content {
    margin-top: 0;
    max-width: 320px;
  }

  .firstWarning {
    margin: 0 0 12px;
    max-width: 100%;
  }

  .sourceNameLine {
    display: inline-flex;
    max-width: 100%;
    vertical-align: bottom;
  }

  .sourceName {
    flex-grow: 1;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    cursor: pointer;
  }

  .secondWarning {
    margin: 0;
    max-width: 100%;
  }

  .thirdWarning {
    margin: 0 0 12px;
    max-width: 100%;
  }

  .affectedScreens {
    margin: 18px 0;
    max-width: 100%;
    margin-bottom: 24px;
  }

  .affectedScreens :global(.spectrum-InLineAlert) {
    max-width: 100%;
  }

  .affectedScreensList {
    padding: 0;
    margin-bottom: 0;
  }

  .affectedScreensList li {
    display: block;
    max-width: 100%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    margin-top: 4px;
  }

  .fourthWarning {
    margin: 12px 0 6px;
    max-width: 100%;
  }
</style>
