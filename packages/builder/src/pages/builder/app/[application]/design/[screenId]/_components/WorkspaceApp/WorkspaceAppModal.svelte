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

  let data: WorkspaceApp
  let iconColor: string

  $: isNew = !workspaceApp

  $: title = isNew ? "Create new app" : "Edit app"

  const requiredString = (errorMessage: string) =>
    z.string({ required_error: errorMessage }).trim().min(1, errorMessage)

  let validationState: {
    errors: Partial<Record<keyof WorkspaceApp, string>>
    touched: Partial<Record<keyof WorkspaceApp, boolean>>
  }

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
        .regex(/^\/[\w-]*$/, {
          message:
            "Url prefix must start with a slash and can only contain alphanumeric characters, hyphens, and underscores.",
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
    validationState.errors = {}
    if (!validationResult.success) {
      validationState.errors = Object.entries(
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
    validationState = { errors: {}, touched: {} }
    iconColor = workspaceApp?.iconColor ?? ""
  }

  async function onConfirm() {
    const validationResult = validateWorkspaceApp({
      ...data,
      iconColor: iconColor || undefined,
    })
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

  $: if (isNew && data?.name && !validationState.touched.urlPrefix) {
    data.urlPrefix = `/${data.name.toLowerCase().replace(/\s+/g, "-")}`
  }
</script>

<Modal bind:this={modal} on:show={onShow} on:hide>
  <ModalContent {title} {onConfirm}>
    <Input
      label="App Name"
      on:enterkey={onEnterKey}
      on:focus={() => {
        validationState.touched.name = true
        delete validationState.errors.name
      }}
      bind:value={data.name}
      error={validationState.errors.name}
    />
    <Input
      label="Base url"
      on:enterkey={onEnterKey}
      on:focus={() => {
        validationState.touched.urlPrefix = true
        delete validationState.errors.urlPrefix
      }}
      bind:value={data.urlPrefix}
      error={validationState.errors.urlPrefix}
    />

    <Label size="L">Icon</Label>
    <EditableIcon bind:name={data.icon} bind:color={iconColor} />
  </ModalContent>
</Modal>
