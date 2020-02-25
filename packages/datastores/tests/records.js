import { action, iterateActionTimes } from "./helpers"
import { isUndefined, union } from "lodash"

const createClient = (apis, getState) => async i => {
  const client = apis.recordApi.getNew("/clients", "client")
  client.FamilyName = "Humperdink"
  client.Address1 = `${i} Mainitucetts Avenue`
  client.Address2 = "Longerton Road South"
  client.Address3 = "Chalico City"
  client.Address4 = "Northern Humranistan"
  client.Postcode = "BY71 5FR"
  client.CreatedDate = new Date()

  const state = getState()
  if (isUndefined(state.clientKeys)) state.clientKeys = []
  state.clientKeys.push(client.key())

  await apis.recordApi.save(client)

  return client.key()
}

const listClients = (apis, getState) => async () => {
  const clients = await apis.viewApi.listItems("/clients/default")
  const state = getState()
  if (state.clientKeys.length !== clients.length) {
    throw new Error(
      "list CLients, expected " +
        state.clientKeys.length.toString() +
        " clients, actual " +
        clients.length.toString()
    )
  }
}

export default apis => {
  const state = {}
  const getState = () => state

  const noOfRecords = 10000
  const recordsPerIteration = 10
  const noOfIterations = noOfRecords / recordsPerIteration

  const actionsInOneIteration = () => [
    action(
      "Create client",
      createClient(apis, getState),
      iterateActionTimes(recordsPerIteration)
    ),

    action("List Clients", listClients(apis, getState)),
  ]

  let actions = []
  for (let index = 0; index < noOfIterations; index++) {
    actions = union(actions, actionsInOneIteration())
  }

  let actionIndex = 0

  return () => {
    if (actionIndex == actions.length) {
      return { done: true }
    }
    const result = { action: actions[actionIndex], done: false }
    actionIndex++
    return result
  }
}
