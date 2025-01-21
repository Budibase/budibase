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
  $: iso = new Date(timestamp).toISOString()

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

<Subject heading="Strings as Dates">
  <Section>
    A string value can be used in place of a datetime value, but it will be
    parsed as:
  </Section>
  <Section>
    A <Block>UNIX time</Block> timestamp, which is the number of milliseconds since
    Jan 1st 1970. A more recent moment in time will be a higher number.
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
  <Section>
    An <Block>ISO 8601</Block> datetime string, which represents an exact moment
    in time as well as the potentional to store the timezone it occured in.
  </Section>
  <div class="isoExamples">
    <ExampleSection heading="Examples:">
      <ExampleLine>
        <Block>2000-01-01T00:00:00.000Z</Block>
        <span class="separator">↓</span>
        <Block>
          {new Date(946684800000).toLocaleString()}
        </Block>
      </ExampleLine>
      <ExampleLine>
        <Block>2000-01-01T00:00:00.000Z</Block>
        <span class="separator">↓</span>
        <Block>
          {new Date(1577836800000).toLocaleString()}
        </Block>
      </ExampleLine>
      <ExampleLine>
        <Block>{iso}</Block>
        <span class="separator">↓</span>
        <Block>Now</Block>
      </ExampleLine>
    </ExampleSection>
  </div>
</Subject>

<style>
  .separator {
    margin: 0 5px;
  }

  .isoExamples :global(.block) {
    word-break: break-all;
  }

  .isoExamples :global(.exampleLine) {
    align-items: center;
    flex-direction: column;
    margin-bottom: 16px;
    width: 162px;
  }
</style>
