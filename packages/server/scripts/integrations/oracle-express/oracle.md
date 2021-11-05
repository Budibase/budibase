### Installation & Management

To install oracle express edition simply run `docker-compose up`

- A single instance pluggable database (PDB) will be created named `xepdb`
- The default password is configured in the compose file as `oracle`
  - The `system`, `sys` and `pdbadmin` users all share this password

To connect to oracle sql command line:

```bash
docker exec -it oracle-xe sqlplus -l system/oracle@localhost/xepdb1
```

To create a new schema (user = schema in oracle)

```sql
define USERNAME = rpowell

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

To set the password

```sql
define USERNAME = rpowell
define PASSWORD = rpowell

alter user &USERNAME identified by &PASSWORD;
```

As before the database schema can now be connected to 
```bash
docker exec -it oracle-xe sqlplus -l rpowell/rpowell@localhost:1521/xepdb1
```

### Oracle Instant Client
Before oracle can be connected to from nodejs, the oracle client must be installed. 

<!-- TODO: instructions -->

### HR Schema

The `HR` schema is populated with dummy data by default in oracle for testing purposes. 
To connect to the HR schema first update the user password and unlock the account by performing
```sql
ALTER USER hr ACCOUNT UNLOCK;
ALTER USER hr IDENTIFIED BY hr
```
You should now be able to connect to the hr schema using the credentials hr/hr

