<script lang="ts">
  import EditableIcon from "@/components/common/EditableIcon.svelte"
  import { projectAppStore } from "@/stores/builder"
  import { Input, keepOpen, Label, Modal, ModalContent } from "@budibase/bbui"
  import type { ProjectApp } from "@budibase/types"
  import type { ZodType } from "zod"
  import { z } from "zod"

  export let projectApp: ProjectApp | null = null

  let modal: Modal
  export const show = () => modal.show()

  let errors: Partial<Record<keyof ProjectApp, string>> = {}
  let data: ProjectApp

  $: isNew = !projectApp

  $: title = isNew ? "Create new app" : "Edit app"

  const requiredString = (errorMessage: string) =>
    z.string({ required_error: errorMessage }).trim().min(1, errorMessage)

  const validateProjectApp = (projectApp: Partial<ProjectApp>) => {
    const validator = z.object({
      name: requiredString("Name is required.").refine(
        val =>
          !$projectAppStore.projectApps
            .filter(a => a._id !== projectApp._id)
            .map(a => a.name.toLowerCase())
            .includes(val.toLowerCase()),
        {
          message: "This name is already taken.",
        }
      ),
      urlPrefix: requiredString("Url prefix is required.")
        .regex(/^\/\w+$/, {
          message:
            "Url must start with / and contain only alphanumeric characters.",
        })
        .refine(
          val =>
            !$projectAppStore.projectApps
              .filter(a => a._id !== projectApp._id)
              .map(a => a.urlPrefix.toLowerCase())
              .includes(val.toLowerCase()),
          {
            message: "This url is already taken.",
          }
        ),
      icon: z.string(),
      iconColor: z.string(),
    }) satisfies ZodType<ProjectApp>

    const validationResult = validator.safeParse(projectApp)
    errors = {}
    if (!validationResult.success) {
      errors = Object.entries(
        validationResult.error.formErrors.fieldErrors
      ).reduce<Record<string, string>>((acc, [field, errors]) => {
        if (errors[0]) {
          acc[field] = errors[0]
        }
        return acc
      }, {})
    }

    return validationResult
  }

  function onShow() {
    data = {
      _id: projectApp?._id,
      _rev: projectApp?._rev,
      name: projectApp?.name ?? "",
      urlPrefix: projectApp?.urlPrefix ?? "",
      icon: projectApp?.icon ?? "Monitoring",
      iconColor: projectApp?.iconColor ?? "",
    }
  }

  async function onConfirm() {
    const validationResult = validateProjectApp(data)
    if (validationResult.error) {
      return keepOpen
    }

    const { data: projectAppData } = validationResult

    if (isNew) {
      await projectAppStore.add(projectAppData)
    } else {
      await projectAppStore.edit({
        ...projectAppData,
        _id: projectApp!._id,
        _rev: projectApp!._rev,
      })
    }
  }

  async function onEnterKey() {
    const result = await onConfirm()
    if (result === keepOpen) {
      return result
    }

    modal.hide()
  }
</script>

<Modal bind:this={modal} on:show={onShow} on:hide>
  <ModalContent {title} {onConfirm}>
    <Input
      label="App Name"
      on:enterkey={onEnterKey}
      bind:value={data.name}
      error={errors.name}
    />
    <Input
      label="Project url"
      on:enterkey={onEnterKey}
      bind:value={data.urlPrefix}
      error={errors.urlPrefix}
    />

    <Label size="L">Icon</Label>
    <EditableIcon bind:name={data.icon} bind:color={data.iconColor} />
  </ModalContent>
</Modal>
