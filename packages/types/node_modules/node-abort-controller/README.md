# node-abort-controller

AbortController Polyfill for Node.JS based on EventEmitter

[![Build Status](https://dev.azure.com/stfaul/node-abort-controller/_apis/build/status/southpolesteve.node-abort-controller?branchName=master)](https://dev.azure.com/stfaul/node-abort-controller/_build/latest?definitionId=3&branchName=master)

## Example Usage

### Timing out `fetch`

```javascript
import fetch from "node-fetch";
import { AbortController } from "node-abort-controller";

const controller = new AbortController();
const signal = controller.signal;

await fetch("https:/www.google.com", { signal });

// Abort fetch after 500ms. Effectively a timeout
setTimeout(() => controller.abort(), 500);
```

### Re-usable `fetch` function with a built in timeout

```javascript
import { AbortController } from "node-abort-controller";
import fetch from "node-fetch";

const fetchWithTimeout = async (url = "") => {
  const controller = new AbortController();
  const { signal } = controller;

  const timeout = setTimeout(() => {
    controller.abort();
  }, 5000);

  const request = await fetch(url, { signal });

  clearTimeout(timeout);

  const result = await req.json();

  return result;
};
```

## Why would I need this?

You might not need to! Generally speaking, there are three environments your JavaScript code can run in:

- Node
- Modern Browsers (Not Internet Explorer)
- Legacy Browsers (Mostly Internet Explorer)

For modern JS APIs, each environment would ideally get a polyfill:

- only if it needs one
- specific to the platform.

In practice, this is hard. Tooling such as webpack and browserify are great at making sure stuff works out of the box in all environments. But it is quite easy to fail on both points above. In all likelyhood, you end up shipping less than ideal polyfills on platforms that don't even need them. So what is a developer to do? In the case of `fetch` and `AbortController` I've done the work for you. This is a guide to that work.

If you are building a ...

#### Application running in modern browsers

Congrats! You don't need a library or polyfill at all! Close this tab. Uninstall this package.

#### Application running in modern browsers AND node (such as a server side rendered JS app)

Use _this package_ and [node-fetch](https://www.npmjs.com/package/node-fetch). It is minimally what you need.

#### Application supporting legacy browsers AND NOT node

Use [abort-controller](https://www.npmjs.com/package/abort-controller) and [whatwg-fetch](https://www.npmjs.com/package/whatwg-fetch). These are more complete polyfills that will work in all browser environments.

#### Application supporting legacy browsers AND node

Use [abort-controller](https://www.npmjs.com/package/abort-controller) and [cross-fetch](https://www.npmjs.com/package/cross-fetch). Same as above, except cross-fetch will polyfill correctly in both the browser and node.js

#### Library being consumed by other applications and using `fetch` internally

Use _this package_ and [node-fetch](https://www.npmjs.com/package/node-fetch). It is the smallest and least opinionated combination for your end users. Application developers targeting Internet Exploer will need to polyfill `AbortController` and `fetch` on their own. But your library won't be forcing unecessary polyfills on developers who only target modern browsers.

## Goals

With the above guide in mind, this library has a very specific set of goals:

1. Provide a minimal polyfill in node.js
2. Do not provide a polyfill in any browser environment

This is the ideal for _library authors_ who use `fetch` and `AbortController` internally and target _both_ browser and node developers.

## Prior Art

Thank you @mysticatea for https://github.com/mysticatea/abort-controller. It is a fantastic `AbortController` polyfill and ideal for many use cases.
