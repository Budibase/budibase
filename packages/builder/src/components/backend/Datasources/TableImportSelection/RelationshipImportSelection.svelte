<script lang="ts">
  import {
    Body,
    FancyCheckboxGroup,
    InlineAlert,
    Layout,
    ModalContent,
  } from "@budibase/bbui"
  import Spinner from "@/components/common/Spinner.svelte"
  import { createRelationshipSelectionStore } from "./relationshipSelectionStore"
  import type {
    Datasource,
    DatasourceRelationshipConfig,
  } from "@budibase/types"

  export let datasource: Datasource
  export let onComplete: () => void = () => {}

  const store = createRelationshipSelectionStore(datasource)

  function convertLabelsToRelationships(
    selectedLabels: string[]
  ): DatasourceRelationshipConfig[] {
    const selectedIds = selectedLabels
      .map(label => {
        const option = $store.relationshipOptions.find(
          opt => opt.label === label
        )
        return option ? option.id : null
      })
      .filter((id): id is string => !!id)
    return $store.relationships.filter(rel => selectedIds.includes(rel._id))
  }

  const title = "Choose your relationships"
  const description = "Choose what relationships you want to sync with Budibase"
  const selectAllText = "Select all"

  $: confirmText =
    $store.loading || $store.hasSelected
      ? "Import relationships"
      : "Continue without fetching"
</script>

<ModalContent
  {title}
  cancelText="Cancel"
  size="L"
  {confirmText}
  onConfirm={() => store.importSelectedRelationships(onComplete)}
  disabled={$store.loading}
>
  {#if $store.loading}
    <div class="loading">
      <Spinner size="20" />
    </div>
  {:else}
    <Layout noPadding>
      <Body size="S">{description}</Body>

      <div class="checkbox-container">
        <FancyCheckboxGroup
          options={$store.relationshipOptions.map(opt => opt.label)}
          selected={$store.selectedRelationshipIds.map(id => {
            const option = $store.relationshipOptions.find(opt => opt.id === id)
            return option ? option.label : id
          })}
          on:change={e => {
            const selectedRelationships = convertLabelsToRelationships(e.detail)
            store.setSelectedRelationships(selectedRelationships)
          }}
          {selectAllText}
        />
      </div>
      {#if $store.error}
        <InlineAlert
          type="error"
          header="Error fetching relationships"
          message={$store.error.message}
        />
      {/if}
    </Layout>
  {/if}
</ModalContent>

<style>
  .loading {
    display: flex;
    justify-content: center;
  }

  .checkbox-container {
    max-height: 300px;
    overflow-y: auto;
  }
</style>
