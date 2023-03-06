const getUserInitials = user => {
  if (user.firstName && user.lastName) {
    return user.firstName[0] + user.lastName[0]
  } else if (user.firstName) {
    return user.firstName[0]
  } else if (user.email) {
    return user.email[0]
  }

  return "U"
}

export default getUserInitials
