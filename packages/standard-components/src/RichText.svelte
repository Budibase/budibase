<script>
  import { RichText } from '@budibase/bbui'

  export let _bb

  export let content = ""

  const updateValue = content => {
    if (_bb) {
      _bb.setBinding("value", content)
    }
  }

  $: updateValue(content)

  // Need to determine what options we want to expose.

  let options = {
    "modules": {
      "toolbar": [
        [
          {
            "header": [
              1,
              2,
              3,
              false
            ]
          }
        ],
        [
          "bold",
          "italic",
          "underline",
          "strike"
        ]
      ]
    },
    "placeholder": "Type something...",
    "theme": "snow"
  }
</script>
  
  <RichText bind:content {options} />