{
  "targets": [{
    "variables": {
      "conditions": [
        ["OS=='linux'",   {"os_include": "linux"}],
        ["OS=='android'", {"os_include": "linux"}],
        ["OS=='ios'",     {"os_include": "mac"}],
        ["OS=='mac'",     {"os_include": "mac"}],
        ["OS=='solaris'", {"os_include": "solaris"}],
        ["OS=='win'",     {"os_include": "win32"}],
        ["OS=='freebsd'", {"os_include": "freebsd"}],
        ["OS=='openbsd'", {"os_include": "openbsd"}]
      ]
    },
    "target_name": "snappy",
    "type": "static_library",
    "standalone_static_library": 1,
    "include_dirs": [
      "<(os_include)",
      "snappy"
    ],
    "direct_dependent_settings": {
      "include_dirs": [
        "<(os_include)",
        "snappy"
      ]
    },
    "defines": [
      "HAVE_CONFIG_H=1"
    ],
    "conditions": [
      ["OS == 'win'", {
        "defines": [
          "_HAS_EXCEPTIONS=0"
        ],
        "msvs_settings": {
          "VCCLCompilerTool": {
            "RuntimeTypeInfo": "false",
            "EnableFunctionLevelLinking": "true",
            "ExceptionHandling": "2",
            "DisableSpecificWarnings": [ "4355", "4530" ,"4267", "4244", "4506", "4018" ]
          }
        }
      }],
      ["OS == 'linux'", {
        "cflags": [
          "-Wno-sign-compare",
          "-Wno-unused-function"
        ],
        "cflags!": [ "-fno-tree-vrp" ]
      }],
      ["OS == 'freebsd'", {
        "cflags": [
          "-Wno-sign-compare",
          "-Wno-unused-function"
        ]
      }],
      ["OS == 'openbsd'", {
        "cflags": [
          "-Wno-sign-compare",
          "-Wno-unused-function"
        ]
      }],
      ["OS == 'solaris'", {
        "cflags": [
          "-Wno-sign-compare",
          "-Wno-unused-function"
        ]
      }],
      ["OS == 'mac'", {
        "xcode_settings": {
          "WARNING_CFLAGS": [
            "-Wno-sign-compare",
            "-Wno-unused-function"
          ]
        }
      }],
      ["OS == 'android'", {
        "cflags": [
          "-Wno-sign-compare",
          "-fPIC",
          "-Wno-unused-function"
        ],
        "cflags!": [
          "-fno-tree-vrp",
          "-mfloat-abi=hard",
          "-fPIE"
        ]
      }],
      ["target_arch == 'arm'", {
        "cflags": [
          "-mfloat-abi=hard"
        ]
      }]
    ],
    "sources": [
      "snappy/snappy-internal.h",
      "snappy/snappy-sinksource.cc",
      "snappy/snappy-sinksource.h",
      "snappy/snappy-stubs-internal.cc",
      "snappy/snappy-stubs-internal.h",
      "snappy/snappy.cc",
      "snappy/snappy.h"
    ]
  }]
}
