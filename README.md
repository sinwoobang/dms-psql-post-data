# dms-psql-post-data
Ultimate Script to complete PostgreSQL-to-PostgreSQL Migration right after AWS DMS task done

## TL;DR
Sequence, Foreign key, Index, and Constraint are available for migration.

## Why You Need It
1. Sequence, Foreign key, Index, and Constraint are *not migrated* using AWS DMS.
2. You must need them if you want to promote the target DB as primary.
3. This script is responsible for completing a migration by putting them into your target DB.

## How to Run
### Setup
```sh
git clone https://github.com/sinwoobang/dms-psql-post-data.git
npm -i g zx
```

### Migrating Sequence
1. Run [sequences_generator.sql](https://github.com/sinwoobang/dms-psql-post-data/blob/main/sequences_generator.sql) on your source DB.
2. Copy the result and run it on the target DB.

### Migrating Index & Constraint
1. Copy a template file
```sh
cp info-template.js info.js
```
2. Revise info.js
3. zx [index_constraint_migration.mjs](https://github.com/sinwoobang/dms-psql-post-data/blob/main/index_constraint_migration.mjs)

