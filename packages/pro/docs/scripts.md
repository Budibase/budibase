# Scripts

## Refresh License Cache

To refresh the cached license entry run the following command

```
yarn license:update
```

## Set Development License

To change between different plans in local development use the following command.

```
yarn license:generate <type>
```

The following values for `type` are accepted:

- `free`: reset the development license to the application default free
- `pro`
- `team`
- `business`
- `enterprise`

Refreshing the license cache is not required, this will automatically take place.
