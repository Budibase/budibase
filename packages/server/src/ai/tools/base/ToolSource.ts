import { Tool, AgentToolSource } from "@budibase/types"

/**
 * Abstract base class for tool sources
 * Provides a centralized way to handle tool source operations
 */
export abstract class ToolSource {
  protected toolSource: AgentToolSource

  constructor(toolSource: AgentToolSource) {
    this.toolSource = toolSource
  }

  /**
   * Get the type identifier for this tool source
   */
  abstract getType(): string

  /**
   * Get all available tools for this tool source
   * Implementations should handle authentication and configuration
   */
  abstract getTools(): Tool[]

  /**
   * Get filtered tools based on disabled tools list
   */
  getEnabledTools(): Tool[] {
    const allTools = this.getTools()
    const disabledTools = this.toolSource.disabledTools || []
    return allTools.filter(tool => !disabledTools.includes(tool.name))
  }

  /**
   * Get guidelines for using this tool source
   */
  getGuidelines(): string | undefined {
    return this.toolSource.auth?.guidelines
  }

  /**
   * Validate that the tool source has the required configuration
   */
  abstract validate(): boolean

  /**
   * Get a human-readable name for this tool source
   */
  abstract getName(): string
}
