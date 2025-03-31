<script lang="ts">
  import {
    DrawerBindableSlot,
    ServerBindingPanel as AutomationBindingPanel,
  } from "@/components/common/bindings"
  import { DatePicker } from "@budibase/bbui"
  import { type EnrichedBinding } from "@budibase/types"
  import { createEventDispatcher } from "svelte"

  export let context: Record<any, any> | undefined = undefined
  export let bindings: EnrichedBinding[] | undefined = undefined
  export let value: string | undefined = undefined
  export let title: string | undefined = undefined
  export let disabled: boolean | undefined = false

  const dispatch = createEventDispatcher()
</script>

<DrawerBindableSlot
  {title}
  panel={AutomationBindingPanel}
  type={"date"}
  {value}
  on:change={e => dispatch("change", e.detail)}
  {bindings}
  allowJS={true}
  updateOnChange={false}
  {disabled}
  {context}
>
  <DatePicker
    {value}
    on:change={e => {
      dispatch("change", e.detail)
    }}
  />
</DrawerBindableSlot>
