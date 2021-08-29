<script>
  import { Body } from "@budibase/bbui"
  import { _ as t } from "svelte-i18n"

</script>

<div class="root">
  <Body size="S">{ $t('this-action-doesnt-require-any-additional-settings') }</Body>
</div>

<style>
  .root {
    max-width: 800px;
    margin: 0 auto;
  }
</style>
