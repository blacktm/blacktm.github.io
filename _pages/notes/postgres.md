---
title: PostgreSQL
---

<a href="/notes" class="back">← notes</a>

# PostgreSQL

Install PostgreSQL:

```terminal
$ brew install postgres
```

Start the database server:

```terminal
$ postgres -D /usr/local/var/postgres
```

List databases:

```terminal
$ psql -l
```

Enter the SQL prompt:

```terminal
$ psql -d postgres
postgres=#
```

Create a role (in the SQL prompt), replacing `user_name` with a desired user:

```sql
postgres=# create role user_name login createdb;
```

Stop the database server:

```terminal
$ pg_ctl -D /usr/local/var/postgres stop
```

Upgrade a database:

```terminal
brew postgresql-upgrade-database
```
