import { decodeJSBinding } from "@budibase/string-templates"
import { hbInsert, jsInsert } from "components/common/CodeEditor"

export class BindingHelpers {
  constructor(getCaretPosition, insertAtPos, { disableWrapping } = {}) {
    this.getCaretPosition = getCaretPosition
    this.insertAtPos = insertAtPos
    this.disableWrapping = disableWrapping
  }

  // Adds a JS/HBS helper to the expression
  onSelectHelper(value, helper, { js, dontDecode }) {
    const pos = this.getCaretPosition()
    const { start, end } = pos
    if (js) {
      const jsVal = dontDecode ? value : decodeJSBinding(value)
      const insertVal = jsInsert(jsVal, start, end, helper.text, {
        helper: true,
      })
      this.insertAtPos({ start, end, value: insertVal })
    } else {
      const insertVal = hbInsert(value, start, end, helper.text)
      this.insertAtPos({ start, end, value: insertVal })
    }
  }

  // Adds a data binding to the expression
  onSelectBinding(value, binding, { js, dontDecode }) {
    const { start, end } = this.getCaretPosition()
    if (js) {
      const jsVal = dontDecode ? value : decodeJSBinding(value)
      const insertVal = jsInsert(jsVal, start, end, binding.readableBinding, {
        disableWrapping: this.disableWrapping,
      })
      this.insertAtPos({ start, end, value: insertVal })
    } else {
      const insertVal = hbInsert(value, start, end, binding.readableBinding)
      this.insertAtPos({ start, end, value: insertVal })
    }
  }

  // Adds a JS/HBS helper to the expression
  onSelectSnippet(value, snippet) {
    const pos = this.getCaretPosition()
    const { start, end } = pos
    const jsVal = decodeJSBinding(value)
    const insertVal = jsInsert(jsVal, start, end, `snippets.${snippet.name}`)
    this.insertAtPos({ start, end, value: insertVal })
  }
}
