<script>
  import DrawerBindableInput from "@/components/common/bindings/DrawerBindableInput.svelte"
</script>

<DrawerBindableInput
  {...$$props}
  forceModal
  on:change
  on:blur
  on:drawerHide
  on:drawerShow
/>
