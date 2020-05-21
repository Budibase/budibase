import api from "builderStore/api";

class Orchestrator {
  set strategy(strategy) {
    this._stategy = strategy
  }

  execute(workflow) {
    this._strategy.execute(workflow);
  }
}

const ClientStrategy = {
  execute: function(workflow) {
    const block = workflow.next;
    const EXECUTE_WORKFLOW_URL = `api/${workflow.instanceId}/workflows/${workflow._id}`;

    switch (block.type) {
      case "CLIENT":
        // fetch the workflow code from the server, then execute it here in the client 
          // catch any errors
          // check against the conditions in the workflow
          // if everything is fine, recurse
          this.execute(workflow.next);
        break;
      case "SERVER":
        // hit the server endpoint and wait for the response
          // catch any errors
          // check against the conditions in the workflow
          // if everything is fine, recurse
        await api.post()
        break;
      default:
        break;
    }

  }
}