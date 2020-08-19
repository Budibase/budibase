<script>
  /*
  This file exists because of how we pass this control to the 
  properties panel - via a JS reference, not using svelte tags
  ... checkout the use of Input in propertyCategories to see what i mean
  */
  import { Input } from "@budibase/bbui"
  export let name, value, placeholder, type
</script>

<Input {name} {value} {placeholder} {type} thin on:change />
