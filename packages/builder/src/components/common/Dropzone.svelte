<script>
  import { Heading, Body } from "@budibase/bbui"
  import api from "builderStore/api"
  import { fade } from "svelte/transition"

  export let files = []

  let selectedImage = files[0]

  function fetchPresignedUrl() {
    console.log("Fetching the presigned URL")
  }

  // async function uploadFiles() {
  //   let formData = new FormData()
  //   const uploadMeta = await fetchPresignedUrl()
  //   const { file, url } = await uploadMeta.json()

  //   formData.append("acl", "public-read")
  //   formData.append("Content-Type", file.type)
  //   formData.append("file", file)

  //   try {
  //     await api.post(url, {
  //       body: formData,
  //       headers: {
  //         "Content-Type": "multipart/form-data",
  //       },
  //     })
  //   } catch (err) {
  //     console.error(`Error uploading file: ${file}`, err)
  //   }
  // }

  async function processFiles(evt) {
    const filesToProcess = Array.from(evt.target.files).map(
      ({ name, path, size }) => ({ name, path, size })
    )

    const response = await api.post(`/api/files/process`, {
      files: filesToProcess,
    })
    const processedFiles = await response.json()
    files = [...files, ...processedFiles]
  }
</script>

<!-- TODO: Show the images that are already there, provide an upload button below them -->
<div class="dropzone">
  <ul>
    <Heading small black>Processed Files</Heading>
    {#if selectedImage}
      <li in:fade>
        <img src={selectedImage.clientUrl} />
        <div class="file-info">
          <i class="ri-file-line file-icon" />
          <Body medium white>{selectedImage.name}</Body>
          <Body medium white>{selectedImage.size / 1000}KB</Body>
        </div>
      </li>
    {/if}
  </ul>
  <Heading small black>Upload</Heading>
  <i class="ri-folder-upload-line" />
  <input type="file" multiple on:change={processFiles} />
</div>

<style>
  .dropzone {
    padding: var(--spacing-l);
    border: 2px dashed var(--blue);
    text-align: center;
    display: flex;
    align-items: center;
    flex-direction: column;
    border-radius: 10px;
  }

  li {
    position: relative;
  }

  img {
    border-radius: 10px;
    width: 100%;
    height: 100%;
    box-shadow: 0 5px 12px rgba(0, 0, 0, 0.15);
  }

  i {
    font-size: 4em;
  }

  .file-icon {
    font-size: 2.5em;
    color: var(--white);
  }

  .file-info {
    position: absolute;
    top: 7px;
    left: 7px;
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 200px;
    text-overflow: ellipsis;
  }

  ul {
    padding: 0;
    display: grid;
    grid-gap: 5px;
    list-style-type: none;
  }
</style>
