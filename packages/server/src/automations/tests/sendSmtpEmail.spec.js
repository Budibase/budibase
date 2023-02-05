
function generateResponse(to, from) {
    return {
        "success": true,
        "response": {
            "accepted": [
                to
            ],
            "envelope": {
                "from": from,
                "to": [
                    to
                ]
            },
            "message": `Email sent to ${to}.`
        }

    }
}

const mockFetch = jest.fn(() => ({
    headers: {
        raw: () => {
            return { "content-type": ["application/json"] }
        },
        get: () => ["application/json"],
    },
    json: jest.fn(() => response),
    status: 200,
    text: jest.fn(),
}))
jest.mock("node-fetch", () => mockFetch)
const setup = require("./utilities")


describe("test the outgoing webhook action", () => {
    let inputs
    let config = setup.getConfig()
    beforeEach(async () => {
        await config.init()
    })

    afterAll(setup.afterAll)

    it("should be able to run the action", async () => {
        inputs = {
            to: "user1@test.com",
            from: "admin@test.com",
            subject: "hello",
            contents: "testing",
        }
        let resp = generateResponse(inputs.to, inputs.from)
        mockFetch.mockImplementationOnce(() => ({
            headers: {
                raw: () => {
                    return { "content-type": ["application/json"] }
                },
                get: () => ["application/json"],
            },
            json: jest.fn(() => resp),
            status: 200,
            text: jest.fn(),
        }))
        const res = await setup.runStep(setup.actions.SEND_EMAIL_SMTP.stepId, inputs)
        expect(res.response).toEqual(resp)
        expect(res.success).toEqual(true)

    })


})
