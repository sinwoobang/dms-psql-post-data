# dms-psql-post-data
Ultimate Script to complete PostgreSQL-to-PostgreSQL Migration right after AWS DMS task done

## TL;DR
1. Sequence, Foreign key, Index, and Constraint are *not migrated* using AWS DMS.
2. You must need them if you want to promote the target DB as primary.
3. This script is responsible for completing a migration by putting them into your target DB.
