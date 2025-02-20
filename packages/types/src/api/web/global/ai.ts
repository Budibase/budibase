import { Row } from "../../../documents"

export interface AIPromptRequest {
  userInput: string
}

export interface AIPromptResponse {
  message: string
  data: Row[]
}
