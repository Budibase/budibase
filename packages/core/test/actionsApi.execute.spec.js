import { createAppDefinitionWithActionsAndTriggers } from "./specHelpers"
import { getAppApis } from "../src"
import { permission } from "../src/authApi/permissions"

describe("actions execute", () => {
  it("should successfully execute actions", async () => {
    const { emails, app } = await createAppDefinitionWithActionsAndTriggers()

    app.actions.sendEmail("an email")
    expect(emails).toEqual(["an email"])
  })

  it("should successfully execute actions via actions api", async () => {
    const {
      emails,
      actionsApi,
    } = await createAppDefinitionWithActionsAndTriggers()

    actionsApi.execute("sendEmail", "an email")
    expect(emails).toEqual(["an email"])
  })

  it("should throw error when user user does not have permission", async () => {
    const {
      actionsApi,
      app,
    } = await createAppDefinitionWithActionsAndTriggers()
    app.removePermission(permission.executeAction.get("sendEmail"))
    expect(() => actionsApi.execute("sendEmail")).toThrow(/Unauthorized/)
  })

  it("should not depend on having any other permissions", async () => {
    const {
      actionsApi,
      app,
    } = await createAppDefinitionWithActionsAndTriggers()
    app.withOnlyThisPermission(permission.executeAction.get("sendEmail"))
    actionsApi.execute("sendEmail", "am email")
  })
})

describe("triggers execute", () => {
  it("should run action when no condition is set", async () => {
    const {
      logs,
      templateApi,
      behaviourSources,
    } = await createAppDefinitionWithActionsAndTriggers()

    const { recordApi, withFullAccess } = await getAppApis(
      templateApi._storeHandle,
      behaviourSources
    )
    withFullAccess()
    // trigger setup to add to logs on recordApi:save:onError event
    const customer = recordApi.getNew("/customers", "customer")

    let errCaught
    try {
      await recordApi.save(customer)
    } catch (e) {
      errCaught = e.message
    }

    expect(logs).toEqual([errCaught])
  })

  it("should run action when condition is met", async () => {
    const {
      call_timers,
      templateApi,
      behaviourSources,
    } = await createAppDefinitionWithActionsAndTriggers()

    const { recordApi, withFullAccess } = await getAppApis(
      templateApi._storeHandle,
      behaviourSources
    )
    withFullAccess()

    const customer = recordApi.getNew("/customers", "customer")
    customer.surname = "Ledog"

    // trigger call_timer set to return 999 all the time, just for test
    // trigger set to run for type = customer
    await recordApi.save(customer)

    expect(call_timers).toEqual([999])
  })

  it("should not run action when condition is not met", async () => {
    const {
      call_timers,
      templateApi,
      behaviourSources,
    } = await createAppDefinitionWithActionsAndTriggers()

    const { recordApi, withFullAccess } = await getAppApis(
      templateApi._storeHandle,
      behaviourSources
    )
    withFullAccess()

    const partner = recordApi.getNew("/partners", "partner")

    // trigger call_timer set to return 999 all the time, just for test
    // trigger set to run for type = customer
    await recordApi.save(partner)

    expect(call_timers).toEqual([])
  })
})
