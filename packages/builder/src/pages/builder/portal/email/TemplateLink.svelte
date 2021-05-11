<script>
  import { url } from "@roxi/routify"
  import {
    Link,
  } from "@budibase/bbui"
  import { roles } from "stores/backend"

  export let value
</script>

<Link quiet href={$url(`./${value}`)}><span>{value}</span></Link>

<style>
  span {
    text-transform: capitalize;
  }
</style>
