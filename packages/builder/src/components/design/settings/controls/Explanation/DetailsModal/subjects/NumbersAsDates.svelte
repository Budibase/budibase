<script>
  import { onMount } from "svelte"
  import {
    ExampleSection,
    ExampleLine,
    Block,
    Subject,
    Section,
  } from "./components"

  let timestamp = Date.now()

  onMount(() => {
    let run = true

    const updateTimeStamp = () => {
      timestamp = Date.now()
      if (run) {
        setTimeout(updateTimeStamp, 200)
      }
    }

    updateTimeStamp()

    return () => {
      run = false
    }
  })
</script>

<Subject heading="Numbers as Dates">
  <Section>
    A number value can be used in place of a datetime value, but it will be
    parsed as a <Block>UNIX time</Block> timestamp, which is the number of milliseconds
    since Jan 1st 1970. A more recent moment in time will be a higher number.
  </Section>

  <ExampleSection heading="Examples:">
    <ExampleLine>
      <Block>946684800000</Block>
      <span class="separator">{"->"}</span>
      <Block>
        {new Date(946684800000).toLocaleString()}
      </Block>
    </ExampleLine>
    <ExampleLine>
      <Block>1577836800000</Block>
      <span class="separator">{"->"}</span>
      <Block>
        {new Date(1577836800000).toLocaleString()}
      </Block>
    </ExampleLine>
    <ExampleLine>
      <Block>{timestamp}</Block>
      <span class="separator">{"->"}</span>
      <Block>Now</Block>
    </ExampleLine>
  </ExampleSection>
</Subject>

<style>
  .separator {
    margin: 0 5px;
  }
</style>
