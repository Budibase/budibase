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

<Subject heading="Dates as Numbers">
  <Section>
    A datetime value can be used in place of a numeric value, but it will be
    converted to a <Block>UNIX time</Block> timestamp, which is the number of milliseconds
    since Jan 1st 1970. A more recent moment in time will be a higher number.
  </Section>

  <ExampleSection heading="Examples:">
    <ExampleLine>
      <Block>
        {new Date(946684800000).toLocaleString()}
      </Block>
      <span class="separator">{"->"} </span><Block>946684800000</Block>
    </ExampleLine>
    <ExampleLine>
      <Block>
        {new Date(1577836800000).toLocaleString()}
      </Block>
      <span class="separator">{"->"} </span><Block>1577836800000</Block>
    </ExampleLine>
    <ExampleLine>
      <Block>Now</Block><span class="separator">{"->"} </span><Block
        >{timestamp}</Block
      >
    </ExampleLine>
  </ExampleSection>
</Subject>

<style>
  .separator {
    margin: 0 5px;
  }
</style>
