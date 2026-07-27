<svelte:options runes={true} />

<script lang="ts">
  import ProjectSelect from "@/components/common/ProjectSelect.svelte"
  import { Body, ModalContent } from "@budibase/bbui"

  interface AssignableProjectResource {
    name: string
    typeLabel: string
    projectIds?: string[]
  }

  interface Props {
    resource?: AssignableProjectResource | null
    onConfirm?: (_projectIds: string[]) => unknown
  }

  let { resource = null, onConfirm = () => {} }: Props = $props()

  let selectedProjectIds: string[] = $derived(
    resource?.projectIds ? [...resource.projectIds] : []
  )
</script>

<ModalContent
  title={`Assign projects${resource ? ` to ${resource.name}` : ""}`}
  confirmText="Save"
  size="M"
  onConfirm={() => onConfirm(selectedProjectIds)}
>
  {#if resource}
    <Body size="S" color="var(--spectrum-global-color-gray-700)">
      Choose which projects this {resource.typeLabel.toLowerCase()} belongs to.
    </Body>
  {/if}

  <ProjectSelect bind:value={selectedProjectIds} />
</ModalContent>
