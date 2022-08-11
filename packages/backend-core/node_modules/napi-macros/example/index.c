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
