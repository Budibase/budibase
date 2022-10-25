const automationUtils = require("../automationUtils")

describe("automationUtils", () => {
    test("substituteLoopStep should allow multiple loop binding substitutes", () => {
        expect(automationUtils.substituteLoopStep(
            `{{ loop.currentItem._id }} {{ loop.currentItem._id }} {{ loop.currentItem._id }}`, 
            "step.2"))
        .toBe(`{{ step.2.currentItem._id }} {{ step.2.currentItem._id }} {{ step.2.currentItem._id }}`)
    })

    test("substituteLoopStep should handle not subsituting outside of curly braces", () => {
        expect(automationUtils.substituteLoopStep(
            `loop {{ loop.currentItem._id }}loop loop{{ loop.currentItem._id }}loop`, 
            "step.2"))
        .toBe(`loop {{ step.2.currentItem._id }}loop loop{{ step.2.currentItem._id }}loop`)
    })
})