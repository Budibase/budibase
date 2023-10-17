// UNUSED CODE
// Preserved for future use

/* eslint-disable no-unused-vars */

function getNewQuotaReset() {
  return Date.now() + 2592000000
}

function resetQuotasIfRequired(quota: { quotaReset: number; usageQuota: any }) {
  // Check if the quota needs reset
  if (Date.now() >= quota.quotaReset) {
    quota.quotaReset = getNewQuotaReset()
    for (let prop of Object.keys(quota.usageQuota)) {
      quota.usageQuota[prop] = 0
    }
  }
}
