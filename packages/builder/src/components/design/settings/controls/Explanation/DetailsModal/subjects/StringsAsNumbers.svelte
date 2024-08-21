<script>
  import {
    ExampleSection,
    ExampleLine,
    Block,
    Subject,
    Section,
  } from "./components"
</script>

<Subject heading="Text as Numbers">
  <Section>
    Text can be used in place of numbers in certain scenarios, but care needs to
    be taken; if the value isn't purely numerical it may be converted in an
    unexpected way.
  </Section>

  <ExampleSection heading="Examples:">
    <ExampleLine>
      <Block>"100"</Block><span class="separator">{"->"}</span><Block>100</Block
      >
    </ExampleLine>
    <ExampleLine>
      <Block>"100k"</Block><span class="separator">{"->"}</span><Block
        >100</Block
      >
    </ExampleLine>
    <ExampleLine>
      <Block>"100,000"</Block><span class="separator">{"->"}</span><Block
        >100</Block
      >
    </ExampleLine>
    <ExampleLine>
      <Block>"100 million"</Block><span class="separator">{"->"}</span><Block
        >100</Block
      >
    </ExampleLine>
    <ExampleLine>
      <Block>"100.9"</Block><span class="separator">{"->"}</span><Block
        >100.9</Block
      >
    </ExampleLine>
    <ExampleLine>
      <Block>"One hundred"</Block><span class="separator">{"->"}</span><Block
        >Error</Block
      >
    </ExampleLine>
  </ExampleSection>
</Subject>

<style>
  .separator {
    margin: 0 4px;
    flex-shrink: 0;
  }
</style>
