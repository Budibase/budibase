# Budibase Core backend library

This library contains core functionality, like auth and security features
which are shared between backend services.

#### Note about top level JS files
For the purposes of being able to do say `require("@budibase/backend-core/permissions")` we need to
specify the exports at the top-level of the module.

For these files they should be limited to a single `require` of the file that should
be exported and then a single `module.exports = ...` to export the file in
commonJS.