<script>
  import { InfoWord } from "../../typography"
  import { Subject, Section } from "./components"
</script>

<Subject heading="Data/Component Compatibility">
  <Section>
    <InfoWord icon="check-circle" color="var(--green)" text="Compatible" />
    <span class="body"
      >Fully compatible with the input as long as the data is present.</span
    >
  </Section>
  <Section>
    <InfoWord
      icon="warning-circle"
      color="var(--yellow)"
      text="Partially compatible"
    />
    <span class="body"
      >Partially compatible with the input, but beware of other caveats
      mentioned.</span
    >
  </Section>
  <Section>
    <InfoWord icon="warning" color="var(--red)" text="Not compatible" />
    <span class="body">Incompatible with the component.</span>
  </Section>
</Subject>

<style>
  .body {
    display: block;
    margin-top: 5px;
  }
</style>
