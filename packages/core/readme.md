## Getting Started

Install requires [node-gyp](https://github.com/nodejs/node-gyp), due to a dependancy on [argon2](https://github.com/ranisalt/node-argon2)

### For node gyp on windows

`npm install --global --production windows-build-tools`
and this might help: https://github.com/nodejs/node-gyp/issues/1278

### For node gyp on ubuntu

`sudo apt-get install build-essentials`

Once you have this, try...

`npm install`

Next, run the tests. Install jest, globally:

`npm install -g jest`

And finally, run

`jest`

## Documentation

A work in progress, lives here: https://github.com/Budibase/docs/blob/master/budibase-core.md




