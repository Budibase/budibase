<script lang="ts">
  import { DrawerBindableInput } from "@/components/common/bindings"
</script>

<DrawerBindableInput
  on:change
  on:blur
  on:drawerHide
  on:drawerShow
  {...$$props}
  multiline
/>
