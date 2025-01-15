<script>
  import Field from "./Field.svelte"
  import { CoreDropzone, ProgressCircle, Helpers } from "@budibase/bbui"
  import { getContext, onMount, onDestroy } from "svelte"
  import { builderStore } from "stores/builder.js"
  import { processStringSync } from "@budibase/string-templates"

  export let datasourceId
  export let bucket
  export let key
  export let field
  export let label
  export let disabled = false
  export let validation
  export let onChange

  const context = getContext("context")

  let fieldState
  let fieldApi
  let localFiles = []

  $: {
    // If the field state is reset, clear the local files
    if (!fieldState?.value?.length) {
      localFiles = []
    }
  }

  const { API, notificationStore, uploadStore } = getContext("sdk")
  const component = getContext("component")

  // 5GB cap per item sent via S3 REST API
  const MaxFileSize = 1000000000 * 5

  // Actual file data to upload
  let data
  let loading = false

  const handleFileTooLarge = () => {
    notificationStore.actions.warning(
      "Files cannot exceed 5GB. Please try again with a smaller file."
    )
  }

  // Process the file input and return a serializable structure expected by
  // the dropzone component to display the file
  const processFiles = async fileList => {
    if ($builderStore.inBuilder) {
      return []
    }
    return await new Promise(resolve => {
      if (!fileList?.length) {
        return []
      }

      // Don't read in non-image files
      data = fileList[0]
      if (!data.type?.startsWith("image")) {
        resolve([
          {
            name: data.name,
            type: data.type,
          },
        ])
      }

      // Read image files and display as preview
      const reader = new FileReader()
      reader.addEventListener(
        "load",
        () => {
          resolve([
            {
              url: reader.result,
              name: data.name,
              type: data.type,
            },
          ])
        },
        false
      )
      reader.readAsDataURL(fileList[0])
    })
  }

  const upload = async () => {
    const processedFileKey = processStringSync(key, $context)
    loading = true
    try {
      const res = await API.externalUpload(
        datasourceId,
        bucket,
        processedFileKey,
        data
      )
      notificationStore.actions.success("File uploaded successfully")
      loading = false
      return res
    } catch (error) {
      notificationStore.actions.error(
        `Error uploading file: ${error?.message || error}`
      )
      loading = false
    }
  }

  const handleChange = e => {
    localFiles = e.detail
    let files = Helpers.cloneDeep(e.detail) || []
    // remove URL as it contains the full base64 image data
    files.forEach(file => {
      if (file.type?.startsWith("image")) {
        delete file.url
      }
    })
    const changed = fieldApi.setValue(files)
    if (onChange && changed) {
      onChange({ value: files })
    }
  }

  onMount(() => {
    uploadStore.actions.registerFileUpload($component.id, upload)
  })

  onDestroy(() => {
    uploadStore.actions.unregisterFileUpload($component.id)
  })
</script>

<Field
  {label}
  {field}
  {disabled}
  {validation}
  type="s3upload"
  bind:fieldState
  bind:fieldApi
  defaultValue={[]}
>
  <div class="content" class:builder={$builderStore.inBuilder}>
    {#if fieldState}
      <CoreDropzone
        value={localFiles}
        disabled={loading || fieldState.disabled}
        error={fieldState.error}
        on:change={handleChange}
        {processFiles}
        {handleFileTooLarge}
        maximum={1}
        fileSizeLimit={MaxFileSize}
      />
    {/if}
    {#if loading}
      <div class="overlay" />
      <div class="loading">
        <ProgressCircle />
      </div>
    {/if}
  </div>
</Field>

<style>
  .content.builder :global(.spectrum-Dropzone) {
    pointer-events: none;
  }
  .content {
    position: relative;
  }
  .overlay,
  .loading {
    position: absolute;
    top: 0;
    height: 100%;
    width: 100%;
    display: grid;
    place-items: center;
  }
  .overlay {
    background-color: var(--spectrum-global-color-gray-50);
    opacity: 0.5;
  }
</style>
