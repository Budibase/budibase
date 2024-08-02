<script>
  import {
    Heading,
    Layout,
    Body,
    Page,
    Button,
    notifications,
    Table,
    Divider,
  } from "@budibase/bbui"
  import { onMount } from "svelte"
  import { API } from "api"
  import FileSizeRenderer from "./_components/FileSizeRenderer.svelte"
  import DeleteMediaRenderer from "./_components/DeleteMediaRenderer.svelte"

  const customRenderers = [
    { column: "size", component: FileSizeRenderer },
    { column: "edit", component: DeleteMediaRenderer },
  ]

  let media = []
  let saving
  let uploadFile = null
  let fileInput
  let mediaSchema = {
    name: {
      type: "string",
      constraints: {
        type: "string",
        length: {
          maximum: null,
        },
        presence: false,
      },
      name: "File",
    },
    size: {
      type: "number",
      constraints: {
        type: "number",
        length: {
          maximum: null,
        },
        presence: false,
      },
      name: "Size",
    },
    private: {
      type: "boolean",
      constraints: {
        type: "boolean",
        presence: false,
      },
      name: "Size",
    },
    edit: {
      width: "auto",
      borderLeft: true,
      displayName: "",
    },
  }

  // TODO Need to alter the store structure.
  $: parsed = media.map(obj => {
    return {
      ...obj,
      size: bytesToString(obj.size),
    }
  })

  $: inputAccept = "*"

  const fetchTenantMedia = async () => {
    try {
      const resp = await API.fetchTenantMedia()
      media = resp.assets
    } catch (e) {
      console.error(e)
    }
  }

  const uploadMedia = async () => {
    saving = true
    let data = new FormData()
    data.append("file", uploadFile)
    try {
      await API.uploadTentantMedia({ data })
      notifications.success("Media uploaded successfully")
    } catch (e) {
      console.error(e)
      return
    } finally {
      uploadFile = null
      fileInput.value = null
      saving = false
    }
    await fetchTenantMedia()
  }

  // Need consts or a general UTIL across the app.
  const bytesToString = bytes => {
    if (bytes <= 1000000) {
      return `${(bytes / 1000).toFixed(1)} KB`
    } else {
      return `${(bytes / 1000000).toFixed(1)} MB`
    }
  }

  const openDialog = () => {
    fileInput.click()
  }

  const handleFile = e => {
    uploadFile = e.target.files[0]
  }

  onMount(async () => {
    fetchTenantMedia()
  })
</script>

<Page narrow>
  <Layout gap="S" noPadding>
    <Layout gap="XS" noPadding>
      <Heading size="M">Media</Heading>
      <Body>Manage your global media resources!</Body>
    </Layout>
    <Divider />
    <Layout gap="S" noPadding>
      <div class="upload-wrap">
        <input
          type="file"
          class="file-input"
          accept={inputAccept}
          bind:this={fileInput}
          on:change={handleFile}
        />
        <span class="button-wrap">
          {#if !uploadFile}
            <Button on:click={openDialog} disabled={saving}>Choose file</Button>
          {:else}
            <Button on:click={uploadMedia} disabled={saving}>
              Upload {uploadFile.name}
            </Button>
          {/if}
        </span>
      </div>
      <Table
        schema={mediaSchema}
        allowSelectRows={false}
        allowEditColumns={false}
        allowEditRows={false}
        data={parsed}
        placeholderText="No files found"
        border={false}
        {customRenderers}
        on:buttonclick={async () => {
          try {
            const resp = await API.fetchTenantMedia()
            media = resp.assets
          } catch (e) {
            console.error(e)
          }
        }}
      />
    </Layout>
  </Layout>
</Page>

<style>
  .file-input {
    opacity: 0;
    pointer-events: none;
  }
  .button-wrap {
    max-width: 200px;
  }
  .upload-wrap {
    max-width: 100%;
    width: 100%;
    text-align: right;
  }
</style>
