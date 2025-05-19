<script lang="ts">
  import EditableIcon from "@/components/common/EditableIcon.svelte"
  import { workspaceAppStore } from "@/stores/builder"
  import {
    Input,
    keepOpen,
    Label,
    Modal,
    ModalContent,
    notifications,
  } from "@budibase/bbui"
  import type { WorkspaceApp } from "@budibase/types"
  import type { ZodType } from "zod"
  import { z } from "zod"

  export let workspaceApp: WorkspaceApp | null = null

  let modal: Modal
  export const show = () => modal.show()

  let errors: Partial<Record<keyof WorkspaceApp, string>> = {}
  let data: WorkspaceApp

  $: isNew = !workspaceApp

  $: title = isNew ? "Create new app" : "Edit app"

  const requiredString = (errorMessage: string) =>
    z.string({ required_error: errorMessage }).trim().min(1, errorMessage)

  const validateWorkspaceApp = (workspaceApp: Partial<WorkspaceApp>) => {
    const validator = z.object({
      name: requiredString("Name is required.").refine(
        val =>
          !$workspaceAppStore.workspaceApps
            .filter(a => a._id !== workspaceApp._id)
            .map(a => a.name.toLowerCase())
            .includes(val.toLowerCase()),
        {
          message: "This name is already taken.",
        }
      ),
      urlPrefix: requiredString("Url prefix is required.")
        .regex(/^\/\w*$/, {
          message:
            "Url must start with / and contain only alphanumeric characters.",
        })
        .refine(
          val =>
            !$workspaceAppStore.workspaceApps
              .filter(a => a._id !== workspaceApp._id)
              .map(a => a.urlPrefix.toLowerCase())
              .includes(val.toLowerCase()),
          {
            message: "This url is already taken.",
          }
        ),
      icon: z.string(),
      iconColor: z.string().optional(),
    }) satisfies ZodType<WorkspaceApp>

    const validationResult = validator.safeParse(workspaceApp)
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
      _id: workspaceApp?._id,
      _rev: workspaceApp?._rev,
      name: workspaceApp?.name ?? "",
      urlPrefix: workspaceApp?.urlPrefix ?? "",
      icon: workspaceApp?.icon ?? "Monitoring",
      iconColor: workspaceApp?.iconColor,
    }
  }

  async function onConfirm() {
    const validationResult = validateWorkspaceApp(data)
    if (validationResult.error) {
      return keepOpen
    }

    const { data: workspaceAppData } = validationResult

    try {
      if (isNew) {
        await workspaceAppStore.add(workspaceAppData)

        notifications.success("App created successfully")
      } else {
        await workspaceAppStore.edit({
          ...workspaceAppData,
          _id: workspaceApp!._id!,
          _rev: workspaceApp!._rev!,
        })
        notifications.success("App updated successfully")
      }
    } catch (e: any) {
      console.error("Error saving app", e)
      notifications.error(`Error saving app: ${e.message}`)
    }
  }

  async function onEnterKey() {
    const result = await onConfirm()
    if (result === keepOpen) {
      return result
    }

    modal.hide()
  }

  $: {
    if (data && !data.urlPrefix.startsWith("/")) {
      data.urlPrefix = `/${data.urlPrefix}`
    }
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
    <EditableIcon
      bind:name={data.icon}
      color={data.iconColor || ""}
      on:change={e => {
        data.iconColor = e.detail
      }}
    />
  </ModalContent>
</Modal>
