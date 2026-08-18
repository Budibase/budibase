export interface PromptHistoryNavigationState {
  inputValue: string
  index: number | undefined
}

interface NavigatePromptHistoryOptions extends PromptHistoryNavigationState {
  key: string
  history: string[]
}

export const navigatePromptHistory = ({
  key,
  history,
  inputValue,
  index,
}: NavigatePromptHistoryOptions): PromptHistoryNavigationState | undefined => {
  if (key !== "ArrowUp" && key !== "ArrowDown") {
    return undefined
  }

  if (index === undefined) {
    if (key !== "ArrowUp" || inputValue !== "" || history.length === 0) {
      return undefined
    }

    const nextIndex = history.length - 1
    return { inputValue: history[nextIndex], index: nextIndex }
  }

  if (key === "ArrowUp") {
    const nextIndex = Math.max(0, index - 1)
    return { inputValue: history[nextIndex], index: nextIndex }
  }

  if (index >= history.length - 1) {
    return { inputValue: "", index: undefined }
  }

  const nextIndex = index + 1
  return { inputValue: history[nextIndex], index: nextIndex }
}
