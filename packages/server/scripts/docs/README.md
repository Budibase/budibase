### Documentation

This directory contains the scripts required to generate the APIDoc based documentation.
You can find the docs about comment structure at the [APIDocs page](https://apidocjs.com/).

In general most API endpoints will look like:
```js
  /**
   * @api {post} /api/:param/url Give it a name 
   * @apiName Give it a name
   * @apiGroup group
   * @apiPermission permission
   * @apiDescription Describe what the endpoint does, any special cases the user
   * should be aware of.
   *
   * @apiParam {string} param describe a URL parameter.
   *
   * @apiParam (Body) input describe a field on the body.
   *
   * @apiSuccess {object} output describe the output.
   */
```

There are a few key points to note when writing API docs:
1. Don't use `@apiBody` - this isn't currently supported by our swagger converter.
2. Make sure to always have an `@api` definition at the start, which must always have the
HTTP verb, the endpoint URL and the name.
3. There are three ways you can specify parameters used as inputs for your endpoint,
`@apiParam` for a URL param, `@apiParam (Body)` for a field on the request body and `@apiParam (Query)`
for query string parameters.
4. The `@apiGroup` should be the same for all API Doc comments in a route file.