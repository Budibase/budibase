"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mockFetch = jest.fn();
const enable = () => {
    jest.mock("node-fetch", () => mockFetch);
};
exports.default = Object.assign(Object.assign({}, mockFetch), { enable });
//# sourceMappingURL=fetch.js.map