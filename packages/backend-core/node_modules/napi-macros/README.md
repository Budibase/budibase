# napi-macros

Set of utility macros to make writing [N-API](https://nodejs.org/dist/latest-v9.x/docs/api/n-api.html) modules a little easier.

```
npm install napi-macros
```

Then add the following to your target in your binding.gyp file

```
"include_dirs": [
  "<!(node -e \"require('napi-macros')\")"
],
```

These patterns mostly reflect how I use N-API so far. Feel free
to PR more.

## Usage

``` c
#include <node_api.h>
#include <napi-macros.h>

NAPI_METHOD(times_two) {
  NAPI_ARGV(1)
  NAPI_ARGV_INT32(number, 0)

  number *= 2;

  NAPI_RETURN_INT32(number)
}

NAPI_INIT() {
  NAPI_EXPORT_FUNCTION(times_two)
}
```

Full working example can be found in the [example/](https://github.com/mafintosh/napi-macros/tree/master/example) folder.

## API

#### `NAPI_INIT()`

Setup init boilerplate. Pass the function body after.

``` c
static char *my_string = "hello";

NAPI_INIT() {
  EXPORT_STRING(my_string)
}
```

#### `NAPI_METHOD(name)`

Setup method boilerplate. Pass the function body after.

``` c
NAPI_METHOD(add) {
  NAPI_ARGV(2)
  NAPI_ARGV_INT32(a, 0)
  NAPI_ARGV_INT32(b, 1)

  a = a + b

  NAPI_RETURN_INT32(a)
}
```

#### `NAPI_ARGV(n)`

Setup up argv boilerplate. `n` is how many arguments you are expecting.
Expects the `napi_env` to be in scope as `env` and the `napi_callback_info` to be in scope as `info`.

#### `NAPI_ARGV_BUFFER(name, index)`

Get a buffer out of the arguments at the corresponding index.
Sets `char *name` and `size_t name_len` with the buffer and buffer length.

#### `NAPI_ARGV_BUFFER_CAST(type, name, index)`

Get a buffer out and cast the pointer to the specified type.
Note that the type should include the pointer star, i.e.

``` c
NAPI_ARGV_BUFFER_CAST(uv_udp_t *, handle, 0)
```

Will cast the 1st argument as `uv_udp_t` pointer.

#### `NAPI_ARGV_UINT32(name, index)`

Get an argument as a uint32.
Will throw if argument is not the right type.

#### `NAPI_ARGV_INT32(name, index)`

Get an argument as an int32.
Will throw if argument is not the right type.

#### `NAPI_ARGV_UTF8(name, length, index)`

Get an argument as a utf8 string.

`name` will be a `char[length]` array.

Will throw if argument is not the right type.

#### `NAPI_ARGV_UTF8_MALLOC(name, index)`

Get an argument as a utf8 string.

`name` will be a `char*`.

Like `NAPI_ARGV_UTF8()` but allocates `name` on the heap using `malloc()`, which should be `free()`'d after usage.

#### `NAPI_BUFFER_CAST(type, name, var)`

Same as `NAPI_ARGV_BUFFER_CAST` but takes a generic `napi_value` variable instead of an argv index.

#### `NAPI_BUFFER(name, var)`

Same as `NAPI_ARGV_BUFFER` but takes a generic `napi_value` variable instead of an argv index.

#### `NAPI_UTF8(name, size, var)`

Same as `NAPI_ARGV_UTF8` but takes a generic `napi_value` variable instead of an argv index.

#### `NAPI_UTF8_MALLOC(name, var)`

Same as `NAPI_ARGV_UTF8_MALLOC` but takes a generic `napi_value` variable instead of an argv index.

#### `NAPI_UINT32(name, var)`

Same as `NAPI_ARGV_UINT32` but takes a generic `napi_value` variable instead of an argv index.

#### `NAPI_INT32(name, var)`

Same as `NAPI_ARGV_INT32` but takes a generic `napi_value` variable instead of an argv index.

#### `NAPI_EXPORT_FUNCTION(fn)`

Will export a function in the Init method. Expects the env and `exports` to be in scope.
The name of the exported function is the same name as the c function.

#### `NAPI_EXPORT_SIZEOF(struct)`

Export the size of a strict. The exported name is `sizeof_{struct-name}`.

#### `NAPI_EXPORT_UINT32(name)`

Export a uint32.
The name of the exported number is the same name as the c variable.

#### `NAPI_EXPORT_INT32(name)`

Export an int32.
The name of the exported number is the same name as the c variable.

#### `NAPI_EXPORT_UTF8(name, len)`

Export a utf8 string. `len` should be the length of the string.
The name of the exported string is the same name as the c variable.

#### `NAPI_EXPORT_STRING(name)`

Export a null terminated string.
The name of the exported string is the same name as the c variable.

#### `NAPI_EXPORT_SIZEOF(type)`

Exports `sizeof(type)`.
The name of the exported number is the same name as the c variable.

#### `NAPI_EXPORT_SIZEOF_STRUCT(structName)`

Exports `sizeof(struct structName)`.
The name of the exported number is the same name as the c variable.

#### `NAPI_EXPORT_ALIGNMENTOF(type)`

Exports the byte alignment of `type`.
The name of the exported number is the same name as the c variable.

#### `NAPI_EXPORT_ALIGNMENTOF_STRUCT(structName)`

Exports the byte alignment of `struct structName`.
The name of the exported number is the same name as the c variable.

#### `NAPI_EXPORT_OFFSETOF(type, name)`

Exports the byte offset of `name` within `type`.
The name of the exported number is the same name as the c variables.

#### `NAPI_EXPORT_OFFSETOF_STRUCT(structName, name)`

Exports the byte offset of `name` within `struct structName`.
The name of the exported number is the same name as the c variables.

#### `NAPI_FOR_EACH(array, element)`

Iterate over an array. `array` should be a `napi_value` containing a javascript array
and `element` is the variable name an element will be exposed as. Expects the loop body
to be passed after.

``` c
napi_value buffers = argv[0] // first argument is a js array
NAPI_FOR_EACH(buffers, buffer) {
  NAPI_BUFFER(cbuf, buffer)
  printf("cbuf is now a char * pointer: %s\n", cbuf);
}
```

#### `NAPI_RETURN_UINT32(name)`

Returns a uint32.

#### `NAPI_RETURN_INT32(name)`

Returns an int32.

#### `NAPI_RETURN_UTF8(name, len)`

Return a utf8 string. `len` should be the length of the string.

#### `NAPI_RETURN_STRING(name)`

Return a null terminated string.

#### `NAPI_STATUS_THROWS(call)`

Checks the return status of any `napi_*` function returning a `napi_status` type. This simplifies using a `napi_status` variable and comparing the result with `napi_ok`. It's used internally but can be used stand alone as well.

```c
NAPI_STATUS_THROWS(
  napi_create_threadsafe_function(
    NULL,
    callback,
    0,
    async_resource_name,
    0,
    3,
    0,
    my_finalize,
    NULL,
    my_callback,
    &threadsafe_function
  )
);
```

Above example will fail because the first `env` parameter is `NULL` and throw the following error:

```
Error: napi_create_threadsafe_function(NULL, callback, 0, async_resource_name, 0, 3, 0, my_finalize, \
NULL, my_callback, &threadsafe_function) failed!
```

#### `NAPI_UV_THROWS(err, fn)`

Checks if a libuv call fails and if so, throws an error.

``` c
int err;
NAPI_UV_THROWS(err, uv_ip4_addr((char *) &ip, port, &addr))
```

#### `NAPI_MAKE_CALLBACK(env, async_ctx, ctx, func, argc, argv, result)`

Same as `napi_make_callback` except it checks if the JS function throw an exception
and triggers a `process.on('uncaughtException')` if so.

## License

MIT
