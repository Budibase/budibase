<script>
  import {
    redirect,
    isChangingPage,
    page,
    isActive,
    layout,
    route,
  } from "@roxi/routify"
  // $: console.log("isChangingPage", $isChangingPage)
  // $: console.log("page ", $page)
  // $: console.log("is Active ", $isActive("../settings"))
  $: indexCheck = $layout.meta.index
  $: console.log("Index Check ", indexCheck)
  $: console.log("layout", $layout)

  $redirect("../settings/automation-history")
</script>
