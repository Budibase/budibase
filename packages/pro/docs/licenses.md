# Licenses

Licenses are populated into budibase and account portal users via the licensing middleware included in this package.

## License population

Licenses can be populated from by different means, depending on the environment.

### License API

The account-portal licensing API is used to retrieve a license for the current tenant based on the hosting type.

- **Self Host** - The License Key stored in the database is sent in the request and verified by the license API.
- **Cloud** - Cloud tenants do not have a License Key. Instead the tenant id and account portal internal API key are sent as headers to identify the license being requested.

### Offline

A [public-key](../offline-keys/public_key.pem) / [private-key](../offline-keys/private_key.pem) pair exist in the root of this repo.
The offline license population code is also hard coded to use the same public key.

Whenever a license cannot be retrieved over the license API, the offline license will be checked, which is stored in the budibase temp directory on your filesystem.
The integrity of the retrieved license will be checked to ensure it was generated with the expected private key.

This is currently limited to dev only. See [scripts](./scripts.md) for details on generating a new development offline license.
