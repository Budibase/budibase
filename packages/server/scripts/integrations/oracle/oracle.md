# Installation

## Database

**Important**
- Oracle database is supported only on **x86-64 architecture**
- Oracle database is **not supported on Mac ARM architecture** (either via docker or linux virtualization)

To install oracle express edition simply run `docker-compose up`

- A single instance pluggable database (PDB) will be created named `xepdb1`
- The default password is configured in the compose file as `oracle`
    - The `system` and `pdbadmin` users share this password

## Instant Client

Before oracle can be connected to from nodejs, the oracle client must be installed.
For more information see https://www.oracle.com/database/technologies/instant-client/downloads.html

**Important**
- Oracle client is supported only on **x86-64 architecture**
- Oracle client is **not supported on Mac ARM architecture**

### Linux
Run the provided install script for linux from the `server` root path:

```bash
sudo /bin/bash -e scripts/integrations/oracle/instantclient/linux/x86-64/install.sh
```
For more information see: https://www.oracle.com/database/technologies/instant-client/linux-x86-64-downloads.html#ic_x64_inst

### Mac
**This has not yet been tested**

See: https://www.oracle.com/database/technologies/instant-client/macos-intel-x86-downloads.html#ic_osx_inst

# Management
To connect to oracle sql command line:

```bash
docker exec -it oracle-xe sqlplus -l system/oracle@localhost/xepdb1
```

To create a new schema (where a user is the same as a schema in oracle) named `sales`:

```sql
define USERNAME = sales

create user &USERNAME;

alter user &USERNAME
    default tablespace users
    temporary tablespace temp
    quota unlimited on users;

grant create session,
    create view,
    create sequence,
    create procedure,
    create table,
    create trigger,
    create type,
    create materialized view
    to &USERNAME;
```

To set the password for the sales schema use:

```sql
define USERNAME = sales
define PASSWORD = sales

alter user &USERNAME identified by &PASSWORD;
```

As before the database schema can now be connected to using:
```bash
docker exec -it oracle-xe sqlplus -l sales/sales@localhost:1521/xepdb1
```

## HR Schema

The `HR` schema is populated with dummy data by default in oracle for testing purposes.
To connect to the HR schema first update the user password and unlock the account by performing
```sql
ALTER USER hr ACCOUNT UNLOCK;
ALTER USER hr IDENTIFIED BY hr;
```
You should now be able to connect to the hr schema using the credentials hr/hr
