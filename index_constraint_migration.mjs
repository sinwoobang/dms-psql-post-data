#!/usr/bin/env zx

$.verbose = false;
const log = console.log;
const error = chalk.bold.red;

async function init() {
  log();
  log(chalk.cyan("Welcome to dms-psql-post-data"));
  log();
}

async function configure() {
  log(chalk.yellow("Reading your DB info..."));

  const dbInfo = await fs.readJson("./info.json");
  const { srcDBHost, srcDBUser, srcDBName, srcDBPass } = dbInfo;
  const { tarDBHost, tarDBUser, tarDBName, tarDBPass } = dbInfo;

  log(chalk.green("Done"));
  log();

  log(chalk.cyan("Input the number of job workers"));
  log(
    chalk.cyan(
      "NOTE: Increasing the number makes it faster, however it may cause DB locks."
    )
  );

  let restoreJobWorkerNum = await question(chalk.cyan("Default value[1]: "));
  restoreJobWorkerNum = restoreJobWorkerNum ? restoreJobWorkerNum : 1;
  log();

  return {
    ...dbInfo,
    restoreJobWorkerNum,
  };
}

async function dumpPostData({ srcDBHost, srcDBUser, srcDBName, srcDBPass }) {
  process.env.PGPASSWORD = srcDBPass;
  log(chalk.yellow("Dumping Source DB Post-data(Index, Constraint)..."));

  try {
    await $`pg_dump -h ${srcDBHost} -U ${srcDBUser} -Fc ${srcDBName} --section=post-data > postdata.dump`;
  } catch (p) {
    log(error("Exception detected: Is your Source DB information correct?"));
    log(error(`Error: ${p.stderr}`));
  }
}

async function restorePostData({
  tarDBHost,
  tarDBUser,
  tarDBName,
  tarDBPass,
  restoreJobWorkerNum,
}) {
  process.env.PGPASSWORD = tarDBPass;
  log(chalk.yellow("Restoring Post-data on Target DB..."));

  try {
    await $`pg_restore -h ${tarDBHost} -U ${tarDBUser} -d ${tarDBName} -j ${restoreJobWorkerNum} -v postdata.dump`;
  } catch (p) {
    log(error("Exception detected: Is your Target DB information correct?"));
    log(error(`Error: ${p.stderr}`));
  }
}

await init();

const config = await configure();

const skipDump = argv["skip-dump"];
if (skipDump) {
  log(chalk.cyan("Skip dump data..."));
} else {
  await dumpPostData(config);
}

await restorePostData(config);

log();
log(chalk.yellow("Finished"));
