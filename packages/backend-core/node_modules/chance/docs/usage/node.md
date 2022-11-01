# node

It can also be used in [Node.js](http://nodejs.org)

```bash
npm install chance
```

then in your app

```js
// Load Chance
var Chance = require('chance');

// Instantiate Chance so it can be used
var chance = new Chance();

// Use Chance here.
var my_random_string = chance.string();
```

As of version 0.5.5, the following is also offered as a convenience for getting
an instance of Chance

```js
// Load and instantiate Chance
var chance = require('chance').Chance();

// Use Chance here.
var my_random_string = chance.string();
```
