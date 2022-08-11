"use strict";
jest.mock("posthog-node", () => {
    return jest.fn().mockImplementation(() => {
        return {
            capture: jest.fn(),
        };
    });
});
//# sourceMappingURL=posthog.js.map