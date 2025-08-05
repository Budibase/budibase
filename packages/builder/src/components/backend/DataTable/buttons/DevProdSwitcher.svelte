<script>
  import { Switcher } from "@budibase/bbui"
</script>

<Switcher
  leftIcon="wrench"
  leftText="Dev"
  rightIcon="rocket"
  rightText="Prod"
  on:left={() => {
    console.log("Switching to dev")
  }}
  on:right={() => {
    console.log("Switching to Prod")
  }}
/>
