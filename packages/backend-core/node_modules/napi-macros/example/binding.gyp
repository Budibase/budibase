{
  "targets": [{
    "target_name": "napi_macros_example",
    "include_dirs": [
      "<!(node -e \"require('../')\")"
    ],
    "sources": [ "./index.c" ]
  }]
}
