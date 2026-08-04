<script lang="ts">
  import kebabCase from "lodash/kebabCase"
  import {
    Body,
    Dropzone,
    Input,
    keepOpen,
    Layout,
    ModalContent,
    notifications,
    TextArea,
  } from "@budibase/bbui"
  import type { RestTemplate, UIFile } from "@budibase/types"
  import { restTemplates } from "@/stores/builder/restTemplates"

  export let onUploaded: ((_template: RestTemplate) => void) | undefined =
    undefined
  export let onCancel: (() => void) | undefined = undefined

  let name = ""
  let description = ""
  let file: File | undefined
  let fileError: string | undefined
  let nameError: string | undefined

  $: disabled = !name.trim() || !file

  const handleFileChange = (
    event: CustomEvent<Array<UIFile | File | undefined>>
  ) => {
    const [nextFile] = event.detail
    file = nextFile instanceof File ? nextFile : undefined
    fileError = undefined
  }

  const handleTooManyFiles = () => {
    fileError = "Choose one OpenAPI schema."
  }

  const upload = async () => {
    if (!file || disabled) {
      return keepOpen
    }

    const extension = file.name.split(".").pop()?.toLowerCase()
    if (!extension || !["json", "yaml", "yml"].includes(extension)) {
      fileError = "Choose a JSON or YAML file."
      return keepOpen
    }

    const nameSlug = kebabCase(name)
    if (!nameSlug) {
      nameError = "Name must contain letters or numbers."
      return keepOpen
    }
    if (
      restTemplates.templates.some(
        template => template.custom && kebabCase(template.name) === nameSlug
      )
    ) {
      nameError = "A custom template with this name already exists."
      return keepOpen
    }

    try {
      const template = await restTemplates.uploadCustom({
        name: name.trim(),
        description: description.trim(),
        file,
      })
      notifications.success(`${template.name} template imported`)
      onUploaded?.(template)
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error"
      notifications.error(`Error importing template - ${message}`)
      return keepOpen
    }
  }
</script>

<ModalContent
  title="Import OpenAPI template"
  confirmText="Upload"
  size="M"
  {disabled}
  {onCancel}
  onConfirm={upload}
>
  <Body size="S">
    Upload an OpenAPI 2.0 or 3.0 schema to reuse it when creating REST API
    connections.
  </Body>

  <Layout noPadding gap="S">
    <Input
      label="Name"
      placeholder="Template name"
      error={nameError}
      bind:value={name}
      on:change={() => (nameError = undefined)}
    />
    <TextArea
      label="Description"
      placeholder="Describe this API"
      bind:value={description}
    />
    <Dropzone
      gallery={false}
      label="OpenAPI schema"
      fileTags={["JSON", "YAML"]}
      maximum={1}
      error={fileError}
      {handleTooManyFiles}
      on:change={handleFileChange}
    />
  </Layout>
</ModalContent>
