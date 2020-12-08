<!-- Module scoped cache of saved role options -->
<script context="module">
  import builderApi from "builderStore/api"

  let cachedRoles

  async function getRoles(force = false) {
    if (cachedRoles && !force) {
      return await cachedRoles
    }
    cachedRoles = new Promise(resolve => {
      builderApi
        .get("/api/roles")
        .then(response => response.json())
        .then(resolve)
    })
    return await cachedRoles
  }
</script>

<script>
  export let roleId

  let roleName
  $: getRole()

  async function getRole() {
    // Try to find a matching role
    let roles = await getRoles()
    let role = roles.find(role => role._id === roleId)

    // If we didn't find a matching role, try updating the cached results
    if (!role) {
      let roles = await getRoles(true)
      let role = roles.find(role => role._id === roleId)
    }
    role = roles.find(role => role._id === roleId)
    roleName = role?.name ?? "Unknown role"
  }
</script>

<div>{roleName}</div>
