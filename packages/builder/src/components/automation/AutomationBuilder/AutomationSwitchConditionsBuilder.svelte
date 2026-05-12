<script lang="ts">
  import FilterBuilder from "@/components/design/settings/controls/FilterEditor/FilterBuilder.svelte"
  import AutomationBindingPanel from "@/components/common/bindings/ServerBindingPanel.svelte"
  import { Constants } from "@budibase/frontend-core"
  import {
    BasicOperator,
    UILogicalOperator,
    type EnrichedBinding,
  } from "@budibase/types"
  import { createEventDispatcher } from "svelte"

  export let filters: any = undefined
  export let bindings: EnrichedBinding[] = []
  export let schemaFields: Array<{ name: string; displayName: string; type: string }> = []
  export let evaluationContext: any = {}
  export let showDeleteGroupAction = true
  export let groupLabel: string | undefined = undefined

  const dispatch = createEventDispatcher()

  const createDefaultConditionUI = () => ({
    groups: [
      {
        logicalOperator: UILogicalOperator.ANY,
        filters: [
          {
            field: "",
            valueType: Constants.FilterValueType.VALUE,
            operator: BasicOperator.EQUAL,
            value: "",
          },
        ],
      },
    ],
  })

  const handleChange = (e: CustomEvent) => {
    const detail = e.detail
    if (!detail?.groups?.length) {
      dispatch("change", createDefaultConditionUI())
    } else {
      dispatch("change", detail)
    }
  }
</script>

<FilterBuilder
  {filters}
  {bindings}
  {schemaFields}
  datasource={{ type: "custom" }}
  panel={AutomationBindingPanel}
  on:change={handleChange}
  allowOnEmpty={false}
  builderType={"condition"}
  docsURL={null}
  {evaluationContext}
  showGlobalHeader={false}
  {showDeleteGroupAction}
  showAddGroupButton={false}
  {groupLabel}
/>
