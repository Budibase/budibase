<script>
  import { getContext } from "svelte"
  import { Body, Heading, Detail } from "@budibase/bbui"

  const textTypes = [
    "string",
    "longform",
    "options",
    "array",
    "boolean",
    "number",
    "formula",
    "datetime",
    "barcodeqr",
  ]
  const videoExtensions = ["mp4"]
  const audioExtensions = ["mp3"]
  const imageExtensions = ["jpeg", "jpg", "png"]
  const { styleable } = getContext("sdk")
  const component = getContext("component")

  export let repeater
  export let noDataMessage
  export let heading

  $: ({ schema, ...row } = repeater || {})
  $: columns = formatColumns(row, schema)

  const formatAttachment = (extension, url) => {
    if (videoExtensions.includes(extension)) {
      return { displayType: "video", url }
    }
    if (audioExtensions.includes(extension)) {
      return { displayType: "audio", url }
    }
    if (imageExtensions.includes(extension)) {
      return { displayType: "image", url }
    }
    return { displayType: "other", url }
  }

  const formatColumn = (name, type, value) => {
    if (value == null || value == "") {
      return { name, displayType: "text", value: "null" }
    }
    if (textTypes.includes(type)) {
      return { name, displayType: "text", value }
    }
    if (type === "json") {
      return {
        name,
        displayType: "json",
        value: JSON.stringify(value ?? {}, null, 2),
      }
    }
    if (type === "link") {
      return {
        name,
        displayType: "text",
        value: value?.[0]?.primaryDisplay || "null",
      }
    }
    if (type === "attachment") {
      return {
        name,
        displayType: "attachment",
        value: value.map(({ extension, url }) =>
          formatAttachment(extension, url)
        ),
      }
    }

    return { name, displayType: "text", value }
  }

  const formatColumns = (row, schema) => {
    if (!row || !schema) return []
    const data = []

    Object.entries(schema).forEach(([key, value]) => {
      data.push(formatColumn(key, value.type, row[key]))
    })

    return data
  }
</script>

<div use:styleable={$component.styles} class="container">
  {#if columns}
    {#if heading}
      <div class="heading">
        <Heading>{heading}</Heading>
      </div>
    {/if}
    {#each columns as column}
      <div class="columnName">
        <Detail>{column.name}</Detail>
      </div>
      <div class="columnData">
        {#if column.displayType === "json"}
          <textarea readonly disabled class="jsonViewer"
            >{column.value}</textarea
          >
        {:else if column.displayType === "attachment"}
          <div class="attachment">
            {#each column.value as attachment}
              {#if attachment.displayType === "video"}
                <video
                  alt="attached video"
                  controls
                  class="video"
                  src={attachment.url}
                />
              {:else if attachment.displayType === "audio"}
                <audio controls class="audio" src={attachment.url} />
              {:else if attachment.displayType === "image"}
                <a href={attachment.url} target="_blank" class="imageLink">
                  <img
                    alt="attached image"
                    class="image"
                    src={attachment.url}
                  />
                </a>
              {:else}
                <Body>{attachment.url}</Body>
              {/if}
            {/each}
          </div>
        {:else}
          <Body>{column.value}</Body>
        {/if}
      </div>
    {/each}
  {:else if noDataMessage}
    <div class="noRows"><i class="ri-list-check-2" />{noDataMessage}</div>
  {:else}
    <p>Something went wrong</p>
  {/if}
</div>

<style>
  .jsonViewer {
    width: 100%;
    max-width: 100%;
  }
  .container {
    padding: 20px 30px;
    background-color: white;
  }
  .heading {
    margin-bottom: 25px;
  }
  .attachment {
    display: flex;
    width: 100%;
    flex-direction: column;
  }
  .video {
    max-width: 100%;
    margin-bottom: 10px;
  }
  .audio {
    max-width: 100%;
    margin-bottom: 10px;
  }
  .imageLink {
  }
  .image {
    max-width: 100%;
    margin-bottom: 10px;
  }
  .columnName {
    display: block;
  }
  .columnData {
    display: block;
    margin-bottom: 10px;
  }
  .noRows {
    color: var(--spectrum-global-color-gray-600);
    font-size: var(--font-size-s);
    padding: var(--spacing-l);
    display: grid;
    place-items: center;
    grid-column: 1 / -1;
  }
  .noRows i {
    margin-bottom: var(--spacing-m);
    font-size: 1.5rem;
    color: var(--spectrum-global-color-gray-600);
  }
</style>
