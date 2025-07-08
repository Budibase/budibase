<script lang="ts">
  import {
    Body,
    Button,
    File as FileComponent,
    Heading,
    ModalContent,
    notifications,
    ProgressCircle,
  } from "@budibase/bbui"
  import { groups } from "@/stores/portal"
  import { type BulkAddUsersToGroupResponse } from "@budibase/types"

  export let groupId
  export let onUsersAdded

  let selectedFile: File | undefined = undefined
  let uploadLoading = false
  let results: BulkAddUsersToGroupResponse | undefined = undefined

  const handleFilesSelected = (event: CustomEvent<File>) => {
    selectedFile = event.detail || undefined
    results = undefined
  }

  const processCSV = async () => {
    if (!selectedFile) {
      notifications.error("Please select a CSV file")
      return
    }

    const file = selectedFile
    if (!file.name.toLowerCase().endsWith(".csv")) {
      notifications.error("Please select a CSV file")
      return
    }

    uploadLoading = true
    try {
      // Read file content
      const text = await file.text()

      // Call the API
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
    selectedFile = undefined
    results = undefined
  }
</script>

<ModalContent
  title="Bulk Add Users via CSV"
  confirmText="Upload CSV"
  onConfirm={processCSV}
  disabled={uploadLoading || !selectedFile}
  size="M"
  cancelText="Close"
>
  <div slot="header">
    <Heading size="M">Bulk Add Users via CSV</Heading>
    <Body>
      Upload a CSV file containing email addresses to add existing users to this
      group.
    </Body>
  </div>

  <div class="content">
    {#if !results}
      <div class="upload-section">
        <Body>
          Select a CSV file that contains an "email" column with user email
          addresses. Only existing users will be added to the group.
        </Body>

        <FileComponent
          on:change={handleFilesSelected}
          title="Select CSV File"
          extensions={["csv"]}
          value={selectedFile}
          disabled={uploadLoading}
        />
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
            <Body weight="600">Skipped ({results.skipped.length} entries):</Body
            >
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
  </div>
</ModalContent>

<style>
  .content {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-l);
    min-height: 200px;
  }

  .upload-section {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-m);
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
