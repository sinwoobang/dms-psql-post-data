#!/usr/bin/env zx

$.verbose = false;
const log = console.log;
const error = chalk.bold.red;


log();
log(chalk.green("Welcome to dms-psql-post-data"));
log();

log(chalk.yellow('Input your Source DB info'));

let srcDBHost = await question('[1/8] Source DB Host: ');
let srcDBUser = await question('[2/8] Source DB User: ');
let srcDBName = await question('[3/8] Source DB Name: ');
let srcDBPass = await question('[4/8] Source DB Password: ');

let tarDBHost = await question('[5/8] Target DB Host: ');
let tarDBUser = await question('[6/8] Target DB User: ');
let tarDBName = await question('[7/8] Target DB Name: ');
let tarDBPass = await question('[8/8] Target DB Password: ');

log('Input the number of job workers');
log(chalk.yellow('NOTE: Increasing the number makes it faster, however it may cause DB locks.'));

let restoreJobWorkerNum = await question('Default value[1]: ');
restoreJobWorkerNum = restoreJobWorkerNum ? restoreJobWorkerNum : 1;

process.env.PGPASSWORD = srcDBPass
log(chalk.yellow('Dumping Source DB Post-data(Index, Constraint)...'));

try {
  await $`pg_dump -h ${srcDBHost} -U ${srcDBUser} -Fc ${srcDBName} --section=post-data > postdata.dump`;
} catch (p) {
  log(error('Exception detected: Is your Source DB information correct?'));
  log(error(`Error: ${p.stderr}`));
}

process.env.PGPASSWORD = tarDBPass
log(chalk.yellow('Restoring Post-data on Target DB...'));

try {
  await $`pg_restore -h ${tarDBHost} -U ${tarDBUser} -d ${tarDBName} -j ${restoreJobWorkerNum} -v postdata.dump`;
} catch (p) {
  log(error('Exception detected: Is your Target DB information correct?'));
  log(error(`Error: ${p.stderr}`));
}

log();
log(chalk.yellow('Finished'))
