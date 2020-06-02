/**
 * The workflow orchestrator is a class responsible for executing workflows.
 * It relies on the strategy pattern, which allows composable behaviour to be
 * passed into its execute() function. This allows custom execution behaviour based
 * on where the orchestrator is run.
 *
 */
export default class Orchestrator {
  constructor(api) {
    this.api = api
  }

  set strategy(strategy) {
    this._strategy = strategy({ api: this.api })
  }

  async execute(workflow) {
    if (workflow.live) {
      this._strategy.run(workflow.definition)
    }
  }
}
