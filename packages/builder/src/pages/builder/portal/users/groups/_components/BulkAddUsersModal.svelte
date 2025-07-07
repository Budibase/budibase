<script>
  import {
    Body,
    Button,
    File,
    Heading,
    ModalContent,
    notifications,
    ProgressCircle,
  } from "@budibase/bbui"
  import { groups } from "@/stores/portal"

  export let groupId
  export let onUsersAdded

  let selectedFiles = []
  let uploadLoading = false
  let results = null

  const handleFilesSelected = event => {
    selectedFiles = Array.from(event.detail || [])
    results = null
  }

  const processCSV = async () => {
    if (!selectedFiles.length) {
      notifications.error("Please select a CSV file")
      return
    }

    const file = selectedFiles[0]
    if (!file.name.toLowerCase().endsWith('.csv')) {
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
        notifications.success(`Successfully added ${result.added.length} users to the group`)
        if (onUsersAdded) {
          onUsersAdded()
        }
      } else {
        notifications.info("No users were added to the group")
      }
    } catch (error) {
      notifications.error(error?.message || "Failed to process CSV file")
    } finally {
      uploadLoading = false
    }
  }

  const reset = () => {
    selectedFiles = []
    results = null
  }
</script>

<ModalContent
  title="Bulk Add Users via CSV"
  confirmText="Upload CSV"
  onConfirm={processCSV}
  disabled={uploadLoading || !selectedFiles.length}
  size="M"
  cancelText="Close"
>
  <div slot="header">
    <Heading size="M">Bulk Add Users via CSV</Heading>
    <Body>
      Upload a CSV file containing email addresses to add existing users to this group.
    </Body>
  </div>

  <div class="content">
    {#if !results}
      <div class="upload-section">
        <Body>
          Select a CSV file that contains an "email" column with user email addresses. 
          Only existing users will be added to the group.
        </Body>
        
        <File
          on:change={handleFilesSelected}
          value={selectedFiles}
          accept=".csv"
          multiple={false}
          placeholder="Choose CSV file"
          disabled={uploadLoading}
        />

        {#if selectedFiles.length > 0}
          <Body size="S" textAlign="center">
            Selected: {selectedFiles[0].name}
          </Body>
        {/if}
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