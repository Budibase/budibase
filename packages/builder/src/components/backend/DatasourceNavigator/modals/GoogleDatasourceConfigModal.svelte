<script>
  import { ModalContent, Body, Layout } from "@budibase/bbui"
  import { IntegrationNames } from "constants/backend"
  import cloneDeep from "lodash/cloneDeepWith"
  import GoogleButton from "../_components/GoogleButton.svelte"
  import { saveDatasource as save } from "builderStore/datasource"

  export let integration
  export let modal

  // kill the reference so the input isn't saved
  let datasource = cloneDeep(integration)
</script>

<ModalContent
  title={`Connect to ${IntegrationNames[datasource.type]}`}
  onCancel={() => modal.show()}
  cancelText="Back"
  size="L"
>
  <Layout noPadding>
    <Body size="XS"
      >Authenticate with your google account to use the {IntegrationNames[
        datasource.type
      ]} integration.</Body
    >
  </Layout>
  <GoogleButton preAuthStep={() => save(datasource, true)} />
</ModalContent>
