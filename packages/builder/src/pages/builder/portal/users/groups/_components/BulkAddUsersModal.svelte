<script lang="ts">
  import {
    Body,
    Button,
    Heading,
    ModalContent,
    notifications,
    ProgressCircle,
  } from "@budibase/bbui"
  import { groups } from "@/stores/portal"
  import { type BulkAddUsersToGroupResponse } from "@budibase/types"

  export let groupId
  export let onUsersAdded

  let files: File[] = []
  let uploadLoading = false
  let results: BulkAddUsersToGroupResponse | undefined = undefined

  const handleFile = (evt: Event) => {
    const target = evt.target as HTMLInputElement
    const fileArray = Array.from(target.files || [])

    if (fileArray.length === 0) {
      return
    }

    files = fileArray
    results = undefined
  }

  const processCSV = async () => {
    if (!files[0]) {
      notifications.error("Please select a CSV file")
      return
    }

    const file = files[0]
    if (!file.name.toLowerCase().endsWith(".csv")) {
      notifications.error("Please select a CSV file")
      return
    }

    uploadLoading = true
    try {
      const text = await file.text()

      const result = await groups.bulkAddUsersFromCsv(groupId, text)

      results = result

      if (result.added.length > 0) {
        notifications.success(
          `Successfully added ${result.added.length} users to the group`
        )
        if (onUsersAdded) {
          onUsersAdded()
        }
      } else {
        notifications.info("No users were added to the group")
      }
    } catch (error: any) {
      notifications.error(error?.message || "Failed to process CSV file")
    } finally {
      uploadLoading = false
    }
  }

  const reset = () => {
    files = []
    results = undefined
  }
</script>

<ModalContent
  size="M"
  title="Bulk assign users"
  confirmText="Upload CSV"
  cancelText="Cancel"
  showCloseIcon={false}
  onConfirm={processCSV}
  disabled={uploadLoading || !files[0]}
>
  <Body size="S"
    >Upload a CSV file containing email addresses to add existing users to this
    group</Body
  >

  {#if !results}
    <div class="dropzone">
      <input
        id="file-upload"
        accept=".csv"
        type="file"
        on:change={handleFile}
      />
      <label for="file-upload" class:uploaded={files[0]}>
        {#if files[0]}{files[0].name}{:else}Upload{/if}
      </label>
    </div>
  {:else}
    <div class="results-section">
      <Heading size="S">Upload Results</Heading>

      {#if results.added.length > 0}
        <div class="result-group">
          <Body weight="600">Added ({results.added.length} users):</Body>
          <div class="result-list">
            {#each results.added as user}
              <Body size="S">• {user.email}</Body>
            {/each}
          </div>
        </div>
      {/if}

      {#if results.skipped.length > 0}
        <div class="result-group">
          <Body weight="600">Skipped ({results.skipped.length} entries):</Body>
          <div class="result-list">
            {#each results.skipped as skipped}
              <Body size="S">• {skipped.email} - {skipped.reason}</Body>
            {/each}
          </div>
        </div>
      {/if}

      <Button secondary on:click={reset}>Upload Another File</Button>
    </div>
  {/if}

  {#if uploadLoading}
    <div class="loading">
      <ProgressCircle />
      <Body>Processing CSV file...</Body>
    </div>
  {/if}
</ModalContent>

<style>
  .dropzone {
    text-align: center;
    display: flex;
    align-items: center;
    flex-direction: column;
    border-radius: 10px;
    transition: all 0.3s;
  }

  .uploaded {
    color: var(--blue);
  }

  label {
    font-weight: 600;
    box-sizing: border-box;
    overflow: hidden;
    border-radius: var(--border-radius-s);
    color: var(--ink);
    padding: var(--spacing-m) var(--spacing-l);
    display: inline-flex;
    text-rendering: optimizeLegibility;
    min-width: auto;
    outline: none;
    font-feature-settings:
      "case" 1,
      "rlig" 1,
      "calt" 0;
    -webkit-box-align: center;
    user-select: none;
    flex-shrink: 0;
    align-items: center;
    justify-content: center;
    width: 100%;
    background: var(--spectrum-global-color-gray-200);
    font-size: 12px;
    line-height: normal;
    border: var(--border-transparent);
    transition: background-color 130ms ease-out;
  }

  label:hover {
    background: var(--spectrum-global-color-gray-300);
    cursor: pointer;
  }

  input[type="file"] {
    display: none;
  }

  .results-section {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-m);
  }

  .result-group {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-s);
  }

  .result-list {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xs);
    padding-left: var(--spacing-m);
    max-height: 200px;
    overflow-y: auto;
  }

  .loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--spacing-m);
    padding: var(--spacing-xl);
  }
</style>
