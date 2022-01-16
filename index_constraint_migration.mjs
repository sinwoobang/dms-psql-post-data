#!/usr/bin/env zx

console.log('[Input DB Information]');

let srcDBHost = await question('Source DB Host: ');
let srcDBUser = await question('Source DB User: ');
let srcDBName = await question('Source DB Name: ');

let tarDBHost = await question('Target DB Host: ');
let tarDBUser = await question('Target DB User: ');
let tarDBName = await question('Target DB Name: ');

console.log('[LOG] Dumping Source DB Post-data(Index, Constraint)...');
await $`pg_dump -h ${srcDBHost} -U ${srcDBUser} -Fc ${srcDBName} --section=post-data > postdata.dump`

console.log('[LOG] Restoring Post-data on Target DB...');
await $`pg_restore -h ${tarDBHost} -U ${tarDBUser} -d ${tarDBName} -v postdata.dump`
