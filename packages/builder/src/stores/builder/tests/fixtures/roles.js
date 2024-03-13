export const ROLES = [
  {
    name: "Test",
    permissionId: "admin",
    inherits: "ADMIN",
    _id: "role_04681b7e71914a0aa53e09a5bea3584f",
    _rev: "1-179c71ea61d7fd987306b84b6d64b00e",
  },
  {
    _id: "ADMIN",
    name: "Admin",
    permissionId: "admin",
    inherits: "POWER",
  },
  {
    _id: "POWER",
    name: "Power",
    permissionId: "power",
    inherits: "BASIC",
  },
  {
    _id: "BASIC",
    name: "Basic",
    permissionId: "write",
    inherits: "PUBLIC",
  },
  {
    _id: "PUBLIC",
    name: "Public",
    permissionId: "public",
  },
]
