<script>
    import { RichText } from '@budibase/bbui'

    export let _bb
  
    export let label = ""
    export let value = ""
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
  
  <RichText {options} />