import cron from 'node-cron';
import axios from "axios";
import fs from 'fs';
import path from "path";
import { getLoggerInstance } from './log';
import { parseArgs } from './args';

const performUpdates = async (log, config) => {
  const { dynServerUrl, apiKey, hosts = [] } = config;
  const apiCalls = hosts.map(host =>
    axios.post(`${dynServerUrl}/dns-record`, {
      host
    }, {
      headers: { 'x-api-key': apiKey }
    }).then(response => {
      if(!response.data.response) {
        log.error('Unable to process request. Check server logs for more detail.');
      } else {
        log.info(`Host record for ${host} updated.`);
      }
    }).catch(err => {
      log.error(err);
    })
  );
  return Promise.all(apiCalls);
};

const main = () => {
  const args = parseArgs();
  const configPath = args.config;

  const configStr = fs.readFileSync(configPath);
  const config = JSON.parse(configStr);

  const { hosts = [], logsDir = path.join(__dirname, 'logs') } = config;
  const log = getLoggerInstance(logsDir);

  log.debug('LambdaDyn initialized.');
  log.debug(`Found ${hosts.length} hosts.`);

  cron.schedule('*/1 * * * *', async () => {
    await performUpdates(log, config);
  });
};

main();