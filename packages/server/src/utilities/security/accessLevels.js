exports.BUILTIN_LEVELS = {
  admin: { _id: "ADMIN", name: "Admin" },
  power: { _id: "POWER_USER", name: "Power user" },
  builder: { _id: "BUILDER", name: "Builder" },
  anon: { _id: "ANON", name: "Anonymous" },
}

exports.BUILTIN_LEVEL_IDS = Object.values(exports.BUILTIN_LEVELS).map(
  level => level._id
)

exports.BUILTIN_LEVEL_NAMES = Object.values(exports.BUILTIN_LEVELS).map(
  level => level.name
)
