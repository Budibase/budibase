<script lang="ts">
  import type { BindingCompletion, BindingCompletionOption } from "@/types"
  import type { EditorRangeReplacement } from "@/types"

  export let value = ""
  export let completions: BindingCompletion[] = []

  export const replaceRange = ({
    from = 0,
    to = from,
    insert,
  }: EditorRangeReplacement) => value.slice(0, from) + insert + value.slice(to)

  const triggerAddTool = () => {
    const context = {
      matchBefore: () => ({ from: 0, to: 2, text: "{{" }),
    }
    const result = Reflect.apply(completions[0], undefined, [context])
    const completion = result?.options.find(
      (option: BindingCompletionOption) => option.label === "Add tool"
    )
    if (typeof completion?.apply !== "function") {
      return
    }
    const view = {
      state: {
        doc: {
          toString: () => value,
          sliceString: (from: number, to: number) => value.slice(from, to),
        },
      },
    }
    Reflect.apply(completion.apply, undefined, [view, completion, 2, 2])
  }
</script>

<button type="button" on:click={triggerAddTool}>Trigger add tool</button>
