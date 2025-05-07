<script lang="ts">
  import EditableIcon from "@/components/common/EditableIcon.svelte"
  import { projectAppStore } from "@/stores/builder"
  import { Input, keepOpen, Label, ModalContent } from "@budibase/bbui"
  import type { ProjectApp } from "@budibase/types"
  import type { ZodType } from "zod"
  import { z } from "zod"

  export let projectApp: ProjectApp | null = null

  let errors: Partial<Record<keyof ProjectApp, string>> = {}

  $: isNew = !projectApp

  let data: ProjectApp
  $: data = projectApp ?? {
    name: "",
    urlPrefix: "",
    icon: "",
    iconColor: "",
  }

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
      urlPrefix: requiredString("Url prefix is required."),
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

  async function onConfirm() {
    const validationResult = validateProjectApp(data)
    if (validationResult.error) {
      return keepOpen
    }

    const { data: projectAppData } = validationResult

    await projectAppStore.add(projectAppData)
  }
</script>

<ModalContent {title} {onConfirm}>
  <Input label="App Name" bind:value={data.name} error={errors.name} />
  <Input
    label="Project url"
    bind:value={data.urlPrefix}
    error={errors.urlPrefix}
  />

  <Label size="L">Icon</Label>
  <EditableIcon bind:name={data.icon} bind:color={data.iconColor} />
</ModalContent>
