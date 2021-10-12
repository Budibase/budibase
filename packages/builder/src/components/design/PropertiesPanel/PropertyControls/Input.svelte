<script>
  import { Input } from "@budibase/bbui"
  import { isJSBinding } from "@budibase/string-templates"

  export let value

  $: isJS = isJSBinding(value)
</script>

<Input
  {...$$props}
  value={isJS ? "(JavaScript function)" : value}
  readonly={isJS}
/>
