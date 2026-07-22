<script lang="ts">
  import { Banner } from "@budibase/bbui"
  import { TRUSTED_AUTHOR_WARNING } from "@/helpers/functionsGate"
</script>

<Banner type="warning" icon="warning" showCloseButton={false}>
  {TRUSTED_AUTHOR_WARNING}
</Banner>
